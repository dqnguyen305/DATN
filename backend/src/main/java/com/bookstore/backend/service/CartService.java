package com.bookstore.backend.service;

import com.bookstore.backend.dto.CartItemResponse;
import com.bookstore.backend.dto.CartResponse;
import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.Cart;
import com.bookstore.backend.entity.CartItem;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CartItemRepository;
import com.bookstore.backend.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserBehaviorService behaviorService;

    public CartResponse getCart(User user) {

        Cart cart = cartRepository
                .findByUser_UserId(user.getUserId())
                .orElseGet(() -> {

                    Cart newCart = Cart.builder()
                            .user(user)
                            .build();

                    return cartRepository.save(newCart);

                });
        List<CartItemResponse> items =
                cart.getCartItems()
                        .stream()
                        .map(this::mapToItemResponse)
                        .toList();

        BigDecimal total =
                items.stream()
                        .map(CartItemResponse::getSubtotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems =
                items.stream()
                        .mapToInt(CartItemResponse::getQuantity)
                        .sum();

        return CartResponse.builder()
                .cartId(cart.getCartId())
                .items(items)
                .totalItems(totalItems)
                .totalAmount(total)
                .build();
    }

    public void addToCart(
            User user,
            Integer bookId,
            Integer quantity
    ) {

        Cart cart = cartRepository
                .findByUser_UserId(user.getUserId())
                .orElseGet(() -> {

                    Cart newCart = Cart.builder()
                            .user(user)
                            .build();

                    return cartRepository.save(newCart);

                });

        Book book = bookRepository
                .findById(bookId)
                .orElseThrow(() ->
                        new RuntimeException("Book not found"));
        behaviorService.save(
                user,
                book,
                "CART"
        );
        CartItem item = cartItemRepository
                .findByCart_CartIdAndBook_BookId(
                        cart.getCartId(),
                        bookId
                )
                .orElse(null);

        if (item != null) {

            item.setQuantity(
                    item.getQuantity() + quantity
            );

        } else {

            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .book(book)
                    .quantity(quantity)
                    .price(book.getPrice())
                    .build();

            cartItemRepository.save(newItem);
        }
    }

    public void updateQuantity(
            Integer cartItemId,
            Integer quantity
    ) {

        CartItem item =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException("Item not found"));

        if (quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }

        item.setQuantity(quantity);
    }

    public void removeItem(Integer cartItemId) {

        CartItem item =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException("Item not found"));

        cartItemRepository.delete(item);
    }

    public void clearCart(User user) {

        Cart cart = cartRepository
                .findByUser_UserId(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        cart.getCartItems().clear();
    }

    private CartItemResponse mapToItemResponse(
            CartItem item
    ) {

        return CartItemResponse.builder()
                .cartItemId(item.getCartItemId())
                .bookId(item.getBook().getBookId())
                .title(item.getBook().getTitle())
                .imageUrl(item.getBook().getImageUrl())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(
                        item.getPrice().multiply(
                                BigDecimal.valueOf(
                                        item.getQuantity()
                                )
                        )
                )
                .build();
    }
}