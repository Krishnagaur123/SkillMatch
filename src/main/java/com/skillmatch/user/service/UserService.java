package com.skillmatch.user.service;

import com.skillmatch.role.entity.TargetRole;
import com.skillmatch.role.repository.TargetRoleRepository;
import com.skillmatch.user.dto.UpdateUserProfileRequest;
import com.skillmatch.user.dto.UserProfileResponse;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final CurrentUserService currentUserService;
    private final TargetRoleRepository targetRoleRepository;
    private final UserRepository userRepository;

    public UserProfileResponse getCurrentUserProfile() {
        User user = currentUserService.getCurrentUser();
        return buildResponse(user, 0);
    }

    @Transactional
    public UserProfileResponse updateCurrentUserProfile(UpdateUserProfileRequest request) {
        User user = currentUserService.getCurrentUser();

        if (request.name() != null) {
            if (request.name().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name must not be blank");
            }
            user.setName(request.name());
        }

        if (request.targetRoleIds() != null) {
            Set<UUID> ids = request.targetRoleIds();
            Set<TargetRole> roles = targetRoleRepository.findAllByIdIn(ids);
            if (roles.size() != ids.size()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more target role IDs are invalid");
            }
            user.getTargetRoles().clear();
            user.getTargetRoles().addAll(roles);
        }

        userRepository.save(user);
        return buildResponse(user, 0);
    }

    private UserProfileResponse buildResponse(User user, int educationCount) {
        List<String> roleNames = user.getTargetRoles().stream()
                .map(TargetRole::getName)
                .toList();

        boolean resumeUploaded = !user.getResumes().isEmpty();
        int skillsCount = user.getUserSkills().size();
        int completionScore = calculateProfileCompletion(user, educationCount);

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfilePictureUrl(),
                roleNames,
                resumeUploaded,
                skillsCount,
                educationCount,
                0,
                completionScore
        );
    }

    private int calculateProfileCompletion(User user, int educationCount) {
        int score = 0;

        if (user.getName() != null && !user.getName().isBlank()) score += 20;
        if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().isBlank()) score += 10;
        if (!user.getTargetRoles().isEmpty()) score += 20;
        if (!user.getResumes().isEmpty()) score += 20;
        if (!user.getUserSkills().isEmpty()) score += 20;
        if (educationCount > 0) score += 10;

        return score;
    }
}
