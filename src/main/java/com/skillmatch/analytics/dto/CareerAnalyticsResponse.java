package com.skillmatch.analytics.dto;

import java.util.List;

public record CareerAnalyticsResponse(
        int coverage,
        List<LearningRoadmapItem> learningRoadmap,
        List<SkillDemandItem>     skillsInDemand,
        List<SkillDemandItem>     topStrengths,
        List<ResumeInsight>       resumeInsights
) {}
