package com.skillmatch.opportunity.dto;

import com.skillmatch.common.enums.EmploymentType;
import com.skillmatch.common.enums.ExperienceLevel;

import java.util.UUID;

public record OpportunitySummaryResponse(
        UUID id,
        String title,
        String company,
        String location,
        ExperienceLevel experienceLevel,
        EmploymentType employmentType
) {}
