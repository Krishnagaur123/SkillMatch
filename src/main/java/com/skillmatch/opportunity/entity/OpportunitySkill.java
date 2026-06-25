package com.skillmatch.opportunity.entity;

import com.skillmatch.common.entity.BaseEntity;
import com.skillmatch.common.enums.SkillImportance;
import com.skillmatch.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "opportunity_skills",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_opportunity_skills_pair",
                columnNames = {"opportunity_id", "skill_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunitySkill extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "opportunity_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_opportunity_skills_opportunity")
    )
    private Opportunity opportunity;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "skill_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_opportunity_skills_skill")
    )
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "importance", nullable = false, length = 50)
    @Builder.Default
    private SkillImportance importance = SkillImportance.REQUIRED;
}
