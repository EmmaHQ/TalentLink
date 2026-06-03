package com.talentlink.talentlink.review.service;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.talentlink.talentlink.auth.service.AuthService;
import com.talentlink.talentlink.skill.repository.SkillRepository;
import com.talentlink.talentlink.user.repository.UserRepository;
import com.talentlink.talentlink.user.entity.User;
import com.talentlink.talentlink.review.entity.Review;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final Firestore firestore;
    private final AuthService authService;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public Review createReview(String token, String skillId, String skillOwnerId,
                               String comment, int rating) throws Exception {

        User user = authService.getCurrentUser(token);

        // 🚫 No puede reseñar su propia skill
        if (skillOwnerId.equals(user.getId())) {
            throw new RuntimeException("No puedes reseñar tus propias habilidades");
        }

        // 🚫 Validar duplicado
        var existing = firestore.collection("reviews")
                .whereEqualTo("userId", user.getId())
                .whereEqualTo("skillId", skillId)
                .get().get();

        if (!existing.isEmpty()) {
            throw new RuntimeException("Ya hiciste una reseña para esta habilidad");
        }

        // 💾 Guardar reseña
        DocumentReference docRef = firestore.collection("reviews").document();
        Review review = Review.builder()
                .id(docRef.getId())
                .userId(user.getId())
                .userName(user.getName())
                .skillId(skillId)
                .comment(comment)
                .rating(rating)
                .createdAt(LocalDateTime.now().toString())
                .build();

        docRef.set(review).get();

        // ⭐ Recalcular rating de la skill
        double skillRating = recalcularRatingSkill(skillId, skillOwnerId);

        // ⭐ Recalcular rating del usuario dueño de la skill
        recalcularRatingUsuario(skillOwnerId);

        return review;
    }

    // ── Recalcula rating de una skill y lo persiste ───────────────
    private double recalcularRatingSkill(String skillId, String skillOwnerId) throws Exception {
        List<QueryDocumentSnapshot> docs = firestore.collection("reviews")
                .whereEqualTo("skillId", skillId)
                .get().get()
                .getDocuments();

        if (docs.isEmpty()) return 0;

        double promedio = docs.stream()
                .mapToInt(d -> d.getLong("rating").intValue())
                .average()
                .orElse(0.0);

        double ratingFinal = Math.round(promedio * 10.0) / 10.0;
        skillRepository.updateRating(skillOwnerId, skillId, ratingFinal);
        return ratingFinal;
    }

    // ── Recalcula rating del usuario promediando todas sus skills ─
    private void recalcularRatingUsuario(String userId) throws Exception {
        List<com.talentlink.talentlink.skill.entity.Skill> skills =
                skillRepository.findByUserId(userId);

        if (skills == null || skills.isEmpty()) return;

        double promedio = skills.stream()
                .mapToDouble(s -> s.getRating())
                .average()
                .orElse(0.0);

        double ratingFinal = Math.round(promedio * 10.0) / 10.0;

        Map<String, Object> fields = new HashMap<>();
        fields.put("rating", ratingFinal);
        userRepository.updateFields(userId, fields);
    }
}