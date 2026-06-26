package com.bookstore.backend.controller;

import com.bookstore.backend.dto.PaymentResponse;
import com.bookstore.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create/{orderId}")
    public ResponseEntity<PaymentResponse> createPayment(
            @PathVariable Integer orderId
    ) {

        String paymentUrl =
                paymentService.createPaymentUrl(orderId);

        return ResponseEntity.ok(
                new PaymentResponse(paymentUrl)
        );
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> paymentReturn(
            @RequestParam String vnp_ResponseCode,
            @RequestParam String vnp_TransactionNo,
            @RequestParam String vnp_TxnRef
    ) {

        if ("00".equals(vnp_ResponseCode)) {

            paymentService.confirmPayment(
                    Integer.parseInt(vnp_TxnRef),
                    vnp_TransactionNo
            );
        }

        return ResponseEntity.ok("success");
    }
}