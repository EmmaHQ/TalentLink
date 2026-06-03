package com.talentlink.talentlink.user.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.talentlink.talentlink.user.entity.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Repository
public class UserRepository {

    private static final String COLLECTION = "users";

    private final Firestore db;

    public UserRepository(Firestore db) {
        this.db = db;
    }

    public String save(User user) throws ExecutionException, InterruptedException {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID().toString());
        }
        ApiFuture<WriteResult> future = db.collection(COLLECTION)
                .document(user.getId())
                .set(user);
        return user.getId() + " | " + future.get().getUpdateTime().toString();
    }

    // ── Update parcial — solo toca los campos que se pasan ──
    public void updateFields(String id, Map<String, Object> fields) throws Exception {
        db.collection(COLLECTION)
                .document(id)
                .update(fields)
                .get();
    }

    public User findByEmail(String email) throws ExecutionException, InterruptedException {
        var querySnapshot = db.collection(COLLECTION)
                .whereEqualTo("email", email)
                .get()
                .get();

        if (querySnapshot.isEmpty()) return null;

        return querySnapshot.getDocuments().get(0).toObject(User.class);
    }

    public User findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot snapshot = db.collection(COLLECTION)
                .document(id)
                .get()
                .get();

        if (!snapshot.exists()) return null;

        return snapshot.toObject(User.class);
    }

    public List<User> findAll() throws ExecutionException, InterruptedException {
        return db.collection(COLLECTION)
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(doc -> doc.toObject(User.class))
                .toList();
    }
}