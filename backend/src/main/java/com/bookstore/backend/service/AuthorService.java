package com.bookstore.backend.service;

import com.bookstore.backend.entity.Author;
import com.bookstore.backend.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    // Lấy danh sách tác giả có phân trang
    public Page<Author> getAllAuthors(int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("authorId").ascending()
        );

        return authorRepository.findAll(pageable);
    }

    // Lấy chi tiết một tác giả
    public Author getAuthorById(Integer id) {

        return authorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy tác giả với ID: " + id)
                );
    }

    // Thêm tác giả
    public Author createAuthor(Author author) {

        return authorRepository.save(author);
    }

    // Cập nhật tác giả
    public Author updateAuthor(
            Integer id,
            Author updatedAuthor
    ) {

        Author author = getAuthorById(id);

        author.setName(updatedAuthor.getName());
        author.setBio(updatedAuthor.getBio());

        return authorRepository.save(author);
    }

    // Xóa tác giả
    public void deleteAuthor(Integer id) {

        Author author = getAuthorById(id);

        authorRepository.delete(author);
    }
}