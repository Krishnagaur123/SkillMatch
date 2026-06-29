package com.skillmatch.application.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateApplicationRequest(
        @NotNull(message = "Opportunity ID is required")
        UUID opportunityId
) {}
