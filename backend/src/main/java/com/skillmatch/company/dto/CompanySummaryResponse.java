package com.skillmatch.company.dto;

import java.util.UUID;

public record CompanySummaryResponse(
        UUID id,
        String name,
        String logoUrl
) {}
