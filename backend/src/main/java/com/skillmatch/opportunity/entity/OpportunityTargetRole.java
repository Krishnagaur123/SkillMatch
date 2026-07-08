package com.skillmatch.opportunity.entity;

import com.skillmatch.common.entity.BaseEntity;
import com.skillmatch.role.entity.TargetRole;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "opportunity_target_roles",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_opportunity_target_roles_pair",
                columnNames = {"opportunity_id", "target_role_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityTargetRole extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "opportunity_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_opportunity_target_roles_opportunity")
    )
    private Opportunity opportunity;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "target_role_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_opportunity_target_roles_target_role")
    )
    private TargetRole targetRole;
}
