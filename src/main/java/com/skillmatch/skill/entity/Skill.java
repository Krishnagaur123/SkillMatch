package com.skillmatch.skill.entity;

import com.skillmatch.common.entity.BaseEntity;
import com.skillmatch.opportunity.entity.OpportunitySkill;
import com.skillmatch.resume.entity.ResumeSkill;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "skills",
        uniqueConstraints = @UniqueConstraint(name = "uq_skills_name", columnNames = "name")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false, unique = true, length = 255)
    private String name;

    @OneToMany(
            mappedBy = "skill",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<SkillAlias> aliases = new ArrayList<>();

    @OneToMany(mappedBy = "skill", fetch = FetchType.LAZY)
    @Builder.Default
    private List<UserSkill> userSkills = new ArrayList<>();

    @OneToMany(mappedBy = "skill", fetch = FetchType.LAZY)
    @Builder.Default
    private List<OpportunitySkill> opportunitySkills = new ArrayList<>();

    @OneToMany(mappedBy = "skill", fetch = FetchType.LAZY)
    @Builder.Default
    private List<ResumeSkill> resumeSkills = new ArrayList<>();
}
