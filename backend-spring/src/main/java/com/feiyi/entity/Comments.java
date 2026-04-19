package com.feiyi.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "comments")
public class Comments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_id", nullable = false)
    private Works work;

    @Column(name = "session_id", length = 255)
    private String sessionId;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
}
