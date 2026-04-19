package com.ich.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "works")
public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "artifact_id")
    private Long artifact_id;

    @Column(name = "session_id", nullable = false, length = 255)
    private String session_id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "preview_url", nullable = false, length = 255)
    private String preview_url;

    @Column(name = "like_count", columnDefinition = "INT DEFAULT 0")
    private Integer like_count = 0;

    @Column(name = "comment_count", columnDefinition = "INT DEFAULT 0")
    private Integer comment_count = 0;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date created_at;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getArtifact_id() {
        return artifact_id;
    }

    public void setArtifact_id(Long artifact_id) {
        this.artifact_id = artifact_id;
    }

    public String getSession_id() {
        return session_id;
    }

    public void setSession_id(String session_id) {
        this.session_id = session_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPreview_url() {
        return preview_url;
    }

    public void setPreview_url(String preview_url) {
        this.preview_url = preview_url;
    }

    public Integer getLike_count() {
        return like_count;
    }

    public void setLike_count(Integer like_count) {
        this.like_count = like_count;
    }

    public Integer getComment_count() {
        return comment_count;
    }

    public void setComment_count(Integer comment_count) {
        this.comment_count = comment_count;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }
}