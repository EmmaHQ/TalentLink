package com.talentlink.talentlink.user.controller;

import com.talentlink.talentlink.user.entity.User;
import com.talentlink.talentlink.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> create(@Valid @RequestBody User user) {
        String id = service.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable String id) {
        return ResponseEntity.ok(service.getUser(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<User> update(
            @PathVariable String id,
            @RequestBody Map<String, String> updates
    ) {
        return ResponseEntity.ok(service.updateUser(id, updates));
    }
}