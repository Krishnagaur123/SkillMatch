package com.skillmatch.user.controller;

import com.skillmatch.user.dto.ProfileCompletionResponse;
import com.skillmatch.user.dto.UpdateUserProfileDetailRequest;
import com.skillmatch.user.dto.UserProfileDetailResponse;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.entity.UserProfile;
import com.skillmatch.user.service.CurrentUserService;
import com.skillmatch.user.service.ProfileCompletionService;
import com.skillmatch.user.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for the user's extended professional profile.
 *
 * <p>All endpoints require an authenticated principal (enforced globally by
 * {@code SecurityConfig}). The controller is intentionally thin — it resolves
 * the current user, delegates to the service layer, and returns the DTO.
 *
 * <p>Routes:
 * <ul>
 *   <li>{@code GET  /api/v1/profile}            — retrieve current user's profile detail</li>
 *   <li>{@code PUT  /api/v1/profile}            — update current user's profile (patch semantics)</li>
 *   <li>{@code GET  /api/v1/profile/completion} — retrieve dynamic completion analysis</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final ProfileCompletionService profileCompletionService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public ResponseEntity<UserProfileDetailResponse> getProfile() {
        return ResponseEntity.ok(userProfileService.getCurrentUserProfile());
    }

    @PutMapping
    public ResponseEntity<UserProfileDetailResponse> updateProfile(
            @Valid @RequestBody UpdateUserProfileDetailRequest request) {
        return ResponseEntity.ok(userProfileService.updateCurrentUserProfile(request));
    }

    @GetMapping("/completion")
    public ResponseEntity<ProfileCompletionResponse> getCompletion() {
        User user    = currentUserService.getCurrentUser();
        UserProfile profile = userProfileService.getOrCreateProfile(user);
        return ResponseEntity.ok(profileCompletionService.compute(user, profile));
    }
}
