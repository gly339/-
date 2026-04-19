package com.ich.controller;

import com.ich.entity.Asset;
import com.ich.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class AssetController {

    @Autowired
    private AssetService assetService;

    private static final String UPLOAD_DIR = "uploads";

    @PostMapping("/admin/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("file_type") String fileType) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("code", 400, "message", "文件不能为空", "data", null));
        }

        try {
            // 创建上传目录
            String uploadPath = UPLOAD_DIR + File.separator + fileType + File.separator + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 生成文件名
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String fileName = UUID.randomUUID().toString() + extension;
            String filePath = uploadPath + File.separator + fileName;

            // 保存文件
            file.transferTo(new File(filePath));

            // 生成访问URL
            String url = "/" + uploadPath + "/" + fileName;
            String thumbnailUrl = "/" + uploadPath + "/thumb-" + fileName;

            // 保存到数据库
            Asset asset = new Asset();
            asset.setFile_type(fileType);
            asset.setFile_name(originalFilename);
            asset.setFile_size(file.getSize());
            asset.setUrl(url);
            asset.setThumbnail_url(thumbnailUrl);
            Asset savedAsset = assetService.save(asset);

            return ResponseEntity.ok(Map.of(
                    "code", 200,
                    "message", "上传成功",
                    "data", Map.of(
                            "id", savedAsset.getId(),
                            "file_type", savedAsset.getFile_type(),
                            "file_name", savedAsset.getFile_name(),
                            "file_size", savedAsset.getFile_size(),
                            "url", savedAsset.getUrl(),
                            "thumbnail_url", savedAsset.getThumbnail_url()
                    )
            ));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("code", 500, "message", "上传失败", "data", null));
        }
    }

    @GetMapping("/admin/assets")
    public ResponseEntity<?> getAssets(
            @RequestParam(required = false) String file_type,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer page_size
    ) {
        List<Asset> assets;
        if (file_type != null) {
            assets = assetService.findByFile_type(file_type);
        } else {
            assets = assetService.findAllByOrderByCreated_atDesc();
        }

        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", Map.of(
                        "list", assets,
                        "total", assets.size(),
                        "page", page,
                        "page_size", page_size
                )
        ));
    }

    @DeleteMapping("/admin/assets/{id}")
    public ResponseEntity<?> deleteAsset(@PathVariable Long id) {
        Asset asset = assetService.findById(id);
        if (asset == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("code", 404, "message", "素材不存在", "data", null));
        }

        // 删除文件
        File file = new File(UPLOAD_DIR + asset.getUrl());
        if (file.exists()) {
            file.delete();
        }

        // 删除缩略图
        if (asset.getThumbnail_url() != null) {
            File thumbnailFile = new File(UPLOAD_DIR + asset.getThumbnail_url());
            if (thumbnailFile.exists()) {
                thumbnailFile.delete();
            }
        }

        // 从数据库删除
        assetService.deleteById(id);

        return ResponseEntity.ok(Map.of("code", 200, "message", "删除成功", "data", null));
    }
}