package com.skillmatch.user.service;

import com.skillmatch.resume.entity.Resume;
import com.skillmatch.resume.repository.ResumeEducationRepository;
import com.skillmatch.resume.repository.ResumeExperienceRepository;
import com.skillmatch.resume.repository.ResumeRepository;
import com.skillmatch.resume.repository.ResumeSkillRepository;
import com.skillmatch.role.entity.TargetRole;
import com.skillmatch.role.repository.TargetRoleRepository;
import com.skillmatch.skill.repository.UserSkillRepository;
import com.skillmatch.user.dto.UpdateUserProfileRequest;
import com.skillmatch.user.dto.UserProfileResponse;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
    private final UserSkillRepository userSkillRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        User user = currentUserService.getCurrentUser();
        User userWithRoles = userRepository.findWithTargetRolesById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return buildResponse(userWithRoles);
    }

    @Transactional
    public UserProfileResponse updateCurrentUserProfile(UpdateUserProfileRequest request) {
        User user = currentUserService.getCurrentUser();

        // Fetch with targetRoles pre-loaded so that clear()/addAll() operate on
        // an already-initialized collection, not a LAZY proxy.
        User userWithRoles = userRepository.findWithTargetRolesById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (request.name() != null) {
            if (request.name().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name must not be blank");
            }
            userWithRoles.setName(request.name());
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

    /**
     * Builds the profile response DTO from a User whose {@code targetRoles}
     * collection has already been initialized via EntityGraph.
     *
     * <p>The LAZY {@code resumes} and {@code userSkills} collections on the User
     * entity are intentionally NOT traversed here — counts and existence checks
     * are delegated to dedicated repository queries (COUNT/EXISTS SQL), which
     * are safe and efficient regardless of persistence context state.
     */
    private UserProfileResponse buildResponse(User user) {
        List<String> roleNames = user.getTargetRoles().stream()
                .map(TargetRole::getName)
                .toList();

        // EXISTS query — avoids touching the LAZY @OneToMany resumes collection.
        boolean resumeUploaded = resumeRepository.existsByUser(user);

        Optional<Resume> activeResume = resumeRepository.findByUserAndActiveTrue(user);

        int skillsCount    = activeResume.map(r -> (int) resumeSkillRepository.countByResume(r)).orElse(0);
        int educationCount = activeResume.map(r -> (int) resumeEducationRepository.countByResume(r)).orElse(0);
        int experienceCount= activeResume.map(r -> (int) resumeExperienceRepository.countByResume(r)).orElse(0);

        // EXISTS query — avoids touching the LAZY @OneToMany userSkills collection.
        boolean hasUserSkills = userSkillRepository.existsByUser(user);

        int completionScore = calculateProfileCompletion(user, resumeUploaded, hasUserSkills, educationCount);

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfilePictureUrl(),
                roleNames,
                resumeUploaded,
                skillsCount,
                educationCount,
                experienceCount,
                completionScore
        );
    }

    /**
     * Calculates profile completion percentage.
     *
     * <p>Accepts pre-computed boolean flags for resume and userSkills presence
     * to avoid lazy collection traversal ({@code user.getResumes()},
     * {@code user.getUserSkills()}) that would require an active persistence
     * context — instead, repository COUNT/EXISTS queries are used upstream.
     */
    private int calculateProfileCompletion(User user, boolean resumeUploaded,
                                           boolean hasUserSkills, int educationCount) {
        int score = 0;

        if (user.getName() != null && !user.getName().isBlank()) score += 20;
        if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().isBlank()) score += 10;
        if (!user.getTargetRoles().isEmpty()) score += 20; // pre-loaded via EntityGraph
        if (resumeUploaded) score += 20;                   // repository EXISTS, not LAZY collection
        if (hasUserSkills) score += 20;                    // repository EXISTS, not LAZY collection
        if (educationCount > 0) score += 10;

        return score;
    }
}
