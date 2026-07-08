package com.skillmatch.role.dto;

import java.util.List;
import java.util.UUID;

public record UpdateTargetRolesRequest(
        List<UUID> targetRoleIds
) {}
