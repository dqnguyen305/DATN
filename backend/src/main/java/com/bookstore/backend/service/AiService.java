package com.bookstore.backend.service;

import com.bookstore.backend.dto.AiRequest;
import com.bookstore.backend.dto.AiResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AiService {

    private final RestTemplate restTemplate =
            new RestTemplate();

    public String chat(
            AiRequest request
    ) {

        AiResponse response =
                restTemplate.postForObject(
                        "http://localhost:8000/chat",
                        request,
                        AiResponse.class
                );

        if (response == null) {

            return "AI Service không phản hồi";
        }

        return response.answer();
    }
}