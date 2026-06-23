package com.skillmatch.resume.extractor;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.*;

@Service
public class EducationExtractor {

    private static final Set<String> SECTION_HEADERS = Set.of(
            "EDUCATION", "ACADEMICS", "ACADEMIC BACKGROUND", "EDUCATIONAL BACKGROUND", "ACADEMIC QUALIFICATIONS"
    );

    private static final Set<String> STOP_HEADERS = Set.of(
            "EXPERIENCE", "WORK EXPERIENCE", "PROFESSIONAL EXPERIENCE", "INTERNSHIPS",
            "SKILLS", "PROJECTS", "CERTIFICATIONS", "ACHIEVEMENTS", "AWARDS",
            "PUBLICATIONS", "LANGUAGES", "INTERESTS", "HOBBIES", "REFERENCES",
            "SUMMARY", "OBJECTIVE", "PROFILE"
    );

    private static final List<String> DEGREE_KEYWORDS = List.of(
            "B.Tech", "M.Tech", "B.E.", "M.E.", "B.Sc", "M.Sc", "B.Com", "M.Com",
            "BCA", "MCA", "BBA", "MBA", "Ph.D", "PhD", "Bachelor", "Master",
            "Diploma", "B.A.", "M.A.", "LLB", "LLM", "B.Arch", "B.Des"
    );

    private static final Pattern YEAR_PATTERN = Pattern.compile("\\b(19|20)\\d{2}\\b");
    private static final Pattern CGPA_PATTERN = Pattern.compile(
            "(?i)(?:cgpa|gpa|score)\\s*[:\\-]?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*(?:/\\s*([0-9]+(?:\\.[0-9]+)?))?|([0-9]+\\.[0-9]+)\\s*/\\s*([0-9]+(?:\\.[0-9]+)?)"
    );

    public List<EducationExtractionResult> extract(String text) {
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

    private List<EducationExtractionResult> parseEntries(List<String> lines) {
        List<EducationExtractionResult> results = new ArrayList<>();
        List<String> block = new ArrayList<>();

        for (String line : lines) {
            if (line.isBlank()) {
                if (!block.isEmpty()) {
                    EducationExtractionResult result = parseBlock(block);
                    if (result != null) {
                        results.add(result);
                    }
                    block.clear();
                }
            } else {
                block.add(line);
            }
        }

        if (!block.isEmpty()) {
            EducationExtractionResult result = parseBlock(block);
            if (result != null) {
                results.add(result);
            }
        }

        return results;
    }

    private EducationExtractionResult parseBlock(List<String> block) {
        String fullText = String.join(" ", block);

        String degree = extractDegree(fullText);
        List<Integer> years = extractYears(fullText);
        String cgpa = extractCgpa(fullText);
        String institution = extractInstitution(block, degree);

        if (degree == null && institution == null && years.isEmpty() && cgpa == null) {
            return null;
        }

        Integer startYear = years.size() >= 2 ? years.get(0) : null;
        Integer endYear = years.size() >= 2 ? years.get(1) : (years.size() == 1 ? years.get(0) : null);

        return new EducationExtractionResult(institution, degree, null, startYear, endYear, cgpa);
    }

    private String extractDegree(String text) {
        for (String keyword : DEGREE_KEYWORDS) {
            if (text.toLowerCase().contains(keyword.toLowerCase())) {
                return keyword;
            }
        }
        return null;
    }

    private List<Integer> extractYears(String text) {
        Matcher m = YEAR_PATTERN.matcher(text);
        List<Integer> years = new ArrayList<>();
        while (m.find()) {
            years.add(Integer.parseInt(m.group()));
        }
        return years;
    }

    private String extractCgpa(String text) {
        Matcher m = CGPA_PATTERN.matcher(text);
        if (m.find()) {
            if (m.group(1) != null) {
                String val = m.group(1);
                String outOf = m.group(2);
                return outOf != null ? val + "/" + outOf : val;
            }
            if (m.group(3) != null) {
                return m.group(3) + "/" + m.group(4);
            }
        }
        return null;
    }

    private String extractInstitution(List<String> block, String degree) {
        for (String line : block) {
            String trimmed = line.trim();
            if (trimmed.isBlank()) continue;
            boolean hasDegree = degree != null && trimmed.toLowerCase().contains(degree.toLowerCase());
            boolean hasYear = YEAR_PATTERN.matcher(trimmed).find();
            if (!hasDegree && !hasYear && trimmed.length() > 3) {
                return trimmed;
            }
        }
        return null;
    }
}
