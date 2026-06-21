package com.skillmatch.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request body for POST /api/v1/auth/refresh.
 * The client sends the opaque refresh token obtained from the HttpOnly cookie.
 */
public record RefreshRequest(
        @NotBlank(message = "Refresh token must not be blank")
        String refreshToken
) {}
