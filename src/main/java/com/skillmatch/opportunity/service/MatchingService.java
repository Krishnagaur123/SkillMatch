package com.skillmatch.opportunity.service;

import com.skillmatch.common.enums.SkillImportance;
import com.skillmatch.common.util.SkillImportanceWeights;
import com.skillmatch.opportunity.entity.OpportunitySkill;
import org.springframework.stereotype.Service;

import com.skillmatch.opportunity.repository.OpportunitySkillRepository;
import com.skillmatch.resume.repository.ResumeSkillRepository;
import com.skillmatch.user.entity.User;
import com.skillmatch.opportunity.entity.Opportunity;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final ResumeSkillRepository resumeSkillRepository;
    private final OpportunitySkillRepository opportunitySkillRepository;

    public MatchResult matchForUser(User user, Opportunity opportunity) {
        Set<UUID> resumeSkillIds = resumeSkillRepository.findSkillIdsByActiveResumeOfUser(user);
        List<OpportunitySkill> oppSkills = opportunitySkillRepository.findAllByOpportunityWithSkill(opportunity);
        return calculate(oppSkills, resumeSkillIds);
    }

    public MatchResult calculate(List<OpportunitySkill> skills, Set<UUID> resumeSkillIds) {
        int maxScore = 0;
        int obtained = 0;

        List<String> matched = new ArrayList<>();
        List<String> missingRequired = new ArrayList<>();
        List<String> missingPreferred = new ArrayList<>();
        List<String> missingGoodToHave = new ArrayList<>();

        for (OpportunitySkill os : skills) {
            int weight = weightOf(os.getImportance());
            maxScore += weight;
            String skillName = os.getSkill().getName();
            if (resumeSkillIds.contains(os.getSkill().getId())) {
                obtained += weight;
                matched.add(skillName);
            } else {
                switch (os.getImportance()) {
                    case REQUIRED -> missingRequired.add(skillName);
                    case PREFERRED -> missingPreferred.add(skillName);
                    case GOOD_TO_HAVE -> missingGoodToHave.add(skillName);
                }
            }
        }

        int matchPercentage = maxScore == 0 ? 0 : (int) Math.round((obtained * 100.0) / maxScore);

        return new MatchResult(matchPercentage, matched, missingRequired, missingPreferred, missingGoodToHave);
    }

    private int weightOf(SkillImportance importance) {
        return SkillImportanceWeights.weightOf(importance);
    }
}
