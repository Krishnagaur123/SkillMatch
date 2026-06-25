package com.skillmatch.opportunity.service;

import java.util.List;

public record MatchResult(
        int matchPercentage,
        List<String> matchedSkills,
        List<String> missingRequiredSkills,
        List<String> missingPreferredSkills,
        List<String> missingGoodToHaveSkills
) {}
