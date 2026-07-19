package com.skillmatch.user.service;

import com.skillmatch.user.dto.UpdateUserProfileDetailRequest;
import com.skillmatch.user.dto.UserProfileDetailResponse;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.entity.UserProfile;
import com.skillmatch.user.mapper.UserProfileMapper;
import com.skillmatch.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Manages the extended professional profile for every authenticated user.
 *
 * <p>Design principles:
 * <ul>
 *   <li>A profile is <em>always</em> present for any authenticated user.
 *       {@link #getOrCreateProfile(User)} is the single place where profile
 *       creation happens — it is reused by every public method.</li>
 *   <li>The {@link User} entity is never modified here; only {@link UserProfile}
 *       is mutated to preserve the authentication layer's clean boundary.</li>
 *   <li>All mapping is delegated to {@link UserProfileMapper}.</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final CurrentUserService currentUserService;
    private final UserProfileRepository userProfileRepository;

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Returns the profile detail for the currently authenticated user.
     * Creates an empty profile automatically if none exists yet.
     */
    @Transactional(readOnly = true)
    public UserProfileDetailResponse getCurrentUserProfile() {
        User user = currentUserService.getCurrentUser();
        UserProfile profile = getOrCreateProfile(user);
        return UserProfileMapper.toDetailResponse(profile, user);
    }

    /**
     * Applies a partial update (patch semantics) to the authenticated user's profile.
     * Fields absent (null) in the request are left unchanged.
     */
    @Transactional
    public UserProfileDetailResponse updateCurrentUserProfile(UpdateUserProfileDetailRequest request) {
        User user = currentUserService.getCurrentUser();
        UserProfile profile = getOrCreateProfile(user);
        UserProfileMapper.applyUpdate(request, profile);
        UserProfile saved = userProfileRepository.save(profile);
        return UserProfileMapper.toDetailResponse(saved, user);
    }

    /**
     * Returns the profile for the given user, to be used by other services
     * (e.g. ProfileCompletionService, AuthService) without triggering a
     * SecurityContext lookup.
     *
     * <p>Creates an empty profile automatically if none exists.
     */
    @Transactional
    public UserProfile getOrCreateProfile(User user) {
        return userProfileRepository.findByUser(user)
                .orElseGet(() -> createEmptyProfile(user));
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private UserProfile createEmptyProfile(User user) {
        log.info("Creating empty UserProfile for user id={}", user.getId());
        UserProfile profile = UserProfile.builder()
                .user(user)
                .openToWork(false)
                .build();
        return userProfileRepository.save(profile);
    }
}
