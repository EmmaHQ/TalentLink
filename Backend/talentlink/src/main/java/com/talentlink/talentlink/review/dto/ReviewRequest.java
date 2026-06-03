package com.talentlink.talentlink.review.dto;

public record ReviewRequest(
        String skillId,
        String skillOwnerId,
        String comment,
        int rating
) {}