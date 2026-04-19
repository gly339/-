package com.feiyi.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "inheritor")
public class Inheritor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 100)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 255)
    private String avatarUrl;
}
