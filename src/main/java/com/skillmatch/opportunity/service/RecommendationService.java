package com.skillmatch.opportunity.service;

import com.skillmatch.company.dto.CompanySummaryResponse;
import com.skillmatch.opportunity.dto.OpportunityRecommendation;
import com.skillmatch.opportunity.entity.Opportunity;
import com.skillmatch.opportunity.entity.OpportunitySkill;
import com.skillmatch.opportunity.repository.OpportunitySkillRepository;
import com.skillmatch.resume.repository.ResumeRepository;
import com.skillmatch.resume.repository.ResumeSkillRepository;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final CurrentUserService currentUserService;
    private final OpportunityService opportunityService;
    private final OpportunitySkillRepository opportunitySkillRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeSkillRepository resumeSkillRepository;
    private final MatchingService matchingService;

    @Transactional(readOnly = true)
    public Page<OpportunityRecommendation> recommend(UUID targetRoleId, String location, Pageable pageable) {
        User user = currentUserService.getCurrentUser();

        resumeRepository.findByUserAndActiveTrue(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No active resume found"));

        Set<UUID> resumeSkillIds = resumeSkillRepository.findSkillIdsByActiveResumeOfUser(user);

        List<Opportunity> allOpportunities = opportunityService.findAllOpportunities(targetRoleId, location);

        List<UUID> opportunityIds = allOpportunities.stream().map(Opportunity::getId).toList();

        Map<UUID, List<OpportunitySkill>> skillsByOpportunity = opportunityIds.isEmpty()
                ? Map.of()
                : opportunitySkillRepository.findAllByOpportunityIdInWithSkill(opportunityIds)
                        .stream()
                        .collect(Collectors.groupingBy(os -> os.getOpportunity().getId()));

        List<OpportunityRecommendation> sorted = allOpportunities.stream()
                .map(opp -> {
                    MatchResult result = matchingService.calculate(
                            skillsByOpportunity.getOrDefault(opp.getId(), List.of()),
                            resumeSkillIds
                    );
                    return toRecommendation(opp, result);
                })
                .sorted(Comparator.comparingInt(OpportunityRecommendation::matchPercentage).reversed())
                .toList();

        int pageSize = pageable.getPageSize();
        int offset = (int) pageable.getOffset();
        List<OpportunityRecommendation> pageContent = sorted.subList(
                Math.min(offset, sorted.size()),
                Math.min(offset + pageSize, sorted.size())
        );

        return new PageImpl<>(pageContent, pageable, sorted.size());
    }

    private OpportunityRecommendation toRecommendation(Opportunity opportunity, MatchResult result) {
        CompanySummaryResponse companySummary = new CompanySummaryResponse(
                opportunity.getCompany().getId(),
                opportunity.getCompany().getName(),
                opportunity.getCompany().getLogoUrl()
        );

        return new OpportunityRecommendation(
                opportunity.getId(),
                opportunity.getTitle(),
                companySummary,
                opportunity.getLocation(),
                opportunity.getEmploymentType(),
                opportunity.getExperienceLevel(),
                result.matchPercentage(),
                result.matchedSkills(),
                result.missingRequiredSkills(),
                result.missingPreferredSkills(),
                result.missingGoodToHaveSkills()
        );
    }
}
