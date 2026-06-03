package com.talentlink.talentlink.skill.entity;

import lombok.Data;

@Data
public class Skill {

    private String id;
    private String title;
    private String category;
    private String level;
    private String description;
    private double price;
    private int rating;
}