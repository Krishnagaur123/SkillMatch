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


    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(
            @Valid @RequestBody(required = false) RefreshRequest body,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String token = resolveRefreshToken(body == null ? null : body.refreshToken(), request);
        try {
            String newAccessToken = authService.refreshToken(token);
            response.addCookie(buildAccessTokenCookie(newAccessToken));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            clearAuthCookies(response);
            throw e;
        }
    }


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
