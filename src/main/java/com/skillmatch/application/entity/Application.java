package com.skillmatch.application.entity;

import com.skillmatch.common.entity.BaseEntity;
import com.skillmatch.opportunity.entity.Opportunity;
import com.skillmatch.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "applications", uniqueConstraints = @UniqueConstraint(name = "uq_applications_user_opp", columnNames = {
                "user_id", "opportunity_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application extends BaseEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(name = "id", updatable = false, nullable = false)
        private UUID id;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_applications_user"))
        private User user;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "opportunity_id", nullable = false, foreignKey = @ForeignKey(name = "fk_applications_opportunity"))
        private Opportunity opportunity;

        @Enumerated(EnumType.STRING)
        @Column(name = "status", nullable = false, length = 50)
        @Builder.Default
        private com.skillmatch.common.enums.ApplicationStatus status = com.skillmatch.common.enums.ApplicationStatus.APPLIED;

        @Column(name = "applied_at")
        private LocalDateTime appliedAt;

        @Column(name = "notes", columnDefinition = "TEXT")
        private String notes;

        @Column(name = "updated_at", nullable = false)
        private LocalDateTime updatedAt;

        @PreUpdate
        public void onPreUpdate() {
                this.updatedAt = LocalDateTime.now();
        }
}
