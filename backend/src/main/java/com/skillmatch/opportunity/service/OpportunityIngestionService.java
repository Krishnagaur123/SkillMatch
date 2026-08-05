package com.skillmatch.opportunity.service;

import com.skillmatch.company.dto.CompanySummaryResponse;
import com.skillmatch.opportunity.dto.OpportunityDetailResponse;
import com.skillmatch.opportunity.dto.OpportunityIngestionRequest;
import com.skillmatch.opportunity.dto.OpportunitySummaryResponse;
import com.skillmatch.opportunity.entity.Opportunity;
import com.skillmatch.opportunity.repository.OpportunityRepository;
import com.skillmatch.user.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OpportunityIngestionService {

    private final OpportunityRepository opportunityRepository;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public Page<OpportunitySummaryResponse> listAllOpportunities(Pageable pageable) {
        currentUserService.requireAdmin();
        return opportunityRepository.findAll(pageable).map(this::toSummaryResponse);
    }

    @Transactional
    public OpportunityDetailResponse createOpportunity(OpportunityIngestionRequest request) {
        currentUserService.requireAdmin();
        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED);
    }

    @Transactional
    public OpportunityDetailResponse updateOpportunity(UUID opportunityId, OpportunityIngestionRequest request) {
        currentUserService.requireAdmin();
        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED);
    }

    @Transactional
    public void deleteOpportunity(UUID opportunityId) {
        currentUserService.requireAdmin();
        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED);
    }

    private OpportunitySummaryResponse toSummaryResponse(Opportunity opportunity) {
        CompanySummaryResponse company = new CompanySummaryResponse(
                opportunity.getCompany().getId(),
                opportunity.getCompany().getName(),
                opportunity.getCompany().getLogoUrl()
        );
        return new OpportunitySummaryResponse(
                opportunity.getId(),
                opportunity.getTitle(),
                company,
                opportunity.getLocation(),
                opportunity.getExperienceLevel(),
                opportunity.getEmploymentType()
        );
    }
}
