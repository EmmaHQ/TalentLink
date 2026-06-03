package com.talentlink.talentlink.github_api;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class GitHubService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Object fetchGitHubData(String username) {

        try {
            String url = "https://api.github.com/users/" + username;

            return restTemplate.getForObject(url, Object.class);

        } catch (Exception e) {
            System.out.println("ERROR GitHub API: " + e.getMessage());

            return Map.of(
                "error", "No se pudo obtener el usuario de GitHub",
                "username", username
            );
        }
    }
}