package com.skillmatch.role.dto;

import java.util.UUID;

public record TargetRoleResponse(
        UUID id,
        String name
) {}
