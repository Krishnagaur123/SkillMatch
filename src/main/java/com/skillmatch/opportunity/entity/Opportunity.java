package com.skillmatch.opportunity.entity;

import com.skillmatch.application.entity.Application;
import com.skillmatch.common.entity.BaseEntity;
import com.skillmatch.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "opportunities",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_opportunities_source_external_id",
                columnNames = {"source", "external_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "company_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_opportunities_company")
    )
    private Company company;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "location", length = 255)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode", length = 50)
    private com.skillmatch.common.enums.WorkMode workMode;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", length = 50)
    private com.skillmatch.common.enums.EmploymentType employmentType;

    @Column(name = "application_url", columnDefinition = "TEXT")
    private String applicationUrl;

    @Column(name = "source", length = 255)
    private String source;

    @Column(name = "external_id", length = 255)
    private String externalId;

    @Column(name = "deduplication_key", length = 255)
    private String deduplicationKey;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @OneToMany(
            mappedBy = "opportunity",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<OpportunitySkill> opportunitySkills = new ArrayList<>();

    @OneToMany(mappedBy = "opportunity", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Application> applications = new ArrayList<>();
}
