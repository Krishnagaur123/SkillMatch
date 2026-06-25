package com.skillmatch.role.service;

import com.skillmatch.role.dto.TargetRoleResponse;
import com.skillmatch.role.dto.UpdateTargetRolesRequest;
import com.skillmatch.role.entity.TargetRole;
import com.skillmatch.role.repository.TargetRoleRepository;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.repository.UserRepository;
import com.skillmatch.user.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TargetRoleService {

    private final TargetRoleRepository targetRoleRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public List<TargetRoleResponse> listAllTargetRoles() {
        return targetRoleRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<TargetRoleResponse> updateCurrentUserTargetRoles(UpdateTargetRolesRequest request) {
        if (request == null || request.targetRoleIds() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Target role IDs must not be null");
        }

        List<UUID> requestedIds = request.targetRoleIds();
        Set<UUID> uniqueIds = new HashSet<>(requestedIds);
        if (requestedIds.size() != uniqueIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate target role IDs are not allowed");
        }

        User currentUser = currentUserService.getCurrentUser();
        User user = userRepository.findWithTargetRolesById(currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (uniqueIds.isEmpty()) {
            user.getTargetRoles().clear();
        } else {
            Set<TargetRole> targetRoles = targetRoleRepository.findAllByIdIn(uniqueIds);
            if (targetRoles.size() != uniqueIds.size()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "One or more target roles not found");
            }
            user.getTargetRoles().clear();
            user.getTargetRoles().addAll(targetRoles);
        }

        User savedUser = userRepository.save(user);

        return savedUser.getTargetRoles().stream()
                .map(this::toResponse)
                .sorted(Comparator.comparing(TargetRoleResponse::name, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    private TargetRoleResponse toResponse(TargetRole targetRole) {
        return new TargetRoleResponse(targetRole.getId(), targetRole.getName());
    }
}
