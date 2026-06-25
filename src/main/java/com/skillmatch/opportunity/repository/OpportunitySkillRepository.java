package com.skillmatch.opportunity.repository;

import com.skillmatch.common.enums.SkillImportance;
import com.skillmatch.opportunity.entity.Opportunity;
import com.skillmatch.opportunity.entity.OpportunitySkill;
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
}
