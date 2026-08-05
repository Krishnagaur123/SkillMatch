package com.skillmatch.opportunity.dto;

import com.skillmatch.common.enums.EmploymentType;
import com.skillmatch.common.enums.ExperienceLevel;
import com.skillmatch.common.enums.WorkMode;

import java.time.LocalDateTime;
import java.util.UUID;

public record OpportunityIngestionRequest(
        UUID companyId,
        String title,
        String description,
        String location,
        WorkMode workMode,
        EmploymentType employmentType,
        ExperienceLevel experienceLevel,
        String applyUrl,
        String source,
        String externalId,
        LocalDateTime postedAt,
        LocalDateTime expiresAt,
        Boolean active
) {}
