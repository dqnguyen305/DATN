package com.bookstore.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponse {

    private Integer cartId;

    private Integer totalItems;

    private BigDecimal totalAmount;

    private List<CartItemResponse> items;
}