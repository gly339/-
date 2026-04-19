package com.feiyi.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private Integer userId;
    private String username;
    private String message;
}

