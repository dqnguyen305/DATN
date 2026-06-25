package com.bookstore.backend.controller;

import com.bookstore.backend.dto.CheckoutRequest;
import com.bookstore.backend.dto.OrderResponse;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class UserOrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @RequestBody CheckoutRequest request,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        OrderResponse order =
                orderService.checkout(
                        user,
                        request.getShippingAddress()
                );

        return ResponseEntity.ok(order);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> myOrders(
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                orderService.getMyOrders(user)
        );
    }
}