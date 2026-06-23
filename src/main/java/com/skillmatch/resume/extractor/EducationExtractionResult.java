package com.skillmatch.resume.extractor;

public record EducationExtractionResult(
        String institution,
        String degree,
        String fieldOfStudy,
        Integer startYear,
        Integer endYear,
        String cgpa
) {}
