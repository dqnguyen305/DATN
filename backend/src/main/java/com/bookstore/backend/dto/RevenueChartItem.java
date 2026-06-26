package com.bookstore.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RevenueChartItem {

    private String date;

    private BigDecimal revenue;
}