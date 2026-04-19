package com.feiyi.controller;

import com.feiyi.dto.ApiResponse;
import com.feiyi.entity.Exhibit;
import com.feiyi.service.ExhibitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exhibits")
public class ExhibitController {

    @Autowired
    private ExhibitService exhibitService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllExhibits(
            @RequestParam(required = false, defaultValue = "all") String category,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit) {
        List<Exhibit> exhibits = exhibitService.getAllExhibits(category, page, limit);
        return ResponseEntity.ok(ApiResponse.success(exhibits));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getExhibitById(@PathVariable Integer id) {
        try {
            Exhibit exhibit = exhibitService.getExhibitById(id);
            return ResponseEntity.ok(ApiResponse.success(exhibit));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createExhibit(@RequestBody Exhibit exhibit) {
        try {
            Exhibit saved = exhibitService.createExhibit(exhibit);
            return ResponseEntity.ok(ApiResponse.success("创建成功", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("创建失败：" + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateExhibit(@PathVariable Integer id, @RequestBody Exhibit exhibit) {
        try {
            Exhibit updated = exhibitService.updateExhibit(id, exhibit);
            return ResponseEntity.ok(ApiResponse.success("更新成功", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteExhibit(@PathVariable Integer id) {
        try {
            exhibitService.deleteExhibit(id);
            return ResponseEntity.ok(ApiResponse.success("删除成功"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
