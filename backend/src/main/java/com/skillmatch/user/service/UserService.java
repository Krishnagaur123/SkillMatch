package com.skillmatch.user.service;

import com.skillmatch.config.CacheConfig;
import com.skillmatch.resume.entity.Resume;
import com.skillmatch.resume.repository.ResumeEducationRepository;
import com.skillmatch.resume.repository.ResumeExperienceRepository;
import com.skillmatch.resume.repository.ResumeRepository;
import com.skillmatch.resume.repository.ResumeSkillRepository;
import com.skillmatch.role.entity.TargetRole;
import com.skillmatch.role.repository.TargetRoleRepository;
import com.skillmatch.user.dto.UpdateUserProfileRequest;
import com.skillmatch.user.dto.UserProfileResponse;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.entity.UserProfile;
import com.skillmatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final CurrentUserService currentUserService;
    private final TargetRoleRepository targetRoleRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeSkillRepository resumeSkillRepository;
    private final ResumeEducationRepository resumeEducationRepository;
    private final ResumeExperienceRepository resumeExperienceRepository;
    private final ProfileCompletionService profileCompletionService;
    private final UserProfileService userProfileService;

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        User user = currentUserService.getCurrentUser();
        User userWithRoles = userRepository.findWithTargetRolesById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return buildResponse(userWithRoles);
    }

    @CacheEvict(
            cacheNames = CacheConfig.CAREER_ANALYTICS_CACHE,
            key = "'analytics:career:' + #root.target.currentUserService.getCurrentUserId()"
    )
    @Transactional
    public UserProfileResponse updateCurrentUserProfile(UpdateUserProfileRequest request) {
        User user = currentUserService.getCurrentUser();

        // Fetch with targetRoles pre-loaded so that clear()/addAll() operate on
        // an already-initialized collection, not a LAZY proxy.
        User userWithRoles = userRepository.findWithTargetRolesById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (request.name() != null) {
            String sanitizedName = request.name().trim().replaceAll("\\s+", " ");
            
            if (sanitizedName.length() < 2 || sanitizedName.length() > 60) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Display name must be between 2 and 60 characters.");
            }
            
            if (!sanitizedName.matches(".*\\p{L}.*")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Display name must contain at least one letter.");
            }
            
            userWithRoles.setName(sanitizedName);
        }

        if (request.targetRoleIds() != null) {
            Set<UUID> ids = request.targetRoleIds();
            Set<TargetRole> roles = targetRoleRepository.findAllByIdIn(ids);
            if (roles.size() != ids.size()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more target role IDs are invalid");
            }
            userWithRoles.getTargetRoles().clear();
            userWithRoles.getTargetRoles().addAll(roles);
        }

        userRepository.save(userWithRoles);

        // Re-fetch to return a fresh, consistent view after save.
        User refreshed = userRepository.findWithTargetRolesById(userWithRoles.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return buildResponse(refreshed);
    }

    private UserProfileResponse buildResponse(User user) {
        List<String> roleNames = user.getTargetRoles().stream()
                .map(TargetRole::getName)
                .toList();

        boolean resumeUploaded = resumeRepository.existsByUser(user);

        Optional<Resume> activeResume = resumeRepository.findByUserAndActiveTrue(user);

        int skillsCount    = activeResume.map(r -> (int) resumeSkillRepository.countByResume(r)).orElse(0);
        int educationCount = activeResume.map(r -> (int) resumeEducationRepository.countByResume(r)).orElse(0);
        int experienceCount= activeResume.map(r -> (int) resumeExperienceRepository.countByResume(r)).orElse(0);

        UserProfile profile = userProfileService.getOrCreateProfile(user);
        int completionScore = profileCompletionService.compute(user, profile).completionPercentage();

        String picture = user.getProfilePictureUrl();
        if (picture != null && !picture.startsWith("http")) {
            picture = "/api/v1/users/" + user.getId() + "/avatar?v=" + URLEncoder.encode(picture, StandardCharsets.UTF_8);
        }

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                picture,
                roleNames,
                resumeUploaded,
                skillsCount,
                educationCount,
                experienceCount,
                completionScore,
                Boolean.TRUE.equals(user.getIsAdmin())
        );
    }
}
