package com.skillmatch.common.util;

import com.skillmatch.common.enums.SkillImportance;

/**
 * Single source of truth for skill importance weights.
 * Used by both MatchingService and CareerAnalyticsService.
 */
public final class SkillImportanceWeights {

    public static final int REQUIRED     = 5;
    public static final int PREFERRED    = 2;
    public static final int GOOD_TO_HAVE = 1;

    private SkillImportanceWeights() {}

    public static int weightOf(SkillImportance importance) {
        return switch (importance) {
            case REQUIRED     -> REQUIRED;
            case PREFERRED    -> PREFERRED;
            case GOOD_TO_HAVE -> GOOD_TO_HAVE;
        };
    }
}
