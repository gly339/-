package com.feiyi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequest {
    @NotNull(message = "作品ID不能为空")
    private Integer workId;

    @NotBlank(message = "会话ID不能为空")
    private String sessionId;

    @NotBlank(message = "评论内容不能为空")
    private String content;
}