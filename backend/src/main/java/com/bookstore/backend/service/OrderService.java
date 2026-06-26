package com.bookstore.backend.service;

import com.bookstore.backend.dto.OrderItemResponse;
import com.bookstore.backend.dto.OrderResponse;
import com.bookstore.backend.entity.*;
import com.bookstore.backend.repository.CartRepository;
import com.bookstore.backend.repository.OrderDetailRepository;
import com.bookstore.backend.repository.OrderRepository;
import com.bookstore.backend.repository.PaymentRepository;
import com.itextpdf.text.pdf.BaseFont;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserBehaviorService behaviorService;
    private final PaymentRepository paymentRepository;

    public OrderResponse checkout(User user, String shippingAddress, String paymentMethod) {
        // 1. Kiểm tra giỏ hàng
        Cart cart = cartRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 2. Khởi tạo và lưu Order ban đầu
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);
        order = orderRepository.save(order);

        // 3. Xử lý các sản phẩm trong giỏ hàng và tính tổng tiền
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cart.getCartItems()) {
            // Lưu hành vi người dùng (AI Recommendation Log)
            behaviorService.save(user, item.getBook(), "BUY");

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setBook(item.getBook());
            detail.setQuantity(item.getQuantity());
            detail.setPrice(item.getPrice());
            orderDetailRepository.save(detail);

            BigDecimal itemSubtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemSubtotal);
        }

        // Cập nhật tổng tiền cho Order
        order.setTotalAmount(total);
        orderRepository.save(order);

        // 4. Khởi tạo thông tin Payment
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(paymentMethod);
        payment.setAmount(total);
        payment.setPaymentStatus("COD".equals(paymentMethod) ? "UNPAID" : "PENDING");
        paymentRepository.save(payment);

        // 5. Xóa sạch giỏ hàng sau khi hoàn tất đặt hàng
        cart.getCartItems().clear();

        return mapToResponse(order);
    }

    public List<OrderResponse> getMyOrders(User user) {
        return orderRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Page<OrderResponse> getAllOrders(int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("orderDate").descending()
        );

        return orderRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public OrderResponse getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToResponse(order);
    }

    public OrderResponse updateStatus(Integer id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Tự động cập nhật trạng thái thanh toán thành PAID khi đơn hàng hoàn thành
        if ("COMPLETED".equals(status)) {
            paymentRepository.findByOrder_OrderId(id).ifPresent(payment -> {
                payment.setPaymentStatus("PAID");
                paymentRepository.save(payment);
            });
        }

        order.setStatus(status);
        orderRepository.save(order);

        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {

        Payment payment = paymentRepository
                .findByOrder_OrderId(order.getOrderId())
                .orElse(null);

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .username(order.getUser().getUsername())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())

                // Thông tin thanh toán trả về frontend
                .paymentStatus(
                        payment != null
                                ? payment.getPaymentStatus()
                                : "PENDING"
                )
                .transactionCode(
                        payment != null
                                ? payment.getTransactionCode()
                                : null
                )

                .items(order.getOrderDetails().stream()
                        .map(detail -> OrderItemResponse.builder()
                                .orderDetailId(detail.getOrderDetailId())
                                .bookId(detail.getBook().getBookId())
                                .title(detail.getBook().getTitle())
                                .imageUrl(detail.getBook().getImageUrl())
                                .quantity(detail.getQuantity())
                                .price(detail.getPrice())
                                .subtotal(
                                        detail.getPrice().multiply(
                                                BigDecimal.valueOf(
                                                        detail.getQuantity()
                                                )
                                        )
                                )
                                .build())
                        .toList())
                .build();
    }

    public byte[] exportInvoice(
            Integer id,
            User user
    ) throws Exception {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if (!order.getUser().getUserId()
                .equals(user.getUserId())) {
            throw new RuntimeException("Access denied");
        }

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        Document document =
                new Document();

        PdfWriter.getInstance(document, out);

        document.open();

        BaseFont baseFont =
                BaseFont.createFont(
                        getClass()
                                .getResource("/fonts/arial.ttf")
                                .getPath(),
                        BaseFont.IDENTITY_H,
                        BaseFont.EMBEDDED
                );

        Font titleFont =
                new Font(baseFont, 18, Font.BOLD);

        Font normalFont =
                new Font(baseFont, 12);

        Font boldFont =
                new Font(baseFont, 12, Font.BOLD);

        document.add(
                new Paragraph(
                        "HÓA ĐƠN BÁN SÁCH",
                        titleFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "Mã đơn: #" + order.getOrderId(),
                        boldFont
                )
        );

        document.add(
                new Paragraph(
                        "Ngày đặt: " +
                                order.getOrderDate(),
                        normalFont
                )
        );

        document.add(
                new Paragraph(
                        "Địa chỉ: " +
                                order.getShippingAddress(),
                        normalFont
                )
        );

        document.add(
                new Paragraph(
                        "Thanh toán: " +
                                order.getPaymentMethod(),
                        normalFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "CHI TIẾT ĐƠN HÀNG",
                        boldFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        for (OrderDetail detail : order.getOrderDetails()) {

            document.add(
                    new Paragraph(
                            detail.getBook().getTitle()
                                    + " | SL: "
                                    + detail.getQuantity()
                                    + " | "
                                    + detail.getPrice()
                                    .toPlainString()
                                    + " VNĐ",
                            normalFont
                    )
            );
        }

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "Tổng tiền: "
                                + order.getTotalAmount()
                                + " VNĐ",
                        boldFont
                )
        );

        document.close();

        return out.toByteArray();
    }
}