package com.skillmatch.application.dto;

import com.skillmatch.common.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateApplicationRequest(
        @NotNull(message = "Status is required")
        ApplicationStatus status,
        String notes
) {}
