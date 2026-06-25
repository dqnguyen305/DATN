package com.bookstore.backend.dto;

import java.util.List;

public record AiRequest(
        String message,
        List<ChatMessage> history
) {
}