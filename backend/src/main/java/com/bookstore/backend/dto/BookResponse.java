package com.bookstore.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BookResponse {

    private Integer bookId;

    private String title;

    private String description;

    private BigDecimal price;

    private Integer stockQuantity;

    private String imageUrl;

    private Integer authorId;

    private String authorName;

    private Integer categoryId;

    private String categoryName;
}