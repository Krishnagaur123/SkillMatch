package com.skillmatch.opportunity.repository;

import com.skillmatch.opportunity.entity.Opportunity;
import com.skillmatch.opportunity.entity.OpportunityTargetRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OpportunityTargetRoleRepository extends JpaRepository<OpportunityTargetRole, UUID> {

    @Query("SELECT otr FROM OpportunityTargetRole otr JOIN FETCH otr.targetRole WHERE otr.opportunity = :opportunity")
    List<OpportunityTargetRole> findAllByOpportunityWithTargetRole(@Param("opportunity") Opportunity opportunity);
}
