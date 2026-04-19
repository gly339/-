package com.ich.controller;

import com.ich.entity.Comment;
import com.ich.service.CommentService;
import com.ich.service.WorkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private WorkService workService;

    @GetMapping("/works/{id}/comments")
    public ResponseEntity<?> getCommentsByWorkId(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer page_size
    ) {
        List<Comment> comments = commentService.findByWork_idOrderByCreated_atDesc(id);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", Map.of(
                        "list", comments,
                        "total", comments.size(),
                        "page", page,
                        "page_size", page_size
                )
        ));
    }

    @PostMapping("/works/{id}/comments")
    public ResponseEntity<?> createComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @RequestHeader("X-Session-Id") String session_id
    ) {
        String content = request.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("code", 400, "message", "评论内容不能为空", "data", null));
        }
        if (content.length() > 500) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("code", 400, "message", "评论内容不能超过500字符", "data", null));
        }

        Comment comment = new Comment();
        comment.setWork_id(id);
        comment.setSession_id(session_id);
        comment.setContent(content);

        Comment savedComment = commentService.save(comment);
        workService.incrementCommentCount(id);

        return ResponseEntity.ok(Map.of("code", 200, "message", "评论发表成功", "data", Map.of("id", savedComment.getId())));
    }
}