package com.skillmatch.company.repository;

import com.skillmatch.company.dto.CompanyDetailResponse;
import com.skillmatch.company.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {

    @Query("""
        SELECT new com.skillmatch.company.dto.CompanyDetailResponse(
            c.id, c.name, c.logoUrl, c.website, c.industry,
            c.headquarters, c.employeeCount, c.foundedYear, c.description,
            COUNT(o.id)
        )
        FROM Company c
        LEFT JOIN c.opportunities o ON o.active = true
        WHERE c.id = :id
        GROUP BY c.id, c.name, c.logoUrl, c.website, c.industry, c.headquarters, c.employeeCount, c.foundedYear, c.description
    """)
    Optional<CompanyDetailResponse> findCompanyDetailById(@Param("id") UUID id);
}
