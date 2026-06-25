package com.bookstore.backend.controller;

import com.bookstore.backend.service.ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final ImageUploadService imageUploadService;

    @PostMapping
    public Map<String, String> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {

        String imageUrl = imageUploadService.uploadImage(file);

        return Map.of(
                "imageUrl",
                imageUrl
        );
    }
}