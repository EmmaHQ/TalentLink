package com.talentlink.talentlink.auth.service;

import com.talentlink.talentlink.auth.dto.AuthResponse;
import com.talentlink.talentlink.auth.dto.LoginRequest;
import com.talentlink.talentlink.auth.dto.RegisterRequest;
import com.talentlink.talentlink.security.JwtService;
import com.talentlink.talentlink.user.entity.User;
import com.talentlink.talentlink.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================
    public AuthResponse register(RegisterRequest request) {

        try {
            // 1. crear usuario
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());

            // 2. guardar en Firebase
            userRepository.save(user);

            // 3. generar token
            String token = jwtService.generateToken(user.getId(), user.getEmail());

            return new AuthResponse(token, user.getId(), user.getEmail());

        } catch (Exception e) {
            throw new RuntimeException("Error during registration", e);
        }
    }

    public User getCurrentUser(String token) {

        // quitar "Bearer "
        String jwt = token.replace("Bearer ", "");

        // 1. extraer email del token
        String email = jwtService.extractEmail(jwt);

        try {
            // 2. buscar usuario en Firestore
            User user = userRepository.findByEmail(email);

            if (user == null) {
                return null; // o puedes lanzar error si prefieres
            }

            return user;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching user: " + e.getMessage());
        }
    }

    // =========================
    // LOGIN
    // =========================
    public AuthResponse login(LoginRequest request) {

        try {
            // 1. buscar usuario por email
            User user = userRepository.findByEmail(request.getEmail());

            // 2. validar existencia
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            // 3. validar password
            if (!user.getPassword().equals(request.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }

            // 4. generar token
            String token = jwtService.generateToken(user.getId(), user.getEmail());

            return new AuthResponse(token, user.getId(), user.getEmail());

        } catch (Exception e) {
            throw new RuntimeException("Error during login", e);
        }
    }
}