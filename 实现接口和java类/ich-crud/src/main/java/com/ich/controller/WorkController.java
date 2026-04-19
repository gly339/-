package com.ich.controller;

import com.ich.entity.Work;
import com.ich.service.WorkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class WorkController {

    @Autowired
    private WorkService workService;

    @GetMapping("/works")
    public ResponseEntity<?> getWorks(
            @RequestParam(required = false) Long artifact_id,
            @RequestParam(required = false) String session_id,
            @RequestParam(required = false, defaultValue = "hot") String sort,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer page_size
    ) {
        List<Work> works;
        if (artifact_id != null) {
            works = workService.findByArtifact_id(artifact_id);
        } else if (session_id != null) {
            works = workService.findBySession_id(session_id);
        } else if ("new".equals(sort)) {
            works = workService.findAllByOrderByCreated_atDesc();
        } else {
            works = workService.findAllByOrderByLike_countDesc();
        }

        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", Map.of(
                        "list", works,
                        "total", works.size(),
                        "page", page,
                        "page_size", page_size
                )
        ));
    }

    @GetMapping("/works/{id}")
    public ResponseEntity<?> getWorkById(@PathVariable Long id) {
        Work work = workService.findById(id);
        if (work == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("code", 404, "message", "作品不存在", "data", null));
        }
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", work));
    }

    @PostMapping("/works")
    public ResponseEntity<?> createWork(@RequestBody Work work, @RequestHeader("X-Session-Id") String session_id) {
        work.setSession_id(session_id);
        Work savedWork = workService.save(work);
        return ResponseEntity.ok(Map.of("code", 200, "message", "作品发布成功", "data", Map.of("id", savedWork.getId())));
    }

    @PostMapping("/works/{id}/like")
    public ResponseEntity<?> likeWork(@PathVariable Long id, @RequestHeader("X-Session-Id") String session_id) {
        Work work = workService.findById(id);
        if (work == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("code", 404, "message", "作品不存在", "data", null));
        }
        workService.incrementLikeCount(id);
        work = workService.findById(id);
        return ResponseEntity.ok(Map.of("code", 200, "message", "点赞成功", "data", Map.of("like_count", work.getLike_count())));
    }

    @PostMapping("/works/{id}/like/cancel")
    public ResponseEntity<?> cancelLikeWork(@PathVariable Long id, @RequestHeader("X-Session-Id") String session_id) {
        Work work = workService.findById(id);
        if (work == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("code", 404, "message", "作品不存在", "data", null));
        }
        workService.decrementLikeCount(id);
        work = workService.findById(id);
        return ResponseEntity.ok(Map.of("code", 200, "message", "已取消点赞", "data", Map.of("like_count", work.getLike_count())));
    }
}