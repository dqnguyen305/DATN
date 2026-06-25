package com.bookstore.backend.repository;

import com.bookstore.backend.entity.UserBehavior;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface UserBehaviorRepository
        extends JpaRepository<UserBehavior,Integer> {

    boolean existsByUser_UserIdAndBook_BookIdAndActionAndCreatedAtAfter(
            Integer userId,
            Integer bookId,
            String action,
            LocalDateTime time
    );

}