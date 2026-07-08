package com.skillmatch.analytics.dto;

public record LearningRoadmapItem(
        String skillName,
        double marketDemand,
        double marketImportance,
        double estimatedCoverageGain
) {}
