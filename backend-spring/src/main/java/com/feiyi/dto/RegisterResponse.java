package com.feiyi.dto;

import lombok.Data;

@Data
public class RegisterResponse {
    private Integer userId;
    private String username;
    private String message;
}
