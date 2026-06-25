package com.bookstore.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserBehaviorDto {

    private Integer userId;

    private Integer bookId;

    private String action;
}