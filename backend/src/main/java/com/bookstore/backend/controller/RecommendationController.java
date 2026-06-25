package com.bookstore.backend.controller;

import com.bookstore.backend.dto.BookResponse;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public List<BookResponse> recommend(
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return recommendationService.recommend(
                user.getUserId()
        );
    }
}