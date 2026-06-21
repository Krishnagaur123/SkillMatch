package com.skillmatch.auth.filter;

import com.skillmatch.auth.util.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

/**
 * Intercepts every request once. If a valid JWT is found (either in the
 * {@code Authorization: Bearer <token>} header or the {@code access_token} HttpOnly cookie),
 * the security context is populated so downstream handlers see an authenticated principal.
 *
 * <p>The filter is intentionally silent on invalid tokens — it simply leaves the security
 * context empty and lets Spring Security return a 401 for protected endpoints.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX       = "Bearer ";
    private static final String ACCESS_TOKEN_COOKIE = "access_token";

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String token = resolveToken(request);

        if (StringUtils.hasText(token) && jwtService.validateToken(token)) {
            try {
                UUID userId = jwtService.extractUserId(token);
                String email = jwtService.extractEmail(token);

                // Principal is the userId string; credentials cleared for stateless design
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(auth);
                log.trace("JWT authenticated request for userId={}", userId);
            } catch (Exception e) {
                log.debug("Failed to set authentication from JWT: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Resolves the JWT from the {@code Authorization} header first, then falls back
     * to the {@code access_token} cookie.
     */
    private String resolveToken(HttpServletRequest request) {
        // 1. Authorization header (SPA clients / mobile apps)
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith(BEARER_PREFIX)) {
            return header.substring(BEARER_PREFIX.length());
        }

        // 2. HttpOnly cookie (browser clients)
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(c -> ACCESS_TOKEN_COOKIE.equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        return null;
    }
}
