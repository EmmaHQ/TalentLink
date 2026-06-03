package com.talentlink.talentlink.user.service;

import com.talentlink.talentlink.user.entity.User;
import com.talentlink.talentlink.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public String createUser(User user) {
        validateUser(user);
        try {
            return repository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error creating user in Firebase", e);
        }
    }

    public User getUser(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("User id cannot be null or empty");
        }
        try {
            User user = repository.findById(id);
            if (user == null) throw new RuntimeException("User not found with id: " + id);
            return user;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user from Firebase", e);
        }
    }

    public List<User> getAllUsers() {
        try {
            return repository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching users from Firebase", e);
        }
    }

    // ── Recibe Map para evitar validaciones de la entidad User ──
    public User updateUser(String id, Map<String, String> updates) {
        try {
            User existing = repository.findById(id);
            if (existing == null) throw new RuntimeException("User not found: " + id);

            Map<String, Object> fields = new HashMap<>();

            if (updates.containsKey("descripcion")) {
                fields.put("descripcion", updates.get("descripcion"));
                existing.setDescripcion(updates.get("descripcion"));
            }
            if (updates.containsKey("name") && !updates.get("name").isBlank()) {
                fields.put("name", updates.get("name"));
                existing.setName(updates.get("name"));
            }

            if (!fields.isEmpty()) {
                repository.updateFields(id, fields);
            }

            return existing;
        } catch (Exception e) {
            throw new RuntimeException("Error updating user", e);
        }
    }

    private void validateUser(User user) {
        if (user == null) throw new IllegalArgumentException("User cannot be null");
        if (user.getEmail() == null || user.getEmail().isBlank()) throw new IllegalArgumentException("Email is required");
        if (user.getName() == null || user.getName().isBlank()) throw new IllegalArgumentException("Name is required");
    }
}