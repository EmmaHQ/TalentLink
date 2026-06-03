package com.talentlink.talentlink.github_api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class GitHubController {

    private final GitHubService gitHubService;

    @GetMapping("/{username}")
    public Object getUser(
            @PathVariable String username
    ) {
        return gitHubService.fetchGitHubData(username);
    }
}