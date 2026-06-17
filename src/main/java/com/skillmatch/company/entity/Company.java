package com.skillmatch.company.entity;

import com.skillmatch.common.entity.BaseEntity;
import com.skillmatch.opportunity.entity.Opportunity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
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

    @Column(name = "website", length = 512)
    private String website;

    @Column(name = "industry", length = 255)
    private String industry;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Column(name = "estimated_ctc", precision = 15, scale = 2)
    private BigDecimal estimatedCtc;

    @Column(name = "estimated_stipend", precision = 15, scale = 2)
    private BigDecimal estimatedStipend;

    @Column(name = "ppo_available", nullable = false)
    @Builder.Default
    private Boolean ppoAvailable = false;

    @Column(name = "ppo_ctc", precision = 15, scale = 2)
    private BigDecimal ppoCtc;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Opportunity> opportunities = new ArrayList<>();
}
