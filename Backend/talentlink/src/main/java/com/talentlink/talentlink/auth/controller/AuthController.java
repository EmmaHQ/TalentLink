package com.talentlink.talentlink.auth.controller;

import com.talentlink.talentlink.auth.dto.AuthResponse;
import com.talentlink.talentlink.auth.dto.LoginRequest;
import com.talentlink.talentlink.auth.dto.RegisterRequest;
import com.talentlink.talentlink.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import com.talentlink.talentlink.user.entity.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authService.getCurrentUser(token));
    }
}