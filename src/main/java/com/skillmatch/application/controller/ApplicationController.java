package com.skillmatch.application.controller;

import com.skillmatch.application.dto.ApplicationResponse;
import com.skillmatch.application.dto.CreateApplicationRequest;
import com.skillmatch.application.dto.UpdateApplicationRequest;
import com.skillmatch.application.service.ApplicationService;
import com.skillmatch.common.enums.ApplicationStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody CreateApplicationRequest request) {
        ApplicationResponse response = applicationService.createApplication(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> listMyApplications(
            @AuthenticationPrincipal UUID userId,
            @RequestParam(required = false) ApplicationStatus status) {
        List<ApplicationResponse> responses = applicationService.listMyApplications(userId, status);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplication(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id) {
        ApplicationResponse response = applicationService.getApplication(userId, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateApplicationRequest request) {
        ApplicationResponse response = applicationService.updateApplication(userId, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id) {
        applicationService.deleteApplication(userId, id);
        return ResponseEntity.noContent().build();
    }
}
