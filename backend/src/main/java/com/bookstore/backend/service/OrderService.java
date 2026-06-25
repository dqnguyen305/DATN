package com.bookstore.backend.service;

import com.bookstore.backend.entity.*;
import com.bookstore.backend.repository.CartRepository;
import com.bookstore.backend.repository.OrderDetailRepository;
import com.bookstore.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookstore.backend.dto.OrderItemResponse;
import com.bookstore.backend.dto.OrderResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserBehaviorService behaviorService;

    public OrderResponse checkout(
            User user,
            String shippingAddress
    ) {

        Cart cart = cartRepository
                .findByUser_UserId(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException(
                    "Cart is empty"
            );
        }

        Order order = new Order();

        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setShippingAddress(shippingAddress);

        order = orderRepository.save(order);

        BigDecimal total =
                BigDecimal.ZERO;

        for (CartItem item : cart.getCartItems()) {
            behaviorService.save(
                    user,
                    item.getBook(),
                    "BUY"
            );
            OrderDetail detail =
                    new OrderDetail();

            detail.setOrder(order);
            detail.setBook(item.getBook());
            detail.setQuantity(
                    item.getQuantity()
            );
            detail.setPrice(
                    item.getPrice()
            );

            orderDetailRepository.save(detail);

            total = total.add(
                    item.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            item.getQuantity()
                                    )
                            )
            );
        }

        order.setTotalAmount(total);

        orderRepository.save(order);

        cart.getCartItems().clear();

        return mapToResponse(order);
    }

    public List<OrderResponse> getMyOrders(
            User user
    ) {

        return orderRepository.findByUser(user).stream().map(
                this::mapToResponse
        ).toList();
    }
    private OrderResponse mapToResponse(
            Order order
    ) {

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .userId(
                        order.getUser().getUserId()
                )
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .items(
                        order.getOrderDetails()
                                .stream()
                                .map(detail ->
                                        OrderItemResponse.builder()
                                                .orderDetailId(
                                                        detail.getOrderDetailId()
                                                )
                                                .bookId(
                                                        detail.getBook().getBookId()
                                                )
                                                .title(
                                                        detail.getBook().getTitle()
                                                )
                                                .imageUrl(
                                                        detail.getBook().getImageUrl()
                                                )
                                                .quantity(
                                                        detail.getQuantity()
                                                )
                                                .price(
                                                        detail.getPrice()
                                                )
                                                .subtotal(
                                                        detail.getPrice()
                                                                .multiply(
                                                                        BigDecimal.valueOf(
                                                                                detail.getQuantity()
                                                                        )
                                                                )
                                                )
                                                .build()
                                )
                                .toList()
                )
                .build();
    }
    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    public OrderResponse getOrderById(
            Integer id
    ) {

        Order order = orderRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        return mapToResponse(order);
    }
    public OrderResponse updateStatus(
            Integer id,
            String status
    ) {

        Order order = orderRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        order.setStatus(status);

        orderRepository.save(order);

        return mapToResponse(order);
    }
}