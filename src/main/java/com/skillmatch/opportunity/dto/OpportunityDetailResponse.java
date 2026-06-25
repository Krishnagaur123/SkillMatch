package com.skillmatch.opportunity.dto;

import com.skillmatch.common.enums.EmploymentType;
import com.skillmatch.common.enums.ExperienceLevel;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OpportunityDetailResponse(
        UUID id,
        String title,
        String company,
        String location,
        EmploymentType employmentType,
        ExperienceLevel experienceLevel,
        String description,
        String applicationUrl,
        String source,
        LocalDateTime postedAt,
        LocalDateTime expiresAt,
        boolean active,
        List<String> skills,
        List<String> targetRoles
) {}
