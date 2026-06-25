package com.skillmatch.analytics.controller;

import com.skillmatch.analytics.dto.CareerAnalyticsResponse;
import com.skillmatch.analytics.service.CareerAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class CareerAnalyticsController {

    private final CareerAnalyticsService careerAnalyticsService;


    @GetMapping("/career")
    public ResponseEntity<CareerAnalyticsResponse> getCareerAnalytics() {
        return ResponseEntity.ok(careerAnalyticsService.getCareerAnalytics());
    }
}
