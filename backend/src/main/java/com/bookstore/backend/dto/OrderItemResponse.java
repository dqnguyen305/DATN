package com.bookstore.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponse {

    private Integer orderDetailId;

    private Integer bookId;

    private String title;

    private String imageUrl;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal subtotal;
}