package com.skillmatch.resume.extractor;

import com.skillmatch.skill.repository.SkillAliasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class SkillExtractor {

    private final SkillAliasRepository skillAliasRepository;

    public Set<UUID> extract(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptySet();
        }

        String lowerText = text.toLowerCase();
        Map<String, UUID> lookup = buildLookup();
        Set<UUID> matched = new LinkedHashSet<>();

        for (Map.Entry<String, UUID> entry : lookup.entrySet()) {
            String alias = entry.getKey();
            if (containsAlias(lowerText, alias)) {
                matched.add(entry.getValue());
            }
        }

        return matched;
    }

    private boolean containsAlias(String lowerText, String lowerAlias) {
        int idx = lowerText.indexOf(lowerAlias);
        if (idx < 0) {
            return false;
        }
        int end = idx + lowerAlias.length();
        boolean startBound = idx == 0 || !Character.isLetterOrDigit(lowerText.charAt(idx - 1));
        boolean endBound = end == lowerText.length() || !Character.isLetterOrDigit(lowerText.charAt(end));
        return startBound && endBound;
    }

    private Map<String, UUID> buildLookup() {
        Map<String, UUID> lookup = new HashMap<>();
        for (Object[] row : skillAliasRepository.findAllAliasProjections()) {
            String alias = (String) row[0];
            UUID skillId = (UUID) row[1];
            lookup.putIfAbsent(alias.toLowerCase(), skillId);
        }
        return lookup;
    }
}
