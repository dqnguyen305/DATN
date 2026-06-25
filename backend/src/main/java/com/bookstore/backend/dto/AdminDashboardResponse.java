package com.bookstore.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AdminDashboardResponse {

    private Long totalBooks;

    private Long totalUsers;

    private Long totalOrders;

    private BigDecimal totalRevenue;
}