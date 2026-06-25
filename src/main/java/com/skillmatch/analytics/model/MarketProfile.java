package com.skillmatch.analytics.model;

import com.skillmatch.common.enums.SkillImportance;
import com.skillmatch.common.util.SkillImportanceWeights;
import com.skillmatch.opportunity.projection.SkillMarketStatRow;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;


public final class MarketProfile {

    public record MarketSkillEntry(
            UUID   skillId,
            String skillName,
            long   requiredCount,
            long   preferredCount,
            long   goodToHaveCount,
            long   appearanceCount,
            long   priorityScore,
            double marketDemand,
            double expectedImportance
    ) {}

    public final List<MarketSkillEntry> skills;
    public final long totalRelevantOpportunities;
    public final long totalMarketPriorityScore;

    private MarketProfile(
            List<MarketSkillEntry> skills,
            long totalRelevantOpportunities,
            long totalMarketPriorityScore) {
        this.skills = skills;
        this.totalRelevantOpportunities = totalRelevantOpportunities;
        this.totalMarketPriorityScore   = totalMarketPriorityScore;
    }


    public static MarketProfile build(List<SkillMarketStatRow> rows, long totalOpps) {

        Map<UUID, long[]> buckets = new HashMap<>(); 
        Map<UUID, String> names   = new HashMap<>();

        for (SkillMarketStatRow row : rows) {
            UUID id = row.getSkillId();
            names.putIfAbsent(id, row.getSkillName());
            long[] b = buckets.computeIfAbsent(id, k -> new long[4]);

            if (row.getImportance() == SkillImportance.REQUIRED) {
                b[0] += row.getCnt();
            } else if (row.getImportance() == SkillImportance.PREFERRED) {
                b[1] += row.getCnt();
            } else {
                b[2] += row.getCnt();
            }

            b[3] += row.getCnt();
        }

        List<MarketSkillEntry> entries = new ArrayList<>(buckets.size());
        long totalPriorityScore = 0;

        for (Map.Entry<UUID, long[]> e : buckets.entrySet()) {
            UUID   id   = e.getKey();
            long[] b    = e.getValue();
            long req    = b[0];
            long pref   = b[1];
            long gth    = b[2];
            long appear = b[3];

            long score = req  * SkillImportanceWeights.REQUIRED
                       + pref * SkillImportanceWeights.PREFERRED
                       + gth  * SkillImportanceWeights.GOOD_TO_HAVE;

            double marketDemand = totalOpps == 0 ? 0.0
                    : Math.round((appear * 1000.0) / totalOpps) / 10.0;

            double expectedImp = totalOpps == 0 ? 0.0
                    : Math.round(((req * 100.0 + pref * 50.0 + gth * 20.0) * 10.0) / totalOpps) / 10.0;

            entries.add(new MarketSkillEntry(id, names.get(id), req, pref, gth, appear, score, marketDemand, expectedImp));
            totalPriorityScore += score;
        }

        entries.sort(Comparator.comparingLong(MarketSkillEntry::priorityScore).reversed());

        return new MarketProfile(List.copyOf(entries), totalOpps, totalPriorityScore);
    }

    public double estimatedCoverageGain(long skillPriorityScore) {
        if (totalMarketPriorityScore == 0) return 0.0;
        return Math.round((skillPriorityScore * 1000.0) / totalMarketPriorityScore) / 10.0;
    }
}
