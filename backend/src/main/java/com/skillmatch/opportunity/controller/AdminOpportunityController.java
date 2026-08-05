package com.skillmatch.opportunity.controller;

import com.skillmatch.common.dto.PageResponse;
import com.skillmatch.opportunity.dto.OpportunityDetailResponse;
import com.skillmatch.opportunity.dto.OpportunityIngestionRequest;
import com.skillmatch.opportunity.dto.OpportunitySummaryResponse;
import com.skillmatch.opportunity.service.OpportunityIngestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/opportunities")
@RequiredArgsConstructor
public class AdminOpportunityController {

    private final OpportunityIngestionService opportunityIngestionService;

    @GetMapping
    public ResponseEntity<PageResponse<OpportunitySummaryResponse>> listAll(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.of(opportunityIngestionService.listAllOpportunities(pageable)));
    }

    @PostMapping
    public ResponseEntity<OpportunityDetailResponse> create(
            @RequestBody OpportunityIngestionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(opportunityIngestionService.createOpportunity(request));
    }

    @PutMapping("/{opportunityId}")
    public ResponseEntity<OpportunityDetailResponse> update(
            @PathVariable UUID opportunityId,
            @RequestBody OpportunityIngestionRequest request) {
        return ResponseEntity.ok(opportunityIngestionService.updateOpportunity(opportunityId, request));
    }

    @DeleteMapping("/{opportunityId}")
    public ResponseEntity<Void> delete(@PathVariable UUID opportunityId) {
        opportunityIngestionService.deleteOpportunity(opportunityId);
        return ResponseEntity.noContent().build();
    }
}
