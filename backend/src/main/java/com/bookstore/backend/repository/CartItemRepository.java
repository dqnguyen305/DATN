package com.bookstore.backend.repository;

import com.bookstore.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Integer> {

    Optional<CartItem> findByCart_CartIdAndBook_BookId(
            Integer cartId,
            Integer bookId
    );
}