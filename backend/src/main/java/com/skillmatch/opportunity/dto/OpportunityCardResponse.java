package com.skillmatch.opportunity.dto;

import com.skillmatch.company.dto.CompanySummaryResponse;

import java.util.UUID;

public record OpportunityCardResponse(
        UUID id,
        String title,
        String location,
        CompanySummaryResponse company
) {}
