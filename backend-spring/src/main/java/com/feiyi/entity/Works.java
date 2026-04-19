package com.feiyi.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "works")
public class Works {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artifact_id")
    private Exhibit artifact;

    @Column(name = "session_id", nullable = false, length = 255)
    private String sessionId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "preview_url", nullable = false, length = 255)
    private String previewUrl;

    @Column(name = "like_count")
    private Integer likeCount = 0;

    @Column(name = "comment_count")
    private Integer commentCount = 0;
}
