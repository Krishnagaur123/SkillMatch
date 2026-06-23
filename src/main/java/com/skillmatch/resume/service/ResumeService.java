package com.skillmatch.resume.service;

import com.skillmatch.resume.dto.ResumeDetailResponse;
import com.skillmatch.resume.dto.ResumeSummaryResponse;
import com.skillmatch.resume.dto.ResumeUploadResponse;
import com.skillmatch.resume.entity.Resume;
import com.skillmatch.resume.entity.ResumeStatus;
import com.skillmatch.resume.parser.ResumeParserService;
import com.skillmatch.resume.repository.ResumeEducationRepository;
import com.skillmatch.resume.repository.ResumeExperienceRepository;
import com.skillmatch.resume.repository.ResumeRepository;
import com.skillmatch.resume.repository.ResumeSkillRepository;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.service.CurrentUserService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private static final int MAX_EXTRACTED_TEXT_LENGTH = 100_000;

    private final CurrentUserService currentUserService;
    private final ResumeRepository resumeRepository;
    private final ResumeParserService resumeParserService;
    private final ResumeAnalysisService resumeAnalysisService;
    private final ResumeSkillRepository resumeSkillRepository;
    private final ResumeEducationRepository resumeEducationRepository;
    private final ResumeExperienceRepository resumeExperienceRepository;

    @Value("${app.resume.storage-path}")
    private String storagePath;

    @Value("${app.resume.max-file-size-mb}")
    private int maxFileSizeMb;

    @Transactional
    public ResumeUploadResponse uploadResume(MultipartFile file, String titleParam) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must not be empty");
        }
        if (file.getSize() > (long) maxFileSizeMb * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File exceeds maximum allowed size");
        }

        String originalFilename = file.getOriginalFilename();
        if (!"application/pdf".equals(file.getContentType())
                || originalFilename == null
                || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF files are supported");
        }

        String sanitizedFilename = Path.of(originalFilename).getFileName().toString();
        if (sanitizedFilename.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF files are supported");
        }

        if (storagePath == null || storagePath.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Storage path is not configured");
        }

        User user = currentUserService.getCurrentUser();

        if (resumeRepository.existsByUserAndFileName(user, sanitizedFilename)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Resume with same filename already exists");
        }

        String resolvedTitle = (titleParam != null && !titleParam.isBlank())
                ? titleParam
                : sanitizedFilename.substring(0, sanitizedFilename.lastIndexOf('.'));

        boolean isFirstResume = !resumeRepository.existsByUser(user);

        UUID fileId = UUID.randomUUID();
        Path storageDir = Paths.get(storagePath);
        Path destination = storageDir.resolve(fileId + ".pdf");

        try {
            Files.createDirectories(storageDir);
            file.transferTo(destination);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file");
        }

        try {
            Resume resume = Resume.builder()
                    .user(user)
                    .title(resolvedTitle)
                    .fileName(sanitizedFilename)
                    .storagePath(destination.toString())
                    .fileSize(file.getSize())
                    .status(ResumeStatus.UPLOADED)
                    .active(isFirstResume)
                    .build();

            try {
                String text = resumeParserService.extractText(destination);
                if (text != null && text.length() > MAX_EXTRACTED_TEXT_LENGTH) {
                    text = text.substring(0, MAX_EXTRACTED_TEXT_LENGTH);
                }
                resume.setExtractedText(text);
                resume.setStatus(ResumeStatus.TEXT_EXTRACTED);
            } catch (Exception e) {
                resume.setStatus(ResumeStatus.FAILED);
            }

            resume = resumeRepository.save(resume);

            if (resume.getStatus() == ResumeStatus.TEXT_EXTRACTED) {
                resumeAnalysisService.analyze(resume);
            }

            return toUploadResponse(resume);
        } catch (Exception e) {
            try {
                Files.deleteIfExists(destination);
            } catch (IOException ignored) {
            }
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<ResumeSummaryResponse> listCurrentUserResumes() {
        User user = currentUserService.getCurrentUser();
        return resumeRepository.findAllByUserOrderByUploadedAtDesc(user)
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResumeDetailResponse getResume(UUID resumeId) {
        User user = currentUserService.getCurrentUser();
        Resume resume = resumeRepository.findByIdAndUser(resumeId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found"));
        return toDetailResponse(resume);
    }

    @Transactional
    public void deleteResume(UUID resumeId) {
        User user = currentUserService.getCurrentUser();
        Resume resume = resumeRepository.findByIdAndUser(resumeId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found"));

        Path filePath = Paths.get(resume.getStoragePath());
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete file");
        }

        resumeRepository.delete(resume);
    }

    @Transactional
    public ResumeDetailResponse activateResume(UUID resumeId) {
        User user = currentUserService.getCurrentUser();
        Resume target = resumeRepository.findByIdAndUser(resumeId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found"));

        resumeRepository.findAllByUser(user).forEach(r -> r.setActive(false));
        target.setActive(true);
        resumeRepository.save(target);

        return toDetailResponse(target);
    }

    private ResumeUploadResponse toUploadResponse(Resume resume) {
        return new ResumeUploadResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getFileName(),
                resume.getStatus(),
                resume.getActive(),
                resume.getUploadedAt()
        );
    }

    private ResumeSummaryResponse toSummaryResponse(Resume resume) {
        return new ResumeSummaryResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getFileName(),
                resume.getStatus(),
                resume.getActive(),
                resume.getUploadedAt()
        );
    }

    private ResumeDetailResponse toDetailResponse(Resume resume) {
        List<String> skillNames = resumeSkillRepository.findAllByResumeWithSkill(resume)
                .stream()
                .map(rs -> rs.getSkill().getName())
                .toList();
        int educationCount = (int) resumeEducationRepository.countByResume(resume);
        int experienceCount = (int) resumeExperienceRepository.countByResume(resume);

        return new ResumeDetailResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getFileName(),
                resume.getFileSize(),
                resume.getStatus(),
                resume.getActive(),
                resume.getUploadedAt(),
                skillNames,
                educationCount,
                experienceCount
        );
    }
}
