package com.bookstore.backend.repository;

import com.bookstore.backend.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    @Query("SELECT b FROM Book b WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:categoryId IS NULL OR b.category.categoryId = :categoryId) " +
            "AND (:authorId IS NULL OR b.author.authorId = :authorId)")
    Page<Book> searchBooks(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
            @Param("authorId") Integer authorId,
            Pageable pageable
    );
}