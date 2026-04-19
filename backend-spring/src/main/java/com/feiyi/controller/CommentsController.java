package com.feiyi.controller;

import com.feiyi.dto.ApiResponse;
import com.feiyi.entity.Comments;
import com.feiyi.service.CommentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentsController {

    @Autowired
    private CommentsService commentsService;

    @PostMapping
    public ResponseEntity<ApiResponse> addComment(@RequestBody Map<String, Object> request) {
        try {
            Comments comment = new Comments();
            comment.setSessionId((String) request.get("sessionId"));
            comment.setContent((String) request.get("content"));

            Integer workId = (Integer) request.get("workId");
            // TODO: 根据 workId 获取作品并设置到评论中

            Comments saved = commentsService.addComment(comment);
            return ResponseEntity.ok(ApiResponse.success("评论成功", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("评论失败：" + e.getMessage()));
        }
    }

    @GetMapping("/work/{workId}")
    public ResponseEntity<ApiResponse> getComments(@PathVariable Integer workId) {
        List<Comments> comments = commentsService.getCommentsByWork(workId);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }
}
