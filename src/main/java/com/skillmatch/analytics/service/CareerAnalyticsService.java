package com.skillmatch.analytics.service;

import com.skillmatch.analytics.dto.CareerAnalyticsResponse;
import com.skillmatch.analytics.dto.LearningRoadmapItem;
import com.skillmatch.analytics.dto.ResumeInsight;
import com.skillmatch.analytics.dto.SkillDemandItem;
import com.skillmatch.analytics.model.MarketProfile;
import com.skillmatch.analytics.model.MarketProfile.MarketSkillEntry;
import com.skillmatch.opportunity.repository.OpportunitySkillRepository;
import com.skillmatch.resume.repository.ResumeSkillRepository;
import com.skillmatch.skill.repository.UserSkillRepository;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CareerAnalyticsService {

    private static final int MAX_ITEMS = 10;

    private final CurrentUserService        currentUserService;
    private final OpportunitySkillRepository opportunitySkillRepository;
    private final ResumeSkillRepository     resumeSkillRepository;
    private final UserSkillRepository       userSkillRepository;

    @Transactional(readOnly = true)
    public CareerAnalyticsResponse getCareerAnalytics() {
        User user = currentUserService.getCurrentUser();

        // Collect the user's target role IDs (already eagerly joined on User).
        Set<UUID> targetRoleIds = user.getTargetRoles().stream()
                .map(tr -> tr.getId())
                .collect(Collectors.toSet());

        // Edge case: user has no target roles.
        if (targetRoleIds.isEmpty()) {
            return emptyResponse();
        }

        // --- 2 batch DB queries to build the market profile ---
        long totalOpps = opportunitySkillRepository
                .countDistinctOpportunitiesByTargetRoleIds(targetRoleIds);

        // Edge case: no relevant opportunities in the market.
        if (totalOpps == 0) {
            return emptyResponse();
        }

        MarketProfile profile = MarketProfile.build(
                opportunitySkillRepository.findMarketStatsByTargetRoleIds(targetRoleIds),
                totalOpps
        );

        // --- Load effective skill IDs (resume ∪ manual) ---
        Set<UUID> resumeSkillIds = resumeSkillRepository.findSkillIdsByActiveResumeOfUser(user);
        Set<UUID> manualSkillIds = userSkillRepository.findSkillIdsByUser(user);

        Set<UUID> effectiveSkillIds = new java.util.HashSet<>(resumeSkillIds);
        effectiveSkillIds.addAll(manualSkillIds);

        // --- Compute all 5 analytics sections in-memory ---
        return new CareerAnalyticsResponse(
                computeCoverage(profile, effectiveSkillIds),
                computeLearningRoadmap(profile, effectiveSkillIds),
                computeSkillsInDemand(profile),
                computeTopStrengths(profile, effectiveSkillIds),
                computeResumeInsights(profile, effectiveSkillIds, resumeSkillIds)
        );
    }

    private int computeCoverage(MarketProfile profile, Set<UUID> effectiveSkillIds) {
        if (profile.totalMarketPriorityScore == 0) return 0;
        long effectiveScore = profile.skills.stream()
                .filter(e -> effectiveSkillIds.contains(e.skillId()))
                .mapToLong(MarketSkillEntry::priorityScore)
                .sum();
        return (int) Math.round((effectiveScore * 100.0) / profile.totalMarketPriorityScore);
    }

    // -------------------------------------------------------------------------
    // Section: Learning Roadmap
    // Market skills NOT in effective set, sorted by priorityScore DESC, top 10.
    // -------------------------------------------------------------------------
    private List<LearningRoadmapItem> computeLearningRoadmap(
            MarketProfile profile, Set<UUID> effectiveSkillIds) {
        return profile.skills.stream()
                .filter(e -> !effectiveSkillIds.contains(e.skillId()))
                .limit(MAX_ITEMS)
                .map(e -> new LearningRoadmapItem(
                        e.skillName(),
                        e.marketDemand(),
                        e.expectedImportance(),
                        profile.estimatedCoverageGain(e.priorityScore())))
                .toList();
    }

    // -------------------------------------------------------------------------
    // Section: Skills in Demand
    // All market skills, sorted by priorityScore DESC, top 10.
    // -------------------------------------------------------------------------
    private List<SkillDemandItem> computeSkillsInDemand(MarketProfile profile) {
        return profile.skills.stream()
                .limit(MAX_ITEMS)
                .map(e -> new SkillDemandItem(e.skillName(), e.marketDemand(), e.expectedImportance()))
                .toList();
    }

    // -------------------------------------------------------------------------
    // Section: Top Strengths
    // Effective skills ∩ market skills, sorted by priorityScore DESC, top 10.
    // -------------------------------------------------------------------------
    private List<SkillDemandItem> computeTopStrengths(
            MarketProfile profile, Set<UUID> effectiveSkillIds) {
        return profile.skills.stream()
                .filter(e -> effectiveSkillIds.contains(e.skillId()))
                .limit(MAX_ITEMS)
                .map(e -> new SkillDemandItem(e.skillName(), e.marketDemand(), e.expectedImportance()))
                .toList();
    }

    // -------------------------------------------------------------------------
    // Section: Resume Insights
    // Effective skills NOT in active resume skills, sorted by priorityScore DESC, top 10.
    // -------------------------------------------------------------------------
    private List<ResumeInsight> computeResumeInsights(
            MarketProfile profile,
            Set<UUID> effectiveSkillIds,
            Set<UUID> resumeSkillIds) {
        return profile.skills.stream()
                .filter(e -> effectiveSkillIds.contains(e.skillId())
                          && !resumeSkillIds.contains(e.skillId()))
                .limit(MAX_ITEMS)
                .map(e -> new ResumeInsight(
                        e.skillName(),
                        e.marketDemand(),
                        e.expectedImportance(),
                        profile.estimatedCoverageGain(e.priorityScore())))
                .toList();
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    private CareerAnalyticsResponse emptyResponse() {
        return new CareerAnalyticsResponse(0, List.of(), List.of(), List.of(), List.of());
    }
}
