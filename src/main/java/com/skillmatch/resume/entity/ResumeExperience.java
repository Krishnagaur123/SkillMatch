package com.skillmatch.resume.entity;

import com.skillmatch.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "resume_experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeExperience extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resume_id", nullable = false, foreignKey = @ForeignKey(name = "fk_resume_experiences_resume"))
    private Resume resume;

    @Column(name = "company", length = 255)
    private String company;

    @Column(name = "job_title", length = 255)
    private String jobTitle;

    @Column(name = "start_date", length = 100)
    private String startDate;

    @Column(name = "end_date", length = 100)
    private String endDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
