package com.bookstore.backend.dto;

public record ChatMessage(
        String role,
        String content
) {
}