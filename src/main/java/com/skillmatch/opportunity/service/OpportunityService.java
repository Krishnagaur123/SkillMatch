package com.skillmatch.opportunity.service;

import com.skillmatch.opportunity.dto.OpportunityDetailResponse;
import com.skillmatch.opportunity.dto.OpportunitySummaryResponse;
import com.skillmatch.opportunity.entity.Opportunity;
import com.skillmatch.opportunity.repository.OpportunityRepository;
import com.skillmatch.opportunity.repository.OpportunitySkillRepository;
import com.skillmatch.opportunity.repository.OpportunityTargetRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final OpportunitySkillRepository opportunitySkillRepository;
    private final OpportunityTargetRoleRepository opportunityTargetRoleRepository;

    @Transactional(readOnly = true)
    public Page<OpportunitySummaryResponse> listOpportunities(UUID targetRoleId, String location, Pageable pageable) {
        String normalizedLocation = (location == null || location.isBlank()) ? null : location.trim();
        boolean hasLocation = normalizedLocation != null;
        boolean hasRole = targetRoleId != null;

        Page<Opportunity> page;
        if (hasLocation && hasRole) {
            page = opportunityRepository.findDistinctByActiveTrueAndLocationContainingIgnoreCaseAndOpportunityTargetRolesTargetRoleId(
                    normalizedLocation, targetRoleId, pageable);
        } else if (hasLocation) {
            page = opportunityRepository.findByActiveTrueAndLocationContainingIgnoreCase(normalizedLocation, pageable);
        } else if (hasRole) {
            page = opportunityRepository.findDistinctByActiveTrueAndOpportunityTargetRolesTargetRoleId(targetRoleId, pageable);
        } else {
            page = opportunityRepository.findByActiveTrue(pageable);
        }

        return page.map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public OpportunityDetailResponse getOpportunity(UUID opportunityId) {
        Opportunity opportunity = opportunityRepository.findByIdAndActiveTrue(opportunityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opportunity not found"));
        return toDetailResponse(opportunity);
    }

    private OpportunitySummaryResponse toSummaryResponse(Opportunity opportunity) {
        return new OpportunitySummaryResponse(
                opportunity.getId(),
                opportunity.getTitle(),
                opportunity.getCompany().getName(),
                opportunity.getLocation(),
                opportunity.getExperienceLevel(),
                opportunity.getEmploymentType()
        );
    }

    private OpportunityDetailResponse toDetailResponse(Opportunity opportunity) {
        List<String> skillNames = opportunitySkillRepository
                .findAllByOpportunityWithSkill(opportunity)
                .stream()
                .map(os -> os.getSkill().getName())
                .toList();

        List<String> targetRoleNames = opportunityTargetRoleRepository
                .findAllByOpportunityWithTargetRole(opportunity)
                .stream()
                .map(otr -> otr.getTargetRole().getName())
                .toList();

        return new OpportunityDetailResponse(
                opportunity.getId(),
                opportunity.getTitle(),
                opportunity.getCompany().getName(),
                opportunity.getLocation(),
                opportunity.getEmploymentType(),
                opportunity.getExperienceLevel(),
                opportunity.getDescription(),
                opportunity.getApplicationUrl(),
                opportunity.getSource(),
                opportunity.getPostedAt(),
                opportunity.getExpiresAt(),
                opportunity.getActive(),
                skillNames,
                targetRoleNames
        );
    }
}
