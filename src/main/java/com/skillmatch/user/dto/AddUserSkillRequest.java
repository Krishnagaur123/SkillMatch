package com.skillmatch.user.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;


public record AddUserSkillRequest(
        @NotNull(message = "skillId must not be null")
        UUID skillId
) {}
