package com.bookstore.backend.service;

import com.bookstore.backend.dto.ChangePasswordRequest;
import com.bookstore.backend.dto.UpdateProfileRequest;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Integer id) {
        return userRepository
                .findById(id)
                .orElseThrow();
    }

    public User updateUser(
            Integer id,
            User updatedUser
    ) {
        User user = userRepository
                .findById(id)
                .orElseThrow();

        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        user.setRole(updatedUser.getRole());

        return userRepository.save(user);
    }

    public User toggleStatus(Integer id) {
        User user = userRepository
                .findById(id)
                .orElseThrow();

        if (user.getStatus().equals("ACTIVE")) {
            user.setStatus("BLOCKED");
        } else {
            user.setStatus("ACTIVE");
        }

        return userRepository.save(user);
    }

    // Lấy thông tin tài khoản đang đăng nhập
    public User getMyProfile(String username) {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy tài khoản")
                );
    }

    // Cập nhật thông tin cá nhân
    public User updateMyProfile(
            String username,
            UpdateProfileRequest request
    ) {
        User user = getMyProfile(username);

        if (request.getFullName() == null ||
                request.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Họ tên không được để trống");
        }

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email không được để trống");
        }

        String email = request.getEmail().trim().toLowerCase();

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Email không đúng định dạng");
        }

        boolean emailUsedByAnotherUser =
                userRepository.existsByEmailAndUserIdNot(
                        email,
                        user.getUserId()
                );

        if (emailUsedByAnotherUser) {
            throw new RuntimeException(
                    "Email này đã được sử dụng bởi tài khoản khác"
            );
        }

        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(
                request.getPhone() == null
                        ? null
                        : request.getPhone().trim()
        );
        user.setAddress(
                request.getAddress() == null
                        ? null
                        : request.getAddress().trim()
        );

        return userRepository.save(user);
    }

    // Đổi mật khẩu
    public void changePassword(
            String username,
            ChangePasswordRequest request
    ) {
        User user = getMyProfile(username);

        if (request.getCurrentPassword() == null ||
                request.getNewPassword() == null ||
                request.getConfirmPassword() == null) {
            throw new RuntimeException("Vui lòng nhập đầy đủ thông tin");
        }

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException("Mật khẩu hiện tại không chính xác");
        }

        if (request.getNewPassword().length() < 6) {
            throw new RuntimeException(
                    "Mật khẩu mới phải có ít nhất 6 ký tự"
            );
        }

        if (!request.getNewPassword().equals(
                request.getConfirmPassword()
        )) {
            throw new RuntimeException(
                    "Xác nhận mật khẩu mới không khớp"
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "Mật khẩu mới không được trùng mật khẩu hiện tại"
            );
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);
    }
}