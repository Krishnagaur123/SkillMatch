package com.skillmatch.user.entity;

import com.skillmatch.common.entity.BaseEntity;
import com.skillmatch.user.enums.ExperienceLevel;
import com.skillmatch.user.enums.PreferredWorkMode;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Represents the extended professional profile of a user.
 *
 * <p>This entity is intentionally separate from {@link User}, which only carries
 * authentication and identity data. Every authenticated user must have exactly one
 * {@code UserProfile}; the service layer creates it automatically on first access.
 *
 * <p>Profile completion percentage is NOT stored here — it is computed dynamically
 * by {@code ProfileCompletionService}.
 */
@Entity
@Table(
        name = "user_profiles",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_user_profiles_user_id", columnNames = "user_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * Owning side of the one-to-one relationship.
     * UserProfile owns the FK column so that the User entity
     * remains focused purely on authentication/identity.
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(name = "fk_user_profiles_user")
    )
    private User user;

    // ── Professional Identity ────────────────────────────────────────────────

    @Column(name = "headline", length = 255)
    private String headline;

    @Column(name = "about", columnDefinition = "TEXT")
    private String about;

    // ── Education ────────────────────────────────────────────────────────────

    @Column(name = "institution_name", length = 255)
    private String institutionName;

    @Column(name = "degree_name", length = 255)
    private String degreeName;

    @Column(name = "field_of_study", length = 255)
    private String fieldOfStudy;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    /**
     * CGPA — mapped to DOUBLE PRECISION in SQL. Range enforced at service / validation level.
     */
    @Column(name = "cgpa")
    private Double cgpa;

    // ── Experience ───────────────────────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 50)
    private ExperienceLevel experienceLevel;

    @Column(name = "current_organization", length = 255)
    private String currentOrganization;

    // ── Contact ──────────────────────────────────────────────────────────────

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "country", length = 100)
    private String country;

    // ── Professional Links ───────────────────────────────────────────────────

    @Column(name = "linkedin_url", length = 512)
    private String linkedinUrl;

    @Column(name = "github_url", length = 512)
    private String githubUrl;

    @Column(name = "portfolio_url", length = 512)
    private String portfolioUrl;

    @Column(name = "leetcode_url", length = 512)
    private String leetcodeUrl;

    @Column(name = "codeforces_url", length = 512)
    private String codeforcesUrl;

    // ── Preferences ──────────────────────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_work_mode", length = 50)
    private PreferredWorkMode preferredWorkMode;

    @Column(name = "open_to_work", nullable = false)
    @Builder.Default
    private Boolean openToWork = false;
}
