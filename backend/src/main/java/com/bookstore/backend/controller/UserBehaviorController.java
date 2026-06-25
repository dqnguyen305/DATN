package com.bookstore.backend.controller;

import com.bookstore.backend.dto.UserBehaviorDto;
import com.bookstore.backend.service.UserBehaviorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/behaviors")
@RequiredArgsConstructor
public class UserBehaviorController {

    private final UserBehaviorService service;

    @GetMapping("/export")
    public List<UserBehaviorDto> export() {

        return service.export();
    }
}