package com.bookstore.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {

    private Integer bookId;

    private Integer rating;
}