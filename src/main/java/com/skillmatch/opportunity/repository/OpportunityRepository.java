package com.skillmatch.opportunity.repository;

import com.skillmatch.opportunity.entity.Opportunity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, UUID> {

    Page<Opportunity> findByActiveTrue(Pageable pageable);

    Page<Opportunity> findByActiveTrueAndLocationContainingIgnoreCase(String location, Pageable pageable);

    Page<Opportunity> findDistinctByActiveTrueAndOpportunityTargetRolesTargetRoleId(UUID targetRoleId, Pageable pageable);

    Page<Opportunity> findDistinctByActiveTrueAndLocationContainingIgnoreCaseAndOpportunityTargetRolesTargetRoleId(String location, UUID targetRoleId, Pageable pageable);

    Optional<Opportunity> findByIdAndActiveTrue(UUID id);
}
