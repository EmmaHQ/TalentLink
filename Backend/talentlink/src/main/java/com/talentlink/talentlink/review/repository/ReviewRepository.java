package com.talentlink.talentlink.review.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.talentlink.talentlink.review.entity.Review;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ReviewRepository {

    private final Firestore firestore;
    private final String COLLECTION = "reviews";

    // 💾 Guardar review
    public Review save(Review review) throws Exception {
        DocumentReference docRef = firestore.collection(COLLECTION).document(review.getId());
        ApiFuture<WriteResult> result = docRef.set(review);
        result.get(); // esperar a que se guarde
        return review;
    }

    // 🔍 Buscar reviews por skill
    public List<Review> findBySkillId(String skillId) throws Exception {

        ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION)
                .whereEqualTo("skillId", skillId)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Review> reviews = new ArrayList<>();

        for (QueryDocumentSnapshot doc : documents) {
            reviews.add(doc.toObject(Review.class));
        }

        return reviews;
    }

    // 🔍 Buscar si ya existe review (user + skill)
    public Review findByUserIdAndSkillId(String userId, String skillId) throws Exception {

        ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION)
                .whereEqualTo("userId", userId)
                .whereEqualTo("skillId", skillId)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        if (documents.isEmpty()) {
            return null;
        }

        return documents.get(0).toObject(Review.class);
    }
}