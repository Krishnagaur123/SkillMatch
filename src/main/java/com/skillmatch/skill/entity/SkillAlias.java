package com.skillmatch.skill.entity;

import com.skillmatch.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "skill_aliases",
        uniqueConstraints = @UniqueConstraint(name = "uq_skill_aliases_alias", columnNames = "alias")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillAlias extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "skill_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_skill_aliases_skill")
    )
    private Skill skill;

    @Column(name = "alias", nullable = false, unique = true, length = 255)
    private String alias;
}
