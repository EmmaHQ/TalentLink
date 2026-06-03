package com.talentlink.talentlink.review.entity;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    private String id;

    private String userId;
    private String userName;

    private String skillId;
    private String skillTitle;

    private String comment;
    private int rating;

    private String createdAt;
}