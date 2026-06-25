package com.bookstore.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Integer orderId;

    private Integer userId;

    private LocalDateTime orderDate;

    private String status;

    private BigDecimal totalAmount;

    private String shippingAddress;

    private List<OrderItemResponse> items;
}