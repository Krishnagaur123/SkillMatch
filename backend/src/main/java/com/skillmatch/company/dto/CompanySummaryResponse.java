package com.skillmatch.company.dto;

import java.util.UUID;

public record CompanySummaryResponse(
        UUID id,
        String name,
        String logoUrl,
        String website,
        String industry,
        String headquarters,
        Integer employeeCount,
        Integer foundedYear,
        String description,
        Long openRolesCount
) {
    public CompanySummaryResponse(UUID id, String name, String logoUrl) {
        this(id, name, logoUrl, null, null, null, null, null, null, null);
    }
}
