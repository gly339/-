package com.feiyi.dto;

import lombok.Data;

@Data
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;

    public static <T> ApiResponse success(T data) {
        ApiResponse resp = new ApiResponse();
        resp.setSuccess(true);
        resp.setData(data);
        return resp;
    }

    public static <T> ApiResponse success(String message, T data) {
        ApiResponse resp = new ApiResponse();
        resp.setSuccess(true);
        resp.setMessage(message);
        resp.setData(data);
        return resp;
    }

    public static ApiResponse error(String message) {
        ApiResponse resp = new ApiResponse();
        resp.setSuccess(false);
        resp.setMessage(message);
        return resp;
    }
}
