package com.skillmatch.resume.service;

import com.skillmatch.resume.entity.*;
import com.skillmatch.resume.extractor.*;
import com.skillmatch.resume.repository.*;
import com.skillmatch.skill.entity.Skill;
import com.skillmatch.skill.repository.SkillRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeAnalysisService {

    private final SkillExtractor skillExtractor;
    private final EducationExtractor educationExtractor;
    private final ExperienceExtractor experienceExtractor;
    private final ResumeSkillRepository resumeSkillRepository;
    private final ResumeEducationRepository resumeEducationRepository;
    private final ResumeExperienceRepository resumeExperienceRepository;
    private final ResumeRepository resumeRepository;
    private final SkillRepository skillRepository;

    @Transactional
    public void analyze(Resume resume) {
        try {
            resumeSkillRepository.deleteAllByResume(resume);
            resumeEducationRepository.deleteAllByResume(resume);
            resumeExperienceRepository.deleteAllByResume(resume);

            String text = resume.getExtractedText();

            Set<UUID> skillIds = skillExtractor.extract(text);
            for (UUID skillId : skillIds) {
                skillRepository.findById(skillId).ifPresent(skill ->
                        resumeSkillRepository.save(
                                ResumeSkill.builder().resume(resume).skill(skill).build()
                        )
                );
            }

            List<EducationExtractionResult> educations = educationExtractor.extract(text);
            for (EducationExtractionResult edu : educations) {
                resumeEducationRepository.save(
                        ResumeEducation.builder()
                                .resume(resume)
                                .institution(edu.institution())
                                .degree(edu.degree())
                                .fieldOfStudy(edu.fieldOfStudy())
                                .startYear(edu.startYear())
                                .endYear(edu.endYear())
                                .cgpa(edu.cgpa())
                                .build()
                );
            }

            List<ExperienceExtractionResult> experiences = experienceExtractor.extract(text);
            for (ExperienceExtractionResult exp : experiences) {
                resumeExperienceRepository.save(
                        ResumeExperience.builder()
                                .resume(resume)
                                .company(exp.company())
                                .jobTitle(exp.jobTitle())
                                .startDate(exp.startDate())
                                .endDate(exp.endDate())
                                .description(exp.description())
                                .build()
                );
            }

            resume.setStatus(ResumeStatus.ANALYZED);
            resume.setAnalyzedAt(LocalDateTime.now());
            resumeRepository.save(resume);
        } catch (Exception e) {
            resume.setStatus(ResumeStatus.FAILED);
            resumeRepository.save(resume);
        }
    }
}
