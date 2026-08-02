package com.skillmatch.user.mapper;

import com.skillmatch.user.dto.UpdateUserProfileDetailRequest;
import com.skillmatch.user.dto.UserProfileDetailResponse;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.entity.UserProfile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Centralised mapper for {@link UserProfile} ↔ DTO conversions.
 *
 * <p>All mapping logic is isolated here so that services remain free of
 * repetitive field-by-field assignments, and future adoption of MapStruct
 * can replace this class without touching service code.
 */
public final class UserProfileMapper {

    private UserProfileMapper() {
        // utility class — no instances
    }

    /**
     * Maps a {@link UserProfile} (with its parent {@link User}) to a flat response DTO.
     *
     * @param profile the UserProfile entity (must not be null)
     * @param user    the associated User entity (must not be null)
     * @return a fully populated {@link UserProfileDetailResponse}
     */
    public static UserProfileDetailResponse toDetailResponse(UserProfile profile, User user) {
        String picture = user.getProfilePictureUrl();
        if (picture != null && !picture.startsWith("http")) {
            picture = "/api/v1/users/" + user.getId() + "/avatar?v=" + URLEncoder.encode(picture, StandardCharsets.UTF_8);
        }

        return new UserProfileDetailResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                picture,

                profile.getHeadline(),
                profile.getAbout(),

                profile.getInstitutionName(),
                profile.getDegreeName(),
                profile.getFieldOfStudy(),
                profile.getGraduationYear(),
                profile.getCgpa(),

                profile.getExperienceLevel(),
                profile.getCurrentOrganization(),

                profile.getPhoneNumber(),
                profile.getCity(),
                profile.getState(),
                profile.getCountry(),

                profile.getLinkedinUrl(),
                profile.getGithubUrl(),
                profile.getPortfolioUrl(),
                profile.getLeetcodeUrl(),
                profile.getCodeforcesUrl(),

                profile.getPreferredWorkMode(),
                profile.getOpenToWork()
        );
    }

    /**
     * Applies non-null fields from the request onto the existing profile entity (patch semantics).
     *
     * <p>Fields that are {@code null} in the request are intentionally left unchanged,
     * allowing partial updates without overwriting existing data.
     *
     * @param request the incoming update request
     * @param profile the UserProfile entity to mutate
     */
    public static void applyUpdate(UpdateUserProfileDetailRequest request, UserProfile profile) {
        if (request.headline() != null)             profile.setHeadline(request.headline());
        if (request.about() != null)                profile.setAbout(request.about());

        if (request.institutionName() != null)      profile.setInstitutionName(request.institutionName());
        if (request.degreeName() != null)           profile.setDegreeName(request.degreeName());
        if (request.fieldOfStudy() != null)         profile.setFieldOfStudy(request.fieldOfStudy());
        if (request.graduationYear() != null)       profile.setGraduationYear(request.graduationYear());
        if (request.cgpa() != null)                 profile.setCgpa(request.cgpa());

        if (request.experienceLevel() != null)      profile.setExperienceLevel(request.experienceLevel());
        if (request.currentOrganization() != null)  profile.setCurrentOrganization(request.currentOrganization());

        if (request.phoneNumber() != null)          profile.setPhoneNumber(request.phoneNumber());
        if (request.city() != null)                 profile.setCity(request.city());
        if (request.state() != null)                profile.setState(request.state());
        if (request.country() != null)              profile.setCountry(request.country());

        if (request.linkedinUrl() != null)          profile.setLinkedinUrl(request.linkedinUrl());
        if (request.githubUrl() != null)            profile.setGithubUrl(request.githubUrl());
        if (request.portfolioUrl() != null)         profile.setPortfolioUrl(request.portfolioUrl());
        if (request.leetcodeUrl() != null)          profile.setLeetcodeUrl(request.leetcodeUrl());
        if (request.codeforcesUrl() != null)        profile.setCodeforcesUrl(request.codeforcesUrl());

        if (request.preferredWorkMode() != null)    profile.setPreferredWorkMode(request.preferredWorkMode());
        if (request.openToWork() != null)           profile.setOpenToWork(request.openToWork());
    }
}
