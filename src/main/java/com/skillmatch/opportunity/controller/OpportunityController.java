package com.skillmatch.opportunity.controller;

import com.skillmatch.opportunity.dto.OpportunityDetailResponse;
import com.skillmatch.opportunity.dto.OpportunityRecommendation;
import com.skillmatch.opportunity.dto.OpportunitySummaryResponse;
import com.skillmatch.common.dto.PageResponse;
import com.skillmatch.opportunity.service.OpportunityService;
import com.skillmatch.opportunity.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/opportunities")
@RequiredArgsConstructor
public class OpportunityController {

    private final OpportunityService opportunityService;
    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<PageResponse<OpportunitySummaryResponse>> list(
            @RequestParam(required = false) UUID targetRoleId,
            @RequestParam(required = false) String location,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.of(opportunityService.listOpportunities(targetRoleId, location, pageable)));
    }

    @GetMapping("/{opportunityId}")
    public ResponseEntity<OpportunityDetailResponse> get(@PathVariable UUID opportunityId) {
        return ResponseEntity.ok(opportunityService.getOpportunity(opportunityId));
    }

    @GetMapping("/recommended")
    public ResponseEntity<PageResponse<OpportunityRecommendation>> recommended(
            @RequestParam(required = false) UUID targetRoleId,
            @RequestParam(required = false) String location,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.of(recommendationService.recommend(targetRoleId, location, pageable)));
    }
}
