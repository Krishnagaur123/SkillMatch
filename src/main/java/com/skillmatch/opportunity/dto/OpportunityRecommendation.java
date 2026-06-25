package com.skillmatch.opportunity.dto;

import com.skillmatch.common.enums.EmploymentType;
import com.skillmatch.common.enums.ExperienceLevel;

import java.util.List;
import java.util.UUID;

public record OpportunityRecommendation(
        UUID opportunityId,
        String title,
        String company,
        String location,
        EmploymentType employmentType,
        ExperienceLevel experienceLevel,
        int matchPercentage,
        List<String> matchedSkills,
        List<String> missingRequiredSkills,
        List<String> missingPreferredSkills,
        List<String> missingGoodToHaveSkills
) {}
