package com.bookstore.backend.service;

import com.bookstore.backend.dto.BookRequest;
import com.bookstore.backend.dto.BookResponse;
import com.bookstore.backend.entity.Author;
import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.Category;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.repository.AuthorRepository;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final UserBehaviorService behaviorService;

    public Page<BookResponse> getAllBooks(

            int page,
            int size,

            String keyword,

            Integer categoryId,

            Integer authorId,

            String sort
    ) {

        Sort sorting =
                Sort.by("bookId").descending();

        if ("price_asc".equals(sort)) {

            sorting =
                    Sort.by("price").ascending();
        }

        if ("price_desc".equals(sort)) {

            sorting =
                    Sort.by("price").descending();
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        sorting
                );

        Page<Book> books =
                bookRepository.searchBooks(
                        keyword,
                        categoryId,
                        authorId,
                        pageable
                );

        return books.map(this::mapToResponse);
    }

    public BookResponse getBookById(Integer id, User user) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Book not found"));
        if(user != null){

            behaviorService.save(
                    user,
                    book,
                    "VIEW"
            );

        }
        return mapToResponse(book);
    }

    public Book createBook(BookRequest request) {

        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() ->
                        new RuntimeException("Author not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        Book book = Book.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .author(author)
                .category(category)
                .build();

        return bookRepository.save(book);
    }

    public Book updateBook(Integer id, BookRequest request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Book not found"));

        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() ->
                        new RuntimeException("Author not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        book.setTitle(request.getTitle());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setStockQuantity(request.getStockQuantity());
        book.setImageUrl(request.getImageUrl());
        book.setAuthor(author);
        book.setCategory(category);

        return bookRepository.save(book);
    }

    public void deleteBook(Integer id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Book not found"));

        bookRepository.delete(book);
    }

    private BookResponse mapToResponse(Book book) {

        return BookResponse.builder()
                .bookId(book.getBookId())
                .title(book.getTitle())
                .description(book.getDescription())
                .price(book.getPrice())
                .stockQuantity(book.getStockQuantity())
                .imageUrl(book.getImageUrl())

                .authorId(book.getAuthor().getAuthorId())
                .authorName(book.getAuthor().getName())

                .categoryId(book.getCategory().getCategoryId())
                .categoryName(book.getCategory().getName())

                .build();
    }
    public List<BookResponse> exportBooks() {

        return bookRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();

    }
}