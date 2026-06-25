package com.skillmatch.opportunity.service;

import com.skillmatch.common.enums.SkillImportance;
import com.skillmatch.opportunity.entity.OpportunitySkill;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class MatchingService {

    private static final int WEIGHT_REQUIRED = 5;
    private static final int WEIGHT_PREFERRED = 2;
    private static final int WEIGHT_GOOD_TO_HAVE = 1;

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
        return switch (importance) {
            case REQUIRED -> WEIGHT_REQUIRED;
            case PREFERRED -> WEIGHT_PREFERRED;
            case GOOD_TO_HAVE -> WEIGHT_GOOD_TO_HAVE;
        };
    }
}
