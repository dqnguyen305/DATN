package com.bookstore.backend.controller;

import com.bookstore.backend.dto.AdminDashboardResponse;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.OrderRepository;
import com.bookstore.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
public class AdminDashboardController {

    private final BookRepository bookRepository;

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;

    @GetMapping("/api/admin/dashboard")
    public AdminDashboardResponse dashboard() {

        BigDecimal revenue =
                orderRepository.findAll()
                        .stream()
                        .map(order ->
                                order.getTotalAmount()
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        return AdminDashboardResponse.builder()

                .totalBooks(
                        bookRepository.count()
                )

                .totalUsers(
                        userRepository.count()
                )

                .totalOrders(
                        orderRepository.count()
                )

                .totalRevenue(
                        revenue
                )

                .build();
    }
}