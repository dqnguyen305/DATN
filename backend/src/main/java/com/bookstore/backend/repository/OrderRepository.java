package com.bookstore.backend.repository;

import com.bookstore.backend.entity.Order;
import com.bookstore.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository
        extends JpaRepository<Order, Integer> {

    List<Order> findByUser(User user);
}