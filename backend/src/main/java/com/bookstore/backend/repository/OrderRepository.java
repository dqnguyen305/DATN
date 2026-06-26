package com.bookstore.backend.repository;

import com.bookstore.backend.entity.Order;
import com.bookstore.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository
        extends JpaRepository<Order, Integer> {

    List<Order> findByUser(User user);
    List<Order> findByOrderDateBetween(
            LocalDateTime fromDate,
            LocalDateTime toDate
    );
    List<Order> findByOrderDateBetweenAndStatusIgnoreCase(
            LocalDateTime fromDate,
            LocalDateTime toDate,
            String status
    );
    Page<Order> findAll(Pageable pageable);
    @Query("""
    SELECT o
    FROM Order o
    WHERE o.orderDate BETWEEN :fromDate AND :toDate
    """)
    List<Order> findOrdersForChart(
            LocalDateTime fromDate,
            LocalDateTime toDate
    );
}