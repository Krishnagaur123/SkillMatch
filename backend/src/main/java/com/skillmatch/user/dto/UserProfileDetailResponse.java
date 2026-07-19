package com.skillmatch.user.dto;

import com.skillmatch.user.enums.ExperienceLevel;
import com.skillmatch.user.enums.PreferredWorkMode;

import java.util.UUID;

/**
 * Full profile detail response for the authenticated user.
 *
 * <p>Combines authentication identity from {@code User} with professional
 * detail from {@code UserProfile} into a single flat response.
 */
public record UserProfileDetailResponse(

        // ── Identity (from User) ─────────────────────────────────────────────
        UUID userId,
        String name,
        String email,
        String profilePictureUrl,

        // ── Professional Identity ────────────────────────────────────────────
        String headline,
        String about,

        // ── Education ────────────────────────────────────────────────────────
        String institutionName,
        String degreeName,
        String fieldOfStudy,
        Integer graduationYear,
        Double cgpa,

        // ── Experience ───────────────────────────────────────────────────────
        ExperienceLevel experienceLevel,
        String currentOrganization,

        // ── Contact ──────────────────────────────────────────────────────────
        String phoneNumber,
        String city,
        String state,
        String country,

        // ── Professional Links ───────────────────────────────────────────────
        String linkedinUrl,
        String githubUrl,
        String portfolioUrl,
        String leetcodeUrl,
        String codeforcesUrl,

        // ── Preferences ──────────────────────────────────────────────────────
        PreferredWorkMode preferredWorkMode,
        Boolean openToWork

) {}
