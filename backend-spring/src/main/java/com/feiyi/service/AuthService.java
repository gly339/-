package com.feiyi.service;

import com.feiyi.dto.LoginRequest;
import com.feiyi.dto.LoginResponse;
import com.feiyi.dto.RegisterRequest;
import com.feiyi.dto.RegisterResponse;
import com.feiyi.entity.User;
import com.feiyi.repository.UserRepository;
import com.feiyi.util.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // 用户登录
    public LoginResponse login(LoginRequest request) {
        var user = userRepository.findByUsername(request.getUsername());

        if (user.isEmpty()) {
            throw new RuntimeException("用户名或密码错误");
        }

        if (!BCrypt.checkpw(request.getPassword(), user.get().getPasswordHash())) {
            throw new RuntimeException("用户名或密码错误");
        }

        if (!user.get().getActive()) {
            throw new RuntimeException("账号已被禁用");
        }

        String token = jwtUtil.generateToken(user.get().getUsername());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(user.get().getId());
        response.setUsername(user.get().getUsername());
        response.setMessage("登录成功");

        return response;
    }

    // 用户注册
    public RegisterResponse register(RegisterRequest request) {
        // 检查用户名是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }

        // 检查邮箱格式
        if (request.getEmail() != null && !isValidEmail(request.getEmail())) {
            throw new RuntimeException("邮箱格式不正确");
        }

        // 检查邮箱是否已存在
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("邮箱已被使用");
        }

        // 检查手机号格式
        if (request.getPhone() != null && !isValidPhone(request.getPhone())) {
            throw new RuntimeException("手机号格式不正确");
        }

        // 检查手机号是否已存在
        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("手机号已被注册");
        }

        // 创建新用户
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPasswordHash(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        newUser.setEmail(request.getEmail());
        newUser.setPhone(request.getPhone());
        newUser.setActive(true);

        User savedUser = userRepository.save(newUser);

        RegisterResponse response = new RegisterResponse();
        response.setUserId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setMessage("注册成功");

        return response;
    }

    // 校验邮箱格式
    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }

    // 校验手机号格式（支持中国大陆手机号）
    private boolean isValidPhone(String phone) {
        return phone.matches("^1[3-9]\\d{9}$");
    }
}
