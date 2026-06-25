package com.bookstore.backend.controller;

import com.bookstore.backend.dto.CartResponse;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.bookstore.backend.dto.AddToCartRequest;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                cartService.getCart(user)
        );
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody AddToCartRequest request,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        cartService.addToCart(
                user,
                request.getBookId(),
                request.getQuantity()
        );

        return ResponseEntity.ok("Added to cart");
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Integer cartItemId,
            @RequestParam Integer quantity
    ) {

        cartService.updateQuantity(
                cartItemId,
                quantity
        );

        return ResponseEntity.ok(
                "Cart updated"
        );
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<?> removeItem(
            @PathVariable Integer cartItemId
    ) {

        cartService.removeItem(cartItemId);

        return ResponseEntity.ok(
                "Item removed"
        );
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        cartService.clearCart(user);

        return ResponseEntity.ok(
                "Cart cleared"
        );
    }
}