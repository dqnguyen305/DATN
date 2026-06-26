package com.bookstore.backend.controller;

import com.bookstore.backend.dto.ChangePasswordRequest;
import com.bookstore.backend.dto.UpdateProfileRequest;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // API CHO KHÁCH HÀNG
    // =========================

    @GetMapping("/me")
    public User getMyProfile(
            @AuthenticationPrincipal User currentUser
    ) {
        return userService.getMyProfile(
                currentUser.getUsername()
        );
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody UpdateProfileRequest request
    ) {
        try {
            User updatedUser = userService.updateMyProfile(
                    currentUser.getUsername(),
                    request
            );

            return ResponseEntity.ok(updatedUser);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User currentUser,
            @RequestBody ChangePasswordRequest request
    ) {
        try {
            userService.changePassword(
                    currentUser.getUsername(),
                    request
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Đổi mật khẩu thành công"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

    // =========================
    // API QUẢN TRỊ VIÊN
    // =========================

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Integer id,
            @RequestBody User user
    ) {
        return userService.updateUser(id, user);
    }

    @PutMapping("/{id}/toggle-status")
    public User toggleStatus(@PathVariable Integer id) {
        return userService.toggleStatus(id);
    }
}