package com.skillmatch.resume.controller;

import com.skillmatch.resume.dto.ResumeDetailResponse;
import com.skillmatch.resume.dto.ResumeSummaryResponse;
import com.skillmatch.resume.dto.ResumeUploadResponse;
import com.skillmatch.resume.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeUploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resumeService.uploadResume(file, title));
    }

    @GetMapping
    public ResponseEntity<List<ResumeSummaryResponse>> list() {
        return ResponseEntity.ok(resumeService.listCurrentUserResumes());
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<ResumeDetailResponse> get(@PathVariable UUID resumeId) {
        return ResponseEntity.ok(resumeService.getResume(resumeId));
    }

    @PutMapping("/{resumeId}/activate")
    public ResponseEntity<ResumeDetailResponse> activate(@PathVariable UUID resumeId) {
        return ResponseEntity.ok(resumeService.activateResume(resumeId));
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<Void> delete(@PathVariable UUID resumeId) {
        resumeService.deleteResume(resumeId);
        return ResponseEntity.noContent().build();
    }
}
