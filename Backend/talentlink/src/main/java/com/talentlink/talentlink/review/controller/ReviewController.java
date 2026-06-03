package com.talentlink.talentlink.review.controller;

import com.talentlink.talentlink.review.dto.ReviewRequest;
import com.talentlink.talentlink.review.entity.Review;
import com.talentlink.talentlink.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(
            @RequestHeader("Authorization") String token,
            @RequestBody ReviewRequest request
    ) throws Exception {
        Review review = reviewService.createReview(
                token,
                request.skillId(),
                request.skillOwnerId(),
                request.comment(),
                request.rating()
        );
        return ResponseEntity.ok(review);
    }
}