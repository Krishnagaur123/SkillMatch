package com.skillmatch.company.service;

import com.skillmatch.company.dto.CompanyDetailResponse;
import com.skillmatch.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    @Transactional(readOnly = true)
    public CompanyDetailResponse getCompanyDetail(UUID companyId) {
        return companyRepository.findCompanyDetailById(companyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
    }
    @Transactional(readOnly = true)
    public List<com.skillmatch.company.dto.CompanySummaryResponse> listCompanies() {
        return companyRepository.findAllByOrderByNameAsc().stream()
                .map(c -> new com.skillmatch.company.dto.CompanySummaryResponse(
                        c.getId(),
                        c.getName(),
                        c.getLogoUrl(),
                        c.getWebsite(),
                        c.getIndustry(),
                        c.getHeadquarters(),
                        c.getEmployeeCount(),
                        c.getFoundedYear(),
                        c.getDescription(),
                        c.getOpportunities() == null ? 0L : c.getOpportunities().stream().filter(com.skillmatch.opportunity.entity.Opportunity::getActive).count()
                ))
                .toList();
    }
}
