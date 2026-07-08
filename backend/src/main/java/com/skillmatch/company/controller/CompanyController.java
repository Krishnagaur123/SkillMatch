package com.skillmatch.company.controller;

import com.skillmatch.company.dto.CompanyDetailResponse;
import com.skillmatch.company.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping("/{companyId}")
    public ResponseEntity<CompanyDetailResponse> getCompany(@PathVariable UUID companyId) {
        CompanyDetailResponse response = companyService.getCompanyDetail(companyId);
        return ResponseEntity.ok(response);
    }
}
