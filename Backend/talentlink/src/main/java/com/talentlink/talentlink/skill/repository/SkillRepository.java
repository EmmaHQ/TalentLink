package com.talentlink.talentlink.skill.repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.talentlink.talentlink.skill.entity.Skill;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class SkillRepository {

    private static final String COLLECTION = "users";

    private final Firestore db;

    public SkillRepository(Firestore db) {
        this.db = db;
    }

    public Skill save(String userId, Skill service) throws Exception {

        if (service.getId() == null) {
            service.setId(UUID.randomUUID().toString());
        }

        db.collection(COLLECTION)
                .document(userId)
                .collection("services")
                .document(service.getId())
                .set(service)
                .get();

        return service;
    }

    // En SkillRepository.java — agregar este método
    public void updateRating(String userId, String skillId, double rating) throws Exception {
        db.collection(COLLECTION)
                .document(userId)
                .collection("services")
                .document(skillId)
                .update("rating", rating) // update parcial, solo ese campo
                .get();
    }

    public List<Skill> findByUserId(String userId) throws Exception {

        QuerySnapshot snapshot = db.collection(COLLECTION)
                .document(userId)
                .collection("services")
                .get()
                .get();

        return snapshot.getDocuments()
                .stream()
                .map(doc -> doc.toObject(Skill.class))
                .toList();
    }

    public Skill findById(String userId, String serviceId) throws Exception {

        var doc = db.collection(COLLECTION)
                .document(userId)
                .collection("services")
                .document(serviceId)
                .get()
                .get();

        if (!doc.exists()) {
            return null;
        }

        return doc.toObject(Skill.class);
    }

    public void delete(String userId, String serviceId) throws Exception {

        db.collection(COLLECTION)
                .document(userId)
                .collection("services")
                .document(serviceId)
                .delete()
                .get();
    }
}