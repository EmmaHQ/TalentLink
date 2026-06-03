package com.talentlink.talentlink.github_api;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GitHubService {

    public Object fetchGitHubData(String username) {

        RestTemplate restTemplate = new RestTemplate();

        String url =
                "https://api.github.com/users/" + username;

        return restTemplate.getForObject(
                url,
                Object.class
        );
    }
}