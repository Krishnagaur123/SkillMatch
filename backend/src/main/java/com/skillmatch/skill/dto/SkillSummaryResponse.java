package com.skillmatch.skill.dto;

import java.util.UUID;

public record SkillSummaryResponse(
        UUID id,
        String name
) {
}
