package com.skillmatch.auth.service;

import com.skillmatch.auth.util.JwtService;
import com.skillmatch.user.entity.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Invoked by Spring Security after a successful OAuth2 / OIDC login.
 *
 * <p><strong>Flow</strong>
 * <ol>
 *   <li>Extract {@code sub}, {@code email}, {@code name}, {@code picture} from the
 *       {@link OAuth2User} / {@link OidcUser} principal.</li>
 *   <li>Call {@link AuthService#handleOAuthUser} to find or create the {@link User}.</li>
 *   <li>Generate a short-lived JWT access token and a long-lived opaque refresh token.</li>
 *   <li>Write both as {@code HttpOnly; Secure; SameSite=Strict} cookies — tokens are
 *       <em>never</em> placed in URL query parameters.</li>
 *   <li>Redirect the browser to the configured frontend URL.</li>
 * </ol>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private static final String ACCESS_TOKEN_COOKIE  = "access_token";
    private static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    private final AuthService authService;
    private final JwtService  jwtService;

    @Value("${app.auth.redirect-url}")
    private String redirectUrl;

    @Value("${app.jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    @Value("${app.jwt.refresh-token-expiration-days}")
    private int refreshTokenExpirationDays;

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        Object principal = authentication.getPrincipal();

        // Google uses OIDC — the principal is an OidcUser; fall back to generic OAuth2User
        String sub, email, name, picture;
        if (principal instanceof OidcUser oidcUser) {
            sub     = oidcUser.getSubject();
            email   = oidcUser.getEmail();
            name    = oidcUser.getFullName();
            picture = oidcUser.getPicture();
        } else if (principal instanceof OAuth2User oauth2User) {
            sub     = oauth2User.getAttribute("sub");
            email   = oauth2User.getAttribute("email");
            name    = oauth2User.getAttribute("name");
            picture = oauth2User.getAttribute("picture");
        } else {
            log.error("Unexpected principal type: {}", principal.getClass().getName());
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unsupported OAuth2 principal");
            return;
        }

        // Find or create the user in the database
        User user = authService.handleOAuthUser(email, name, picture, sub);

        // Mint tokens
        String accessToken  = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = authService.createRefreshToken(user);

        // Write HttpOnly cookies — tokens are never exposed in the URL
        response.addCookie(buildCookie(ACCESS_TOKEN_COOKIE,  accessToken,  (int) (accessTokenExpirationMs / 1000)));
        response.addCookie(buildCookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenExpirationDays * 24 * 60 * 60));

        log.debug("OAuth2 login successful for user id={}, redirecting to {}", user.getId(), redirectUrl);
        response.sendRedirect(redirectUrl);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Cookie buildCookie(String name, String value, int maxAgeSeconds) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeSeconds);
        cookie.setAttribute("SameSite", "Lax");
        return cookie;
    }
}
