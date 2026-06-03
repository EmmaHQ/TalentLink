package com.talentlink.talentlink.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // 🔐 CLAVE FIJA (NO cambia al reiniciar)
    private static final String SECRET_KEY = "q8F3kLm92xPzA7vBn4YwT6uR1cD5eHjK";

    private final Key SECRET = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public String generateToken(String userId, String email) {

        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SECRET)
                .compact();
    }

    public String extractEmail(String token) {

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public String extractUserId(String token) {

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("userId", String.class);
    }
}