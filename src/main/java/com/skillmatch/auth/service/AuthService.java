package com.skillmatch.auth.service;

import com.skillmatch.auth.enums.AuthProvider;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    @Transactional
    public User handleOAuthUser(@NonNull String email, @NonNull String name, String picture, @NonNull String providerUserId) {
        return userRepository
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
    }
}
