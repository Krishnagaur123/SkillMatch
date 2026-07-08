package com.skillmatch.user.dto;

import java.util.List;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String name,
        String email,
        String profilePictureUrl,
        List<String> targetRoles,
        boolean resumeUploaded,
        int skillsCount,
        int educationCount,
        int experienceCount,
        int profileCompletionPercentage
) {}
