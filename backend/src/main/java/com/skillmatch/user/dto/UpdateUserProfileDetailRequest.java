package com.skillmatch.user.dto;

import com.skillmatch.user.enums.ExperienceLevel;
import com.skillmatch.user.enums.PreferredWorkMode;
import jakarta.validation.constraints.*;

import java.time.Year;

/**
 * Request DTO for creating or updating the authenticated user's profile detail.
 *
 * <p>All fields are optional (null = do not update that field).
 * Validation annotations enforce data integrity at the API boundary.
 */
public record UpdateUserProfileDetailRequest(

        @Size(max = 120, message = "Headline must not exceed 120 characters")
        String headline,

        @Size(max = 1000, message = "About must not exceed 1000 characters")
        String about,

        // ── Education ────────────────────────────────────────────────────────

        @Size(max = 255, message = "Institution name must not exceed 255 characters")
        String institutionName,

        @Size(max = 255, message = "Degree name must not exceed 255 characters")
        String degreeName,

        @Size(max = 255, message = "Field of study must not exceed 255 characters")
        String fieldOfStudy,

        @Min(value = 1950, message = "Graduation year must be 1950 or later")
        @Max(value = 2040, message = "Graduation year is too far in the future")
        Integer graduationYear,

        @DecimalMin(value = "0.0", message = "CGPA must be at least 0.0")
        @DecimalMax(value = "10.0", message = "CGPA must not exceed 10.0")
        Double cgpa,

        // ── Experience ───────────────────────────────────────────────────────

        ExperienceLevel experienceLevel,

        @Size(max = 255, message = "Current organisation must not exceed 255 characters")
        String currentOrganization,

        // ── Contact ──────────────────────────────────────────────────────────

        @Size(max = 20, message = "Phone number must not exceed 20 characters")
        String phoneNumber,

        @Size(max = 100, message = "City must not exceed 100 characters")
        String city,

        @Size(max = 100, message = "State must not exceed 100 characters")
        String state,

        @Size(max = 100, message = "Country must not exceed 100 characters")
        String country,

        // ── Professional Links ───────────────────────────────────────────────

        @org.hibernate.validator.constraints.URL(message = "LinkedIn URL must be a valid URL")
        @Size(max = 512, message = "LinkedIn URL must not exceed 512 characters")
        String linkedinUrl,

        @org.hibernate.validator.constraints.URL(message = "GitHub URL must be a valid URL")
        @Size(max = 512, message = "GitHub URL must not exceed 512 characters")
        String githubUrl,

        @org.hibernate.validator.constraints.URL(message = "Portfolio URL must be a valid URL")
        @Size(max = 512, message = "Portfolio URL must not exceed 512 characters")
        String portfolioUrl,

        @org.hibernate.validator.constraints.URL(message = "LeetCode URL must be a valid URL")
        @Size(max = 512, message = "LeetCode URL must not exceed 512 characters")
        String leetcodeUrl,

        @org.hibernate.validator.constraints.URL(message = "Codeforces URL must be a valid URL")
        @Size(max = 512, message = "Codeforces URL must not exceed 512 characters")
        String codeforcesUrl,

        // ── Preferences ──────────────────────────────────────────────────────

        PreferredWorkMode preferredWorkMode,

        Boolean openToWork

) {}
