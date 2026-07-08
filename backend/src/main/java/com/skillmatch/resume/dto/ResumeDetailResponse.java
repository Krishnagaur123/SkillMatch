package com.skillmatch.resume.dto;

import com.skillmatch.resume.entity.ResumeStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ResumeDetailResponse(
        UUID id,
        String title,
        String fileName,
        Long fileSize,
        ResumeStatus status,
        boolean active,
        LocalDateTime uploadedAt,
        List<String> skills,
        int educationCount,
        int experienceCount
) {}
