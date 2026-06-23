package com.skillmatch.auth.controller;

import com.skillmatch.auth.dto.LogoutRequest;
import com.skillmatch.auth.dto.RefreshRequest;
import com.skillmatch.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

/**
 * Auth REST endpoints.
 *
 * <ul>
 *   <li>{@code POST /api/v1/auth/refresh} — exchange a refresh token for a new access JWT</li>
 *   <li>{@code POST /api/v1/auth/logout}  — revoke the refresh token and clear cookies</li>
 * </ul>
 *
 * Both endpoints accept the token from the request body <em>or</em> fall back to the
 * {@code refresh_token} HttpOnly cookie, giving maximum flexibility to both browser
 * and native API clients.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String REFRESH_TOKEN_COOKIE = "refresh_token";
    private static final String ACCESS_TOKEN_COOKIE  = "access_token";

    private final AuthService authService;

    @Value("${app.jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    /**
     * Exchanges a valid refresh token for a fresh JWT access token.
     * If the {@code refresh_token} cookie is present, it takes precedence over the body.
     */
    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(
            @Valid @RequestBody(required = false) RefreshRequest body,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String token = resolveRefreshToken(body == null ? null : body.refreshToken(), request);
        String newAccessToken = authService.refreshToken(token);
        response.addCookie(buildAccessTokenCookie(newAccessToken));
        return ResponseEntity.noContent().build();
    }

    /**
     * Revokes the refresh token and clears both auth cookies.
     * The access token will expire naturally within 15 minutes (stateless — no server-side revocation).
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @Valid @RequestBody(required = false) LogoutRequest body,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String token = resolveRefreshToken(body == null ? null : body.refreshToken(), request);
        authService.logout(token);
        clearAuthCookies(response);
        return ResponseEntity.noContent().build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Resolves the refresh token: body first, then cookie. */
    private String resolveRefreshToken(String bodyToken, HttpServletRequest request) {
        if (bodyToken != null && !bodyToken.isBlank()) {
            return bodyToken;
        }
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(c -> REFRESH_TOKEN_COOKIE.equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                            org.springframework.http.HttpStatus.BAD_REQUEST, "Refresh token is required"));
        }
        throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST, "Refresh token is required");
    }

    /** Expires both HttpOnly cookies immediately. */
    private void clearAuthCookies(HttpServletResponse response) {
        response.addCookie(expiredCookie(ACCESS_TOKEN_COOKIE));
        response.addCookie(expiredCookie(REFRESH_TOKEN_COOKIE));
    }

    private Cookie expiredCookie(String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Lax");
        return cookie;
    }

    private Cookie buildAccessTokenCookie(String token) {
        Cookie cookie = new Cookie(ACCESS_TOKEN_COOKIE, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge((int) (accessTokenExpirationMs / 1000));
        cookie.setAttribute("SameSite", "Lax");
        return cookie;
    }
}
