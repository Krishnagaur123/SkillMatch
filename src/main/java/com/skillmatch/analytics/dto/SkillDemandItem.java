package com.skillmatch.analytics.dto;


public record SkillDemandItem(
        String skillName,
        double marketDemand,
        double marketImportance
) {}
