package com.talentlink.talentlink.order.entity;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    private String id;

    private String buyerId;
    private String buyerName;

    private String sellerId;
    private String sellerName;

    private String skillId;
    private String skillTitle;

    private String message;
    private double price;

    // PENDING, ACCEPTED, REJECTED, COMPLETED
    private String status;

    private String createdAt;
}