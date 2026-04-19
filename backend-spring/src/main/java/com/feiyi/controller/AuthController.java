package com.feiyi.controller;

import com.feiyi.dto.ApiResponse;
import com.feiyi.dto.LoginRequest;
import com.feiyi.dto.LoginResponse;
import com.feiyi.dto.RegisterRequest;
import com.feiyi.dto.RegisterResponse;
import com.feiyi.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // 用户登录
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("登录成功", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // 用户注册
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        try {
            RegisterResponse response = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success("注册成功", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // 验证 Token
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse> verify() {
        return ResponseEntity.ok(ApiResponse.success("Token valid"));
    }
}
