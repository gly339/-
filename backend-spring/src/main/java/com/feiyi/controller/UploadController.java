package com.feiyi.controller;

import com.feiyi.dto.ApiResponse;
import com.feiyi.entity.Assets;
import com.feiyi.repository.AssetsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Autowired
    private AssetsRepository assetsRepository;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads";

    @PostMapping("/{type}")
    public ResponseEntity<ApiResponse> uploadFile(
            @PathVariable String type,
            @RequestParam("file") MultipartFile file) throws IOException {

        try {
            File uploadDirObj = new File(UPLOAD_DIR);
            if (!uploadDirObj.exists()) {
                uploadDirObj.mkdirs();
            }

            String fileExt = getFileExtension(file.getOriginalFilename());
            String newFileName = UUID.randomUUID().toString() + "." + fileExt;
            Path destination = Paths.get(UPLOAD_DIR, type, newFileName);

            Files.createDirectories(destination.getParent());
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String url = "/uploads/" + type + "/" + newFileName;

            // 保存资产记录
            Assets asset = new Assets();
            asset.setFileType(type);
            asset.setFileName(file.getOriginalFilename());
            asset.setFileSize(file.getSize());
            asset.setUrl(url);
            assetsRepository.save(asset);

            return ResponseEntity.ok(ApiResponse.success("上传成功", Map.of("url", url)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("上传失败：" + e.getMessage()));
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "bin";
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    @GetMapping(value = "/{type}/{filename}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Resource> downloadFile(@PathVariable String type, @PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR, type, filename);
            Resource resource = new org.springframework.core.io.FileSystemResource(filePath.toFile());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
