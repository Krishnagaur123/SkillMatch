package com.skillmatch.skill.service;

import com.skillmatch.skill.dto.SkillSummaryResponse;
import com.skillmatch.skill.entity.Skill;
import com.skillmatch.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    @Transactional(readOnly = true)
    public List<SkillSummaryResponse> getSkills(String query) {
        List<Skill> skills;
        if (StringUtils.hasText(query)) {
            skills = skillRepository.findByNameContainingIgnoreCaseOrderByNameAsc(query);
        } else {
            skills = skillRepository.findAllByOrderByNameAsc();
        }

        return skills.stream()
                .map(skill -> new SkillSummaryResponse(skill.getId(), skill.getName()))
                .collect(Collectors.toUnmodifiableList());
    }
}
