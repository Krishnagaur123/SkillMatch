package com.skillmatch.auth.service;

import com.skillmatch.auth.enums.AuthProvider;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.repository.UserRepository;
import com.skillmatch.user.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileService userProfileService;

    /**
     * Resolves or creates the application User for an incoming OAuth2 login,
     * and ensures a {@code UserProfile} always exists for that user.
     *
     * <p>For new users  — creates User then creates an empty UserProfile.<br>
     * For returning users — updates name/picture and defensively ensures a
     * UserProfile exists (handles any edge case from a prior migration reset).
     */
    @Transactional
    public User handleOAuthUser(@NonNull String email, @NonNull String name,
                                String picture, @NonNull String providerUserId) {

        User user = userRepository
                .findByProviderAndProviderUserId(AuthProvider.GOOGLE, providerUserId)
                .map(existing -> {
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

        // Guarantee: every authenticated user always has a UserProfile.
        userProfileService.getOrCreateProfile(user);

        return user;
    }
}
