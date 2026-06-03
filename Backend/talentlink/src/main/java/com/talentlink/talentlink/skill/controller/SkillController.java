package com.talentlink.talentlink.skill.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.talentlink.talentlink.skill.entity.Skill;
import com.talentlink.talentlink.skill.service.SkillService;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/services")
public class SkillController {

    private final SkillService service;

    public SkillController(SkillService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Skill> create(
            @PathVariable String userId,
            @RequestBody Skill s) throws Exception {
        return ResponseEntity.ok(service.createSkill(userId, s));
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAll(
            @PathVariable String userId) throws Exception {
        return ResponseEntity.ok(service.getSkills(userId));
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<Skill> getById(
            @PathVariable String userId,
            @PathVariable String serviceId) throws Exception {
        return ResponseEntity.ok(service.getSkillById(userId, serviceId));
    }

    @PutMapping("/{serviceId}")
    public ResponseEntity<Skill> update(
            @PathVariable String userId,
            @PathVariable String serviceId,
            @RequestBody Skill skill) throws Exception {
        return ResponseEntity.ok(service.updateSkill(userId, serviceId, skill));
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> delete(
            @PathVariable String userId,
            @PathVariable String serviceId) throws Exception {
        service.deleteSkill(userId, serviceId);
        return ResponseEntity.noContent().build();
    }
}