package com.bookstore.backend.service;

import com.bookstore.backend.dto.ReviewRequest;
import com.bookstore.backend.dto.ReviewResponse;
import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.Review;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.ReviewRepository;
import com.bookstore.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    private final UserRepository userRepository;

    private final BookRepository bookRepository;

    public void createReview(
            String username,
            ReviewRequest request
    ) {

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow();

        Book book =
                bookRepository
                        .findById(request.getBookId())
                        .orElseThrow();

        Review review =
                new Review();

        review.setUser(user);
        review.setBook(book);
        review.setRating(
                request.getRating()
        );
        review.setCreatedAt(
                LocalDateTime.now()
        );

        reviewRepository.save(review);
    }

    public List<ReviewResponse>
    getBookReviews(
            Integer bookId
    ) {

        return reviewRepository
                .findByBookBookId(bookId)
                .stream()
                .map(review ->
                        ReviewResponse.builder()
                                .reviewId(
                                        review.getReviewId()
                                )
                                .username(
                                        review.getUser()
                                                .getUsername()
                                )
                                .rating(
                                        review.getRating()
                                )
                                .build()
                )
                .toList();
    }

    public Double getAverageRating(
            Integer bookId
    ) {

        Double avg =
                reviewRepository
                        .getAverageRating(bookId);

        return avg == null
                ? 0
                : avg;
    }
}