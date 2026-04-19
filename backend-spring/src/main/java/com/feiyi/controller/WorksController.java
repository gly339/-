package com.feiyi.controller;

import com.feiyi.dto.ApiResponse;
import com.feiyi.entity.Works;
import com.feiyi.service.WorksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/works")
public class WorksController {

    @Autowired
    private WorksService worksService;

    @PostMapping
    public ResponseEntity<ApiResponse> createWork(@RequestBody Works work) {
        try {
            Works saved = worksService.createWork(work);
            return ResponseEntity.ok(ApiResponse.success("创建成功", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("创建失败"));
        }
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ApiResponse> getWorksBySession(@PathVariable String sessionId) {
        List<Works> works = worksService.getWorksBySession(sessionId);
        return ResponseEntity.ok(ApiResponse.success(works));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse> getPopularWorks() {
        List<Works> works = worksService.getPopularWorks();
        return ResponseEntity.ok(ApiResponse.success(works));
    }

    @PostMapping("/{workId}/like/increment")
    public ResponseEntity<ApiResponse> incrementLike(@PathVariable Integer workId) {
        worksService.incrementLikes(workId);
        return ResponseEntity.ok(ApiResponse.success("点赞成功"));
    }

    @PostMapping("/{workId}/like/decrement")
    public ResponseEntity<ApiResponse> decrementLike(@PathVariable Integer workId) {
        worksService.decrementLikes(workId);
        return ResponseEntity.ok(ApiResponse.success("取消点赞"));
    }
}
