package com.skillmatch.user.service;

import com.skillmatch.resume.repository.ResumeRepository;
import com.skillmatch.role.entity.TargetRole;
import com.skillmatch.skill.repository.UserSkillRepository;
import com.skillmatch.user.dto.ProfileCompletionResponse;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.entity.UserProfile;
import com.skillmatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Computes profile completion dynamically — never stored in the database.
 *
 * <p>Each section carries a fixed weight constant. Weights must sum to 100.
 * Completion logic is fully encapsulated here; controllers receive only the
 * finished {@link ProfileCompletionResponse}.
 */
@Service
@RequiredArgsConstructor
public class ProfileCompletionService {

    // ── Section weights (must sum to 100) ─────────────────────────────────────
    private static final int HEADLINE_WEIGHT      = 10;
    private static final int ABOUT_WEIGHT         = 10;
    private static final int EDUCATION_WEIGHT     = 15;
    private static final int EXPERIENCE_WEIGHT    = 15;
    private static final int CONTACT_WEIGHT       = 10;
    private static final int LINKS_WEIGHT         = 10;
    private static final int RESUME_WEIGHT        = 15;
    private static final int SKILLS_WEIGHT        = 10;
    private static final int TARGET_ROLE_WEIGHT   = 5;
    // Total = 100

    // ── Section names (displayed to the user) ────────────────────────────────
    private static final String SECTION_HEADLINE    = "Headline";
    private static final String SECTION_ABOUT       = "About";
    private static final String SECTION_EDUCATION   = "Education";
    private static final String SECTION_EXPERIENCE  = "Experience";
    private static final String SECTION_CONTACT     = "Contact";
    private static final String SECTION_LINKS       = "Professional Links";
    private static final String SECTION_RESUME      = "Resume";
    private static final String SECTION_SKILLS      = "Skills";
    private static final String SECTION_TARGET_ROLE = "Target Roles";

    private final ResumeRepository resumeRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;

    /**
     * Computes the completion for the given user and their profile.
     *
     * <p>Uses repository EXISTS/COUNT queries rather than traversing LAZY collections
     * on the User entity — consistent with the established pattern in this codebase.
     *
     * @param user    the authenticated User
     * @param profile the user's UserProfile
     * @return a fully populated {@link ProfileCompletionResponse}
     */
    @Transactional(readOnly = true)
    public ProfileCompletionResponse compute(User user, UserProfile profile) {

        List<String> completed = new ArrayList<>();
        List<String> missing   = new ArrayList<>();
        int score = 0;

        // ── Headline ──────────────────────────────────────────────────────────
        if (hasText(profile.getHeadline())) {
            score += HEADLINE_WEIGHT;
            completed.add(SECTION_HEADLINE);
        } else {
            missing.add(SECTION_HEADLINE);
        }

        // ── About ─────────────────────────────────────────────────────────────
        if (hasText(profile.getAbout())) {
            score += ABOUT_WEIGHT;
            completed.add(SECTION_ABOUT);
        } else {
            missing.add(SECTION_ABOUT);
        }

        // ── Education (requires institution + degree or field of study) ───────
        if (hasText(profile.getInstitutionName()) &&
                (hasText(profile.getDegreeName()) || hasText(profile.getFieldOfStudy()))) {
            score += EDUCATION_WEIGHT;
            completed.add(SECTION_EDUCATION);
        } else {
            missing.add(SECTION_EDUCATION);
        }

        // ── Experience ────────────────────────────────────────────────────────
        if (profile.getExperienceLevel() != null) {
            score += EXPERIENCE_WEIGHT;
            completed.add(SECTION_EXPERIENCE);
        } else {
            missing.add(SECTION_EXPERIENCE);
        }

        // ── Contact (requires at least phone or city) ─────────────────────────
        if (hasText(profile.getPhoneNumber()) || hasText(profile.getCity())) {
            score += CONTACT_WEIGHT;
            completed.add(SECTION_CONTACT);
        } else {
            missing.add(SECTION_CONTACT);
        }

        // ── Professional Links (at least one provided) ────────────────────────
        if (hasText(profile.getLinkedinUrl())   ||
                hasText(profile.getGithubUrl())     ||
                hasText(profile.getPortfolioUrl())  ||
                hasText(profile.getLeetcodeUrl())   ||
                hasText(profile.getCodeforcesUrl())) {
            score += LINKS_WEIGHT;
            completed.add(SECTION_LINKS);
        } else {
            missing.add(SECTION_LINKS);
        }

        // ── Resume uploaded ───────────────────────────────────────────────────
        if (resumeRepository.existsByUser(user)) {
            score += RESUME_WEIGHT;
            completed.add(SECTION_RESUME);
        } else {
            missing.add(SECTION_RESUME);
        }

        // ── Skills added ──────────────────────────────────────────────────────
        if (userSkillRepository.existsByUser(user)) {
            score += SKILLS_WEIGHT;
            completed.add(SECTION_SKILLS);
        } else {
            missing.add(SECTION_SKILLS);
        }

        // ── Target roles ──────────────────────────────────────────────────────
        // Load with entity graph to check target roles without touching LAZY collection.
        boolean hasTargetRoles = userRepository.findWithTargetRolesById(user.getId())
                .map(u -> !u.getTargetRoles().isEmpty())
                .orElse(false);

        if (hasTargetRoles) {
            score += TARGET_ROLE_WEIGHT;
            completed.add(SECTION_TARGET_ROLE);
        } else {
            missing.add(SECTION_TARGET_ROLE);
        }

        return new ProfileCompletionResponse(
                score,
                List.copyOf(completed),
                List.copyOf(missing),
                deriveNextAction(missing)
        );
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    /**
     * Returns the single most impactful next action based on the first missing section.
     * Priority mirrors the order sections are evaluated above.
     */
    private String deriveNextAction(List<String> missing) {
        if (missing.isEmpty()) {
            return "Your profile is complete! Keep it up to date.";
        }
        return switch (missing.get(0)) {
            case SECTION_HEADLINE    -> "Add a professional headline to introduce yourself.";
            case SECTION_ABOUT       -> "Write a short 'About' summary to tell employers who you are.";
            case SECTION_EDUCATION   -> "Add your educational background (institution and degree).";
            case SECTION_EXPERIENCE  -> "Set your experience level to help match you with the right roles.";
            case SECTION_CONTACT     -> "Add your phone number or city so employers can reach you.";
            case SECTION_LINKS       -> "Add at least one professional link (LinkedIn, GitHub, etc.).";
            case SECTION_RESUME      -> "Upload your resume to unlock AI-powered analysis and skill matching.";
            case SECTION_SKILLS      -> "Add your skills so we can match you with relevant opportunities.";
            case SECTION_TARGET_ROLE -> "Select your target roles to personalise your opportunity feed.";
            default                  -> "Complete the remaining sections in your profile.";
        };
    }
}
