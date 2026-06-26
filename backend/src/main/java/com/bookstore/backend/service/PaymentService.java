package com.bookstore.backend.service;

import com.bookstore.backend.entity.Order;
import com.bookstore.backend.entity.Payment;
import com.bookstore.backend.repository.OrderRepository;
import com.bookstore.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${vnpay.tmnCode}")
    private String tmnCode;

    @Value("${vnpay.hashSecret}")
    private String hashSecret;

    @Value("${vnpay.payUrl}")
    private String payUrl;

    @Value("${vnpay.returnUrl}")
    private String returnUrl;

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public void confirmPayment(Integer orderId, String transactionNo) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus("CONFIRMED");

        Payment payment = paymentRepository.findByOrder_OrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setPaymentStatus("PAID");
        payment.setTransactionCode(transactionNo);
        payment.setPaymentDate(LocalDateTime.now());

        orderRepository.save(order);
        paymentRepository.save(payment);
    }

    public String createPaymentUrl(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // LƯU Ý BẮT BUỘC: Số tiền phải nhân với 100 theo quy định cổng VNPay
        long amount = order.getTotalAmount().longValue() * 100L;

        // Đồng bộ hóa mã giao dịch chính là Order ID của hệ thống
        String vnpTxnRef = String.valueOf(order.getOrderId());
        String vnpIpAddr = "127.0.0.1";

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        sdf.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        String createDate = sdf.format(new Date());

        // Sử dụng TreeMap để các tham số tự động sắp xếp theo bảng chữ cái từ A-Z
        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef",  String.valueOf(order.getOrderId()));
        params.put("vnp_OrderInfo", "Order_" + orderId);
        params.put("vnp_OrderType", "billpayment");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", vnpIpAddr);
        params.put("vnp_CreateDate", createDate);
        params.put("vnp_BankCode", "NCB");

        // Tách biệt chuỗi băm dữ liệu gốc (hashData) và chuỗi truy vấn URL (query)
        StringBuilder hashData =
                new StringBuilder();

        for (Map.Entry<String, String> entry : params.entrySet()) {

            hashData.append(
                    URLEncoder.encode(
                            entry.getKey(),
                            StandardCharsets.US_ASCII
                    )
            );

            hashData.append("=");

            hashData.append(
                    URLEncoder.encode(
                            entry.getValue(),
                            StandardCharsets.US_ASCII
                    )
            );

            hashData.append("&");
        }

        String queryUrl =
                hashData.substring(
                        0,
                        hashData.length() - 1
                );

        String secureHash =
                hmacSHA512(
                        hashSecret,
                        queryUrl
                );

        String paymentUrl =
                payUrl
                        + "?"
                        + queryUrl
                        + "&vnp_SecureHash="
                        + secureHash;
        System.out.println("--- VNPAY DEBUG INFO ---");
        System.out.println("RAW HASH DATA: " + hashData);
        System.out.println("SECURE HASH  : " + secureHash);
        System.out.println("FINAL URL    : " + paymentUrl);

        return paymentUrl;
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA512"
            );
            hmac512.init(secretKey);

            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi thuật toán mã hóa HMAC-SHA512", e);
        }
    }
}