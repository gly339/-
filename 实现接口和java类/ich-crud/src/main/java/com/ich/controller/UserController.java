package com.ich.controller;

import com.ich.entity.User;
import com.ich.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            if (username == null || password == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("code", 400);
                response.put("message", "用户名和密码不能为空");
                response.put("data", null);
                return ResponseEntity.badRequest().body(response);
            }

            User user = userService.register(username, password);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "注册成功");
            response.put("data", Map.of(
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "role", user.getRole()
                )
            ));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 400);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            if (username == null || password == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("code", 400);
                response.put("message", "用户名和密码不能为空");
                response.put("data", null);
                return ResponseEntity.badRequest().body(response);
            }

            User user = userService.login(username, password);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "登录成功");
            response.put("data", Map.of(
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "role", user.getRole()
                )
            ));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 400);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.badRequest().body(response);
        }
    }
}