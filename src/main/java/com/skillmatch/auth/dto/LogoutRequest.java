package com.skillmatch.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request body for POST /api/v1/auth/logout.
 * Clients that store the refresh token in a non-HttpOnly context send it here.
 * If cookies are used, the filter reads it automatically.
 */
public record LogoutRequest(
        @NotBlank(message = "Refresh token must not be blank")
        String refreshToken
) {}
