package com.skillmatch.auth.service;

import com.skillmatch.auth.entity.RefreshToken;
import com.skillmatch.auth.enums.AuthProvider;
import com.skillmatch.auth.repository.RefreshTokenRepository;
import com.skillmatch.auth.util.JwtService;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Value("${app.jwt.refresh-token-expiration-days}")
    private int refreshTokenExpirationDays;

    @Transactional
    public User handleOAuthUser(@NonNull String email, @NonNull String name, String picture, @NonNull String providerUserId) {
        return userRepository
                .findByProviderAndProviderUserId(AuthProvider.GOOGLE, providerUserId)
                .map(existing -> {
                    // Keep profile data in sync with the provider
                    existing.setName(name);
                    existing.setProfilePictureUrl(picture);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    log.info("Creating new user from Google OAuth2 login: email={}", email);
                    User newUser = User.builder()
                            .email(email)
                            .name(name)
                            .profilePictureUrl(picture)
                            .provider(AuthProvider.GOOGLE)
                            .providerUserId(providerUserId)
                            .build();
                    return userRepository.save(newUser);
                });
    }

    @Transactional
    public String createRefreshToken(@NonNull User user) {
        String rawToken = UUID.randomUUID().toString();

        RefreshToken entity = RefreshToken.builder()
                .user(user)
                .token(rawToken)
                .expiresAt(LocalDateTime.now().plusDays(refreshTokenExpirationDays))
                .build();

        refreshTokenRepository.save(entity);
        return rawToken;
    }

    @Transactional
    public String refreshToken(@NonNull String rawRefreshToken) {
        RefreshToken stored = refreshTokenRepository
                .findByToken(rawRefreshToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(stored);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token has expired");
        }

        User user = stored.getUser();
        return jwtService.generateAccessToken(user.getId(), user.getEmail());
    }

    @Transactional
    public void logout(@NonNull String rawRefreshToken) {
        RefreshToken stored = refreshTokenRepository
                .findByToken(rawRefreshToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        refreshTokenRepository.delete(stored);
        log.debug("Refresh token revoked for user id={}", stored.getUser().getId());
    }
}
