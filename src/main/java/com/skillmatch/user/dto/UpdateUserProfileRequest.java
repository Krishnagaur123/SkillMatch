package com.skillmatch.user.dto;

import java.util.Set;
import java.util.UUID;

public record UpdateUserProfileRequest(
        String name,
        Set<UUID> targetRoleIds
) {}
