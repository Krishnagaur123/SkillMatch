package com.skillmatch.opportunity.repository;

import com.skillmatch.common.enums.SkillImportance;
import com.skillmatch.opportunity.entity.Opportunity;
import com.skillmatch.opportunity.entity.OpportunitySkill;
import com.skillmatch.opportunity.projection.SkillMarketStatRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface OpportunitySkillRepository extends JpaRepository<OpportunitySkill, UUID> {

    @Query("SELECT os FROM OpportunitySkill os JOIN FETCH os.skill WHERE os.opportunity = :opportunity")
    List<OpportunitySkill> findAllByOpportunityWithSkill(@Param("opportunity") Opportunity opportunity);

    @Query("SELECT os FROM OpportunitySkill os JOIN FETCH os.skill WHERE os.opportunity = :opportunity AND os.importance = :importance")
    List<OpportunitySkill> findAllByOpportunityWithSkillAndImportance(
            @Param("opportunity") Opportunity opportunity,
            @Param("importance") SkillImportance importance
    );

    @Query("SELECT os FROM OpportunitySkill os JOIN FETCH os.skill WHERE os.opportunity.id IN :opportunityIds")
    List<OpportunitySkill> findAllByOpportunityIdInWithSkill(@Param("opportunityIds") Collection<UUID> opportunityIds);

    /**
     * Aggregates skill demand statistics for all active opportunities
     * matching any of the given target role IDs.
     * Returns one row per (skill, importance) combination.
     */
    @Query("""
            SELECT os.skill.id    AS skillId,
                   os.skill.name  AS skillName,
                   os.importance   AS importance,
                   COUNT(DISTINCT os.opportunity.id) AS cnt
            FROM   OpportunitySkill os
            JOIN   os.opportunity.opportunityTargetRoles otr
            WHERE  otr.targetRole.id IN :targetRoleIds
            AND    os.opportunity.active = true
            GROUP  BY os.skill.id, os.skill.name, os.importance
            """)
    List<SkillMarketStatRow> findMarketStatsByTargetRoleIds(
            @Param("targetRoleIds") Collection<UUID> targetRoleIds);

    /**
     * Counts distinct active opportunities matching any of the given target role IDs.
     */
    @Query("""
            SELECT COUNT(DISTINCT o.id)
            FROM   Opportunity o
            JOIN   o.opportunityTargetRoles otr
            WHERE  otr.targetRole.id IN :targetRoleIds
            AND    o.active = true
            """)
    long countDistinctOpportunitiesByTargetRoleIds(
            @Param("targetRoleIds") Collection<UUID> targetRoleIds);
}
