package com.skillmatch.application.service;

import com.skillmatch.application.dto.ApplicationResponse;
import com.skillmatch.application.dto.CreateApplicationRequest;
import com.skillmatch.application.dto.UpdateApplicationRequest;
import com.skillmatch.application.entity.Application;
import com.skillmatch.application.repository.ApplicationRepository;
import com.skillmatch.common.enums.ApplicationStatus;
import com.skillmatch.opportunity.dto.OpportunityCardResponse;
import com.skillmatch.opportunity.entity.Opportunity;
import com.skillmatch.opportunity.repository.OpportunityRepository;
import com.skillmatch.opportunity.service.MatchingService;
import com.skillmatch.opportunity.service.MatchResult;
import com.skillmatch.opportunity.service.OpportunityService;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;
    private final OpportunityService opportunityService;

    @Transactional
    public ApplicationResponse createApplication(UUID userId, CreateApplicationRequest request) {
        if (applicationRepository.existsByUserIdAndOpportunityId(userId, request.opportunityId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Application tracking already exists for this opportunity");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Opportunity opportunity = opportunityRepository.findByIdAndActiveTrue(request.opportunityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opportunity not found"));

        Application application = Application.builder()
                .user(user)
                .opportunity(opportunity)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        application = applicationRepository.save(application);

        return toResponse(application, user);
    }

    @Transactional
    public ApplicationResponse updateApplication(UUID userId, UUID id, UpdateApplicationRequest request) {
        Application application = applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (request.status() != null) {
            application.setStatus(request.status());
        }
        if (request.notes() != null) {
            application.setNotes(request.notes());
        }

        application = applicationRepository.save(application);

        return toResponse(application, application.getUser());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listMyApplications(UUID userId, ApplicationStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Application> applications;
        if (status != null) {
            applications = applicationRepository.findAllByUserIdAndStatusOrderByAppliedAtDesc(userId, status);
        } else {
            applications = applicationRepository.findAllByUserIdOrderByAppliedAtDesc(userId);
        }

        return applications.stream()
                .map(app -> toResponse(app, user))
                .toList();
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplication(UUID userId, UUID id) {
        Application application = applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        return toResponse(application, application.getUser());
    }

    @Transactional
    public void deleteApplication(UUID userId, UUID id) {
        Application application = applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        
        applicationRepository.delete(application);
    }

    private ApplicationResponse toResponse(Application application, User user) {
        Opportunity opportunity = application.getOpportunity();
        MatchResult result = matchingService.matchForUser(user, opportunity);
        OpportunityCardResponse cardResponse = opportunityService.toCardResponse(opportunity);

        return new ApplicationResponse(
                application.getId(),
                application.getStatus(),
                application.getAppliedAt(),
                application.getUpdatedAt(),
                application.getNotes(),
                cardResponse,
                result.matchPercentage()
        );
    }
}
