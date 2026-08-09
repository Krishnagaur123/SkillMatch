package com.skillmatch.analytics.controller;

import com.skillmatch.analytics.dto.CareerAnalyticsResponse;
import com.skillmatch.analytics.service.CareerAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class CareerAnalyticsController {

    private final CareerAnalyticsService careerAnalyticsService;

    /**
     * Returns career analytics for the currently authenticated user.
     *
     * <p>The {@code userId} is extracted from the validated JWT principal by
     * Spring Security (set in {@code JwtAuthenticationFilter}) and passed
     * explicitly to the service. This ensures the cache key is always derived
     * from a server-validated identity, never from client-supplied input.
     */
    @GetMapping("/career")
    public ResponseEntity<CareerAnalyticsResponse> getCareerAnalytics(
            @AuthenticationPrincipal UUID userId) {
        return ResponseEntity.ok(careerAnalyticsService.getCareerAnalytics(userId));
    }
}
