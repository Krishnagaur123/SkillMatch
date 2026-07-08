package com.skillmatch.resume.dto;

import com.skillmatch.resume.entity.ResumeStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ResumeSummaryResponse(
        UUID id,
        String title,
        String fileName,
        ResumeStatus status,
        boolean active,
        LocalDateTime uploadedAt
) {}
