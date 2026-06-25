package com.bookstore.backend.service;

import com.bookstore.backend.dto.UserBehaviorDto;
import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.entity.UserBehavior;
import com.bookstore.backend.repository.UserBehaviorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserBehaviorService {

    private final UserBehaviorRepository repository;

    public void save(
            User user,
            Book book,
            String action
    ) {

        if(action.equals("VIEW")) {

            boolean existed =
                    repository.existsByUser_UserIdAndBook_BookIdAndActionAndCreatedAtAfter(
                            user.getUserId(),
                            book.getBookId(),
                            "VIEW",
                            LocalDateTime.now().minusMinutes(5)
                    );

            if(existed) {
                return;
            }
        }

        UserBehavior behavior =
                new UserBehavior();

        behavior.setUser(user);
        behavior.setBook(book);
        behavior.setAction(action);
        behavior.setCreatedAt(
                LocalDateTime.now()
        );

        repository.save(behavior);
    }

    public List<UserBehaviorDto> export() {

        return repository.findAll()
                .stream()
                .map(b ->
                        new UserBehaviorDto(
                                b.getUser().getUserId(),
                                b.getBook().getBookId(),
                                b.getAction()
                        )
                )
                .toList();
    }
}