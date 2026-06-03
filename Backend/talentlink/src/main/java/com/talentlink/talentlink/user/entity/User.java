package com.talentlink.talentlink.user.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    private String githubUsername;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    private String descripcion;

    @NotBlank(message = "Password is required")
    private String password;

    private double rating; // ← promedio de todas sus skills
}