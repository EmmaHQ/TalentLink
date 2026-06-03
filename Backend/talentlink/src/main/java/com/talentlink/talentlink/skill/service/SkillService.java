package com.talentlink.talentlink.skill.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.talentlink.talentlink.skill.entity.Skill;
import com.talentlink.talentlink.skill.repository.SkillRepository;

@Service
public class SkillService {

    private final SkillRepository repository;

    public SkillService(SkillRepository repository) {
        this.repository = repository;
    }

    public Skill createSkill(String userId, Skill skill) throws Exception {
        return repository.save(userId, skill);
    }

    public List<Skill> getSkills(String userId) throws Exception {
        return repository.findByUserId(userId);
    }

    public Skill getSkillById(String userId, String skillId) throws Exception {
        return repository.findById(userId, skillId);
    }

    public Skill updateSkill(String userId, String skillId, Skill skill) throws Exception {
        skill.setId(skillId);
        return repository.save(userId, skill);
    }

    public void deleteSkill(String userId, String skillId) throws Exception {
        repository.delete(userId, skillId);
    }
}