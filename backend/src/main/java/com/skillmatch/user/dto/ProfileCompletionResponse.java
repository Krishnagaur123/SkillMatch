package com.skillmatch.user.dto;

import java.util.List;

/**
 * Response DTO for the dynamic profile completion computation.
 *
 * <p>Completion is never stored in the database; it is computed on every request
 * by {@code ProfileCompletionService}.
 *
 * @param completionPercentage  0–100 integer percentage
 * @param completedSections     human-readable names of completed sections
 * @param missingSections       human-readable names of incomplete sections
 * @param nextRecommendedAction the single most important next action for the user
 */
public record ProfileCompletionResponse(
        int completionPercentage,
        List<String> completedSections,
        List<String> missingSections,
        String nextRecommendedAction
) {}
