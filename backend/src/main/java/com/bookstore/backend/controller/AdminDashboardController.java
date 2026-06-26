package com.bookstore.backend.controller;

import com.bookstore.backend.dto.AdminDashboardResponse;
import com.bookstore.backend.entity.Order;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.OrderRepository;
import com.bookstore.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AdminDashboardController {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/api/admin/dashboard")
    public AdminDashboardResponse dashboard(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate,

            @RequestParam(defaultValue = "ALL")
            String type
    ) {
        LocalDate today = LocalDate.now();

        if (fromDate == null) {
            fromDate = today.withDayOfMonth(1);
        }

        if (toDate == null) {
            toDate = today;
        }

        if (fromDate.isAfter(toDate)) {
            throw new RuntimeException(
                    "Ngày bắt đầu không được lớn hơn ngày kết thúc"
            );
        }

        LocalDateTime fromDateTime = fromDate.atStartOfDay();
        LocalDateTime toDateTime = toDate.atTime(LocalTime.MAX);

        List<Order> orders;

        // Trường hợp 1: Chỉ đơn hoàn thành
        if ("COMPLETED".equalsIgnoreCase(type)) {

            orders = orderRepository
                    .findByOrderDateBetweenAndStatusIgnoreCase(
                            fromDateTime,
                            toDateTime,
                            "COMPLETED"
                    );

        }
        // Trường hợp 2: Hiện tất cả đơn hàng
        else {

            orders = orderRepository.findByOrderDateBetween(
                    fromDateTime,
                    toDateTime
            );
        }

        BigDecimal revenue = orders.stream()
                .map(Order::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminDashboardResponse.builder()
                .totalBooks(bookRepository.count())
                .totalUsers(userRepository.count())
                .totalOrders((long) orders.size())
                .totalRevenue(revenue)
                .build();
    }
}