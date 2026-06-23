package com.skillmatch.user.controller;

import com.skillmatch.user.dto.AddUserSkillRequest;
import com.skillmatch.user.dto.UserSkillResponse;
import com.skillmatch.user.service.UserSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/skills")
@RequiredArgsConstructor
public class UserSkillController {

    private final UserSkillService userSkillService;


    @GetMapping
    public ResponseEntity<List<UserSkillResponse>> listSkills() {
        return ResponseEntity.ok(userSkillService.listCurrentUserSkills());
    }

    @PostMapping
    public ResponseEntity<UserSkillResponse> addSkill(
            @Valid @RequestBody AddUserSkillRequest request) {
        UserSkillResponse response = userSkillService.addSkill(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> removeSkill(@PathVariable UUID skillId) {
        userSkillService.removeSkill(skillId);
        return ResponseEntity.noContent().build();
    }
}
