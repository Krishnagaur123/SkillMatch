package com.skillmatch.opportunity.service;

import com.skillmatch.common.enums.SkillImportance;
import com.skillmatch.company.dto.CompanySummaryResponse;
import com.skillmatch.company.entity.Company;
import com.skillmatch.company.repository.CompanyRepository;
import com.skillmatch.opportunity.dto.OpportunityDetailResponse;
import com.skillmatch.opportunity.dto.OpportunityIngestionRequest;
import com.skillmatch.opportunity.dto.OpportunitySummaryResponse;
import com.skillmatch.opportunity.entity.Opportunity;
import com.skillmatch.opportunity.repository.OpportunityRepository;
import com.skillmatch.opportunity.repository.OpportunitySkillRepository;
import com.skillmatch.opportunity.repository.OpportunityTargetRoleRepository;
import com.skillmatch.user.service.CurrentUserService;
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
public class OpportunityIngestionService {

    private final OpportunityRepository opportunityRepository;
    private final CompanyRepository companyRepository;
    private final OpportunitySkillRepository opportunitySkillRepository;
    private final OpportunityTargetRoleRepository opportunityTargetRoleRepository;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public Page<OpportunitySummaryResponse> listAllOpportunities(Pageable pageable) {
        currentUserService.requireAdmin();
        return opportunityRepository.findAll(pageable).map(this::toSummaryResponse);
    }

    @Transactional
    public OpportunityDetailResponse createOpportunity(OpportunityIngestionRequest request) {
        currentUserService.requireAdmin();

        if (request.companyId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "companyId is required");
        }
        if (request.title() == null || request.title().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "title is required");
        }

        Company company = companyRepository.findById(request.companyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Company not found"));

        if (opportunityRepository.existsByCompanyIdAndTitleAndLocationAndEmploymentTypeAndActiveTrue(
                company.getId(), request.title(), request.location(), request.employmentType())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An active opportunity with the same company, title, location, and employment type already exists.");
        }

        Opportunity opportunity = Opportunity.builder()
                .company(company)
                .title(request.title())
                .description(normalize(request.description()))
                .location(normalize(request.location()))
                .workMode(request.workMode())
                .employmentType(request.employmentType())
                .experienceLevel(request.experienceLevel())
                .applyUrl(normalize(request.applyUrl()))
                .source(normalize(request.source()))
                .externalId(normalize(request.externalId()))
                .postedAt(request.postedAt())
                .expiresAt(request.expiresAt())
                .active(request.active() != null ? request.active() : true)
                .build();

        opportunityRepository.save(opportunity);
        return toDetailResponse(opportunity);
    }

    @Transactional
    public OpportunityDetailResponse updateOpportunity(UUID opportunityId, OpportunityIngestionRequest request) {
        currentUserService.requireAdmin();

        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opportunity not found"));

        UUID companyIdForCheck = request.companyId() != null ? request.companyId() : opportunity.getCompany().getId();
        String titleForCheck = request.title() != null ? request.title() : opportunity.getTitle();
        String locationForCheck = request.location() != null ? request.location() : opportunity.getLocation();
        com.skillmatch.common.enums.EmploymentType employmentTypeForCheck = request.employmentType() != null ? request.employmentType() : opportunity.getEmploymentType();
        boolean activeForCheck = request.active() != null ? request.active() : opportunity.getActive();

        if (activeForCheck) {
            if (opportunityRepository.existsByCompanyIdAndTitleAndLocationAndEmploymentTypeAndActiveTrueAndIdNot(
                    companyIdForCheck, titleForCheck, locationForCheck, employmentTypeForCheck, opportunityId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "An active opportunity with the same company, title, location, and employment type already exists.");
            }
        }


        if (request.companyId() != null && !request.companyId().equals(opportunity.getCompany().getId())) {
            Company company = companyRepository.findById(request.companyId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Company not found"));
            opportunity.setCompany(company);
        }

        if (request.title() != null) {
            if (request.title().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "title must not be blank");
            }
            opportunity.setTitle(request.title());
        }
        if (request.description() != null) {
            opportunity.setDescription(normalize(request.description()));
        }
        if (request.location() != null) {
            opportunity.setLocation(normalize(request.location()));
        }
        if (request.workMode() != null) opportunity.setWorkMode(request.workMode());
        if (request.employmentType() != null) opportunity.setEmploymentType(request.employmentType());
        if (request.experienceLevel() != null) opportunity.setExperienceLevel(request.experienceLevel());
        if (request.applyUrl() != null) {
            opportunity.setApplyUrl(normalize(request.applyUrl()));
        }
        if (request.source() != null) {
            opportunity.setSource(normalize(request.source()));
        }
        if (request.externalId() != null) {
            opportunity.setExternalId(normalize(request.externalId()));
        }
        if (request.postedAt() != null) opportunity.setPostedAt(request.postedAt());
        if (request.expiresAt() != null) opportunity.setExpiresAt(request.expiresAt());
        if (request.active() != null) opportunity.setActive(request.active());

        opportunityRepository.save(opportunity);
        return toDetailResponse(opportunity);
    }

    @Transactional
    public void deleteOpportunity(UUID opportunityId) {
        currentUserService.requireAdmin();

        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opportunity not found"));

        opportunity.setActive(false);
        opportunityRepository.save(opportunity);
    }

    private OpportunityDetailResponse toDetailResponse(Opportunity opportunity) {
        List<String> targetRoleNames = opportunityTargetRoleRepository
                .findAllByOpportunityWithTargetRole(opportunity)
                .stream()
                .map(otr -> otr.getTargetRole().getName())
                .toList();

        CompanySummaryResponse company = new CompanySummaryResponse(
                opportunity.getCompany().getId(),
                opportunity.getCompany().getName(),
                opportunity.getCompany().getLogoUrl()
        );

        return new OpportunityDetailResponse(
                opportunity.getId(),
                opportunity.getTitle(),
                company,
                opportunity.getLocation(),
                opportunity.getEmploymentType(),
                opportunity.getExperienceLevel(),
                opportunity.getDescription(),
                opportunity.getApplyUrl(),
                opportunity.getSource(),
                opportunity.getPostedAt(),
                opportunity.getExpiresAt(),
                opportunity.getActive(),
                skillNamesByImportance(opportunity, SkillImportance.REQUIRED),
                skillNamesByImportance(opportunity, SkillImportance.PREFERRED),
                skillNamesByImportance(opportunity, SkillImportance.GOOD_TO_HAVE),
                targetRoleNames
        );
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

    private List<String> skillNamesByImportance(Opportunity opportunity, SkillImportance importance) {
        return opportunitySkillRepository
                .findAllByOpportunityWithSkillAndImportance(opportunity, importance)
                .stream()
                .map(os -> os.getSkill().getName())
                .toList();
    }

    private String normalize(String value) {
        return (value != null && value.isBlank()) ? null : value;
    }
}
