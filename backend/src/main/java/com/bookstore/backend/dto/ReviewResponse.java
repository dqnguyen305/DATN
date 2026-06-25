package com.bookstore.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReviewResponse {

    private Integer reviewId;

    private String username;

    private Integer rating;
}