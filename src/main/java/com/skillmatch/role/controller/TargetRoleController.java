package com.skillmatch.role.controller;

import com.skillmatch.role.dto.TargetRoleResponse;
import com.skillmatch.role.dto.UpdateTargetRolesRequest;
import com.skillmatch.role.service.TargetRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TargetRoleController {

    private final TargetRoleService targetRoleService;

    @GetMapping("/target-roles")
    public ResponseEntity<List<TargetRoleResponse>> listAllTargetRoles() {
        return ResponseEntity.ok(targetRoleService.listAllTargetRoles());
    }

    @PutMapping("/users/me/target-roles")
    public ResponseEntity<List<TargetRoleResponse>> updateTargetRoles(
            @RequestBody UpdateTargetRolesRequest request
    ) {
        return ResponseEntity.ok(targetRoleService.updateCurrentUserTargetRoles(request));
    }
}
