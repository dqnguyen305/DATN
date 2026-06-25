package com.bookstore.backend.repository;

import com.bookstore.backend.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderDetailRepository
        extends JpaRepository<OrderDetail, Integer> {

    @Query("""
        SELECT COUNT(od)
        FROM OrderDetail od
        WHERE od.order.user.userId = :userId
        AND od.book.bookId = :bookId
        AND od.order.status = 'COMPLETED'
    """)
    Long countPurchasedBook(
            Integer userId,
            Integer bookId
    );
}