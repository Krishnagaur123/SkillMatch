package com.skillmatch.user.service;

import com.skillmatch.resume.repository.ResumeSkillRepository;
import com.skillmatch.skill.entity.Skill;
import com.skillmatch.skill.entity.UserSkill;
import com.skillmatch.skill.repository.SkillRepository;
import com.skillmatch.skill.repository.UserSkillRepository;
import com.skillmatch.user.dto.AddUserSkillRequest;
import com.skillmatch.user.dto.UserSkillResponse;
import com.skillmatch.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UserSkillService {

    private final CurrentUserService currentUserService;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final ResumeSkillRepository resumeSkillRepository;


    @Transactional(readOnly = true)
    public List<UserSkillResponse> listCurrentUserSkills() {
        User user = currentUserService.getCurrentUser();

        Set<UUID> effectiveIds = getEffectiveSkillIds(user);
        if (effectiveIds.isEmpty()) {
            return List.of();
        }

        return skillRepository.findAllByIdIn(effectiveIds)
                .stream()
                .sorted(Comparator.comparing(Skill::getName, String.CASE_INSENSITIVE_ORDER))
                .map(s -> new UserSkillResponse(s.getId(), s.getName()))
                .toList();
    }

    @Transactional
    public UserSkillResponse addSkill(AddUserSkillRequest request) {
        User user = currentUserService.getCurrentUser();

        Skill skill = skillRepository.findById(request.skillId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Skill not found: " + request.skillId()));

        // Check against effective set — a skill already in the resume is a conflict.
        Set<UUID> effectiveIds = getEffectiveSkillIds(user);
        if (effectiveIds.contains(skill.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Skill already in your skill set: " + skill.getName());
        }

        UserSkill saved = userSkillRepository.save(
                UserSkill.builder().user(user).skill(skill).build()
        );

        return new UserSkillResponse(saved.getSkill().getId(), saved.getSkill().getName());
    }


    @Transactional
    public void removeSkill(UUID skillId) {
        User user = currentUserService.getCurrentUser();

        Set<UUID> resumeSkillIds = getResumeSkillIds(user);

        if (resumeSkillIds.contains(skillId)) {
            // Reject — resume-derived skills cannot be manually deleted.
            String name = skillRepository.findById(skillId)
                    .map(Skill::getName)
                    .orElse(skillId.toString());
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Skill \"" + name + "\" is derived from your resume and cannot be removed manually");
        }

        // If not a resume skill, delete the manual mapping (no-op if it doesn't exist).
        skillRepository.findById(skillId).ifPresent(skill ->
                userSkillRepository.deleteByUserAndSkill(user, skill)
        );
    }


    @Transactional(readOnly = true)
    public Set<UUID> getResumeSkillIds(User user) {
        return new HashSet<>(resumeSkillRepository.findSkillIdsByActiveResumeOfUser(user));
    }

    @Transactional(readOnly = true)
    public Set<UUID> getManualSkillIds(User user) {
        return new HashSet<>(userSkillRepository.findSkillIdsByUser(user));
    }

    @Transactional(readOnly = true)
    public Set<UUID> getEffectiveSkillIds(User user) {
        Set<UUID> effective = getResumeSkillIds(user);
        effective.addAll(getManualSkillIds(user));
        return effective;
    }
}
