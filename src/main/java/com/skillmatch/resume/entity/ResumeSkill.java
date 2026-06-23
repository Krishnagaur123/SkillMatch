package com.skillmatch.resume.entity;

import com.skillmatch.common.entity.BaseEntity;
import com.skillmatch.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "resume_skills",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_resume_skills_pair",
                columnNames = {"resume_id", "skill_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeSkill extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resume_id", nullable = false, foreignKey = @ForeignKey(name = "fk_resume_skills_resume"))
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false, foreignKey = @ForeignKey(name = "fk_resume_skills_skill"))
    private Skill skill;
}
