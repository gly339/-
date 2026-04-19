package com.feiyi.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "quiz_answer")
public class QuizAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QuizQuestion question;

    @Column(nullable = false, length = 10)
    private String optionLabel;

    @Column(nullable = false, length = 255)
    private String optionText;

    @Column(name = "is_correct")
    private Boolean correct = false;
}
