package com.bookstore.backend.service;

import com.bookstore.backend.dto.BookResponse;
import com.bookstore.backend.entity.Book;
import com.bookstore.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final BookRepository bookRepository;

    private final BookService bookService;

    public List<BookResponse> recommend(
            Integer userId
    ) {

        RestTemplate restTemplate =
                new RestTemplate();

        String url =
                "http://localhost:8001/recommend/"
                        + userId;

        List<Integer> bookIds =
                restTemplate.exchange(

                        url,

                        org.springframework.http.HttpMethod.GET,

                        null,

                        new ParameterizedTypeReference<List<Integer>>() {
                        }

                ).getBody();

        if(bookIds == null || bookIds.isEmpty()) {

            return List.of();
        }

        return bookIds.stream()

                .map(bookRepository::findById)

                .filter(java.util.Optional::isPresent)

                .map(java.util.Optional::get)

                .map(this::mapToResponse)

                .toList();
    }

    private BookResponse mapToResponse(
            Book book
    ) {

        return BookResponse.builder()

                .bookId(book.getBookId())
                .title(book.getTitle())
                .description(book.getDescription())
                .price(book.getPrice())
                .stockQuantity(book.getStockQuantity())
                .imageUrl(book.getImageUrl())

                .authorId(
                        book.getAuthor().getAuthorId()
                )

                .authorName(
                        book.getAuthor().getName()
                )

                .categoryId(
                        book.getCategory().getCategoryId()
                )

                .categoryName(
                        book.getCategory().getName()
                )

                .build();
    }
}