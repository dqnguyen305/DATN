package com.bookstore.backend.controller;

import com.bookstore.backend.dto.OrderResponse;
import com.bookstore.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Integer id
    ) {

        return ResponseEntity.ok(
                orderService.getOrderById(id)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request
    ) {

        return ResponseEntity.ok(
                orderService.updateStatus(
                        id,
                        request.get("status")
                )
        );
    }
}