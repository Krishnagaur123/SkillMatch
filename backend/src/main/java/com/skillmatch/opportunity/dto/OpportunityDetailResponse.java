package com.skillmatch.opportunity.dto;

import com.skillmatch.common.enums.EmploymentType;
import com.skillmatch.common.enums.ExperienceLevel;
import com.skillmatch.company.dto.CompanySummaryResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OpportunityDetailResponse(
        UUID id,
        String title,
        CompanySummaryResponse company,
        String location,
        EmploymentType employmentType,
        ExperienceLevel experienceLevel,
        String description,
        String applyUrl,
        String source,
        LocalDateTime postedAt,
        LocalDateTime expiresAt,
        boolean active,
        List<String> requiredSkills,
        List<String> preferredSkills,
        List<String> goodToHaveSkills,
        List<String> targetRoles
) {}
