package com.skillmatch.company.dto;

import java.util.UUID;

public record CompanyDetailResponse(
        UUID id,
        String name,
        String logoUrl,
        String website,
        String industry,
        String headquarters,
        Integer employeeCount,
        Integer foundedYear,
        String description,
        long openOpportunities
) {}
