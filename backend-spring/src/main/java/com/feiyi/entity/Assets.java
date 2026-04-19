package com.feiyi.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "assets")
public class Assets {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String fileType;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(nullable = false, length = 255)
    private String url;

    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;
}
