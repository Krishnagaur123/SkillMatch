package com.skillmatch.analytics.dto;



public record ResumeInsight(
        String skillName,
        double marketDemand,
        double marketImportance,
        double estimatedCoverageGain
) {}
