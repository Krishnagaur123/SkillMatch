package com.skillmatch.company.entity;

import com.skillmatch.common.entity.BaseEntity;
import com.skillmatch.opportunity.entity.Opportunity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "companies",
        uniqueConstraints = @UniqueConstraint(name = "uq_companies_name", columnNames = "name")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false, unique = true, length = 255)
    private String name;

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;

    @Column(name = "website", length = 512)
    private String website;

    @Column(name = "industry", length = 255)
    private String industry;

    @Column(name = "headquarters", length = 255)
    private String headquarters;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Column(name = "founded_year")
    private Integer foundedYear;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Opportunity> opportunities = new ArrayList<>();
}
