package com.skillmatch.user.dto;

import java.util.UUID;


public record UserSkillResponse(
        UUID skillId,
        String skillName
) {}
