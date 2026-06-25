package com.bookstore.backend.controller;

import com.bookstore.backend.dto.BookRequest;
import com.bookstore.backend.dto.BookResponse;
import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public Page<BookResponse> getAllBooks(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "8")
            int size,

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            Integer categoryId,

            @RequestParam(required = false)
            Integer authorId,

            @RequestParam(defaultValue = "latest")
            String sort
    ) {

        return bookService.getAllBooks(
                page,
                size,
                keyword,
                categoryId,
                authorId,
                sort
        );
    }

    @GetMapping("/{id}")
    public BookResponse getBookById(
            @PathVariable Integer id,
            Authentication authentication
    ) {

        User user = null;

        if(authentication != null) {

            user =
                    (User) authentication.getPrincipal();
        }

        return bookService.getBookById(
                id,
                user
        );
    }

    @PostMapping
    public Book createBook(
            @Valid @RequestBody BookRequest request
    ) {

        return bookService.createBook(request);
    }

    @PutMapping("/{id}")
    public Book updateBook(

            @PathVariable Integer id,

            @Valid @RequestBody BookRequest request
    ) {

        return bookService.updateBook(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteBook(
            @PathVariable Integer id
    ) {

        bookService.deleteBook(id);

        return "Delete book successfully";
    }
    @GetMapping("/export")
    public List<BookResponse> exportBooks() {

        return bookService.exportBooks();

    }
}