package com.skillmatch.skill.controller;

import com.skillmatch.skill.dto.SkillSummaryResponse;
import com.skillmatch.skill.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<List<SkillSummaryResponse>> getSkills(
            @RequestParam(name = "query", required = false) String query) {
        List<SkillSummaryResponse> response = skillService.getSkills(query);
        return ResponseEntity.ok(response);
    }
}
