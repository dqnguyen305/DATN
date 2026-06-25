package com.bookstore.backend.controller;

import com.bookstore.backend.dto.ReviewRequest;
import com.bookstore.backend.dto.ReviewResponse;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(
            Authentication authentication,
            @RequestBody ReviewRequest request
    ) {

        if (authentication == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Chưa đăng nhập");
        }

        User user =
                (User) authentication.getPrincipal();

        reviewService.createReview(
                user.getUsername(),
                request
        );

        return ResponseEntity.ok(
                "Đánh giá thành công"
        );
    }

    @GetMapping("/book/{bookId}")
    public List<ReviewResponse> getBookReviews(
            @PathVariable Integer bookId
    ) {

        return reviewService.getBookReviews(
                bookId
        );
    }

    @GetMapping("/book/{bookId}/average")
    public Double getAverageRating(
            @PathVariable Integer bookId
    ) {

        return reviewService.getAverageRating(
                bookId
        );
    }
}