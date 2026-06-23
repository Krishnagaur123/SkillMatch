package com.skillmatch.resume.extractor;

public record ExperienceExtractionResult(
        String company,
        String jobTitle,
        String startDate,
        String endDate,
        String description
) {}
