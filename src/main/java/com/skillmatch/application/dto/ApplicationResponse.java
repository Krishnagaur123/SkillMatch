package com.skillmatch.application.dto;

import com.skillmatch.common.enums.ApplicationStatus;

import com.skillmatch.opportunity.dto.OpportunityCardResponse;
import java.time.LocalDateTime;
import java.util.UUID;

public record ApplicationResponse(
        UUID applicationId,
        ApplicationStatus status,
        LocalDateTime appliedAt,
        LocalDateTime updatedAt,
        String notes,
        OpportunityCardResponse opportunity,
        int currentMatchPercentage
) {}
