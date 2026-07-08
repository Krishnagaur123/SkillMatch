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

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private static final String ACCESS_TOKEN_COOKIE = "access_token";

    private final AuthService authService;
    private final JwtService jwtService;

    @Value("${app.auth.redirect-url}")
    private String redirectUrl;

    @Value("${app.jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        Object principal = authentication.getPrincipal();

        String sub, email, name, picture;
        if (principal instanceof OidcUser oidcUser) {
            sub = oidcUser.getSubject();
            email = oidcUser.getEmail();
            name = oidcUser.getFullName();
            picture = oidcUser.getPicture();
        } else if (principal instanceof OAuth2User oauth2User) {
            sub = oauth2User.getAttribute("sub");
            email = oauth2User.getAttribute("email");
            name = oauth2User.getAttribute("name");
            picture = oauth2User.getAttribute("picture");
        } else {
            log.error("Unexpected principal type: {}", principal.getClass().getName());
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unsupported OAuth2 principal");
            return;
        }

        User user = authService.handleOAuthUser(email, name, picture, sub);

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());

        response.addCookie(buildCookie(ACCESS_TOKEN_COOKIE, accessToken, (int) (accessTokenExpirationMs / 1000)));

        log.debug("OAuth2 login successful for user id={}, redirecting to {}", user.getId(), redirectUrl);
        response.sendRedirect(redirectUrl);
    }

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
