package com.feiyi.controller;

import com.feiyi.dto.ApiResponse;
import com.feiyi.dto.CommentRequest;
import com.feiyi.entity.Comments;
import com.feiyi.entity.Works;
import com.feiyi.service.CommentsService;
import com.feiyi.service.WorksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentsController {

    @Autowired
    private CommentsService commentsService;

    @Autowired
    private WorksService worksService;

    @PostMapping
    public ResponseEntity<ApiResponse> addComment(@Valid @RequestBody CommentRequest request) {
        try {
            // 验证作品是否存在
            Works work = worksService.getWorkById(request.getWorkId());
            if (work == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("作品不存在"));
            }

            Comments comment = new Comments();
            comment.setWork(work);
            comment.setSessionId(request.getSessionId());
            comment.setContent(request.getContent());

            Comments saved = commentsService.addComment(comment);

            // 增加作品评论数
            worksService.incrementCommentCount(request.getWorkId());

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
