package com.skillmatch.resume.extractor;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.*;

@Service
public class ExperienceExtractor {

    private static final Set<String> SECTION_HEADERS = Set.of(
            "EXPERIENCE", "WORK EXPERIENCE", "PROFESSIONAL EXPERIENCE",
            "INTERNSHIPS", "INTERNSHIP", "EMPLOYMENT HISTORY", "WORK HISTORY"
    );

    private static final Set<String> STOP_HEADERS = Set.of(
            "EDUCATION", "ACADEMICS", "ACADEMIC BACKGROUND",
            "SKILLS", "PROJECTS", "CERTIFICATIONS", "ACHIEVEMENTS", "AWARDS",
            "PUBLICATIONS", "LANGUAGES", "INTERESTS", "HOBBIES", "REFERENCES",
            "SUMMARY", "OBJECTIVE", "PROFILE"
    );

    private static final Pattern DATE_PATTERN = Pattern.compile(
            "(?i)\\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\s+\\d{4}\\b|\\b(Present|Current|Till Date|Ongoing)\\b|\\b(\\d{4})\\b"
    );

    private static final Pattern DATE_RANGE_PATTERN = Pattern.compile(
            "(?i)((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\s+\\d{4}|\\d{4})\\s*[-–—to]+\\s*((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\s+\\d{4}|\\d{4}|Present|Current|Till Date|Ongoing)"
    );

    public List<ExperienceExtractionResult> extract(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptyList();
        }

        String[] lines = text.split("\\r?\\n");
        int sectionStart = findSectionStart(lines);
        if (sectionStart < 0) {
            return Collections.emptyList();
        }

        int sectionEnd = findSectionEnd(lines, sectionStart + 1);
        List<String> sectionLines = new ArrayList<>();
        for (int i = sectionStart + 1; i < sectionEnd; i++) {
            sectionLines.add(lines[i]);
        }

        return parseEntries(sectionLines);
    }

    private int findSectionStart(String[] lines) {
        for (int i = 0; i < lines.length; i++) {
            String upper = lines[i].trim().toUpperCase();
            if (SECTION_HEADERS.contains(upper)) {
                return i;
            }
        }
        return -1;
    }

    private int findSectionEnd(String[] lines, int from) {
        for (int i = from; i < lines.length; i++) {
            String upper = lines[i].trim().toUpperCase();
            if (STOP_HEADERS.contains(upper)) {
                return i;
            }
        }
        return lines.length;
    }

    private List<ExperienceExtractionResult> parseEntries(List<String> lines) {
        List<ExperienceExtractionResult> results = new ArrayList<>();
        List<String> block = new ArrayList<>();

        for (String line : lines) {
            if (line.isBlank()) {
                if (!block.isEmpty()) {
                    results.add(parseBlock(block));
                    block.clear();
                }
            } else {
                block.add(line);
            }
        }

        if (!block.isEmpty()) {
            results.add(parseBlock(block));
        }

        return results;
    }

    private ExperienceExtractionResult parseBlock(List<String> block) {
        String startDate = null;
        String endDate = null;
        String company = null;
        String jobTitle = null;
        List<String> descriptionLines = new ArrayList<>();

        for (int i = 0; i < block.size(); i++) {
            String line = block.get(i).trim();
            Matcher rangeMatcher = DATE_RANGE_PATTERN.matcher(line);
            if (rangeMatcher.find()) {
                startDate = rangeMatcher.group(1);
                endDate = rangeMatcher.group(2);
                String remaining = (line.substring(0, rangeMatcher.start()) + " " + line.substring(rangeMatcher.end())).trim();
                if (!remaining.isBlank()) {
                    if (jobTitle == null) {
                        jobTitle = remaining;
                    } else {
                        descriptionLines.add(remaining);
                    }
                }
            } else if (i == 0) {
                jobTitle = line;
            } else if (i == 1 && company == null) {
                company = line;
            } else {
                descriptionLines.add(line);
            }
        }

        String description = descriptionLines.isEmpty() ? null : String.join(" ", descriptionLines);

        return new ExperienceExtractionResult(company, jobTitle, startDate, endDate, description);
    }
}
