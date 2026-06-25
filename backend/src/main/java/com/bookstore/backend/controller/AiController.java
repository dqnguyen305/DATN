package com.bookstore.backend.controller;

import com.bookstore.backend.dto.AiRequest;
import com.bookstore.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public String chat(
            @RequestBody AiRequest request
    ) {

        return aiService.chat(
                request
        );
    }
    @GetMapping("/test")
    public String test() {
        return "AI OK";
    }
}