package com.bookstore.backend.repository;

import com.bookstore.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository
        extends JpaRepository<Review,Integer> {

    List<Review> findByBookBookId(
            Integer bookId
    );

    @Query("""
            SELECT AVG(r.rating)
            FROM Review r
            WHERE r.book.bookId = :bookId
            """)
    Double getAverageRating(
            Integer bookId
    );
}