package com.skillmatch.application.repository;

import com.skillmatch.application.entity.Application;
import com.skillmatch.common.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    
    boolean existsByUserIdAndOpportunityId(UUID userId, UUID opportunityId);
    
    Optional<Application> findByIdAndUserId(UUID id, UUID userId);
    
    List<Application> findAllByUserIdOrderByAppliedAtDesc(UUID userId);
    
    List<Application> findAllByUserIdAndStatusOrderByAppliedAtDesc(UUID userId, ApplicationStatus status);
}
