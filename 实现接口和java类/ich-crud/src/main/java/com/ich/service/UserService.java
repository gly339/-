package com.ich.service;

import com.ich.entity.User;
import com.ich.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(String username, String password) {
        // 检查用户名是否已存在
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            throw new RuntimeException("用户名已存在");
        }

        // 创建新用户
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole("user");

        return userRepository.save(user);
    }

    public User login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (!user.isPresent()) {
            throw new RuntimeException("用户名或密码错误");
        }

        if (!passwordEncoder.matches(password, user.get().getPasswordHash())) {
            throw new RuntimeException("用户名或密码错误");
        }

        return user.get();
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}