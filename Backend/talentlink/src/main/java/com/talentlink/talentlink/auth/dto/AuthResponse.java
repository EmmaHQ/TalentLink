package com.talentlink.talentlink.auth.dto;

public class AuthResponse {

    private String token;
    private String userId;
    private String email;

    public AuthResponse(String token, String userId, String email) {
        this.token = token;
        this.userId = userId;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }
}