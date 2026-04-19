package com.feiyi.repository;

import com.feiyi.entity.QuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, Integer> {
    List<QuizAnswer> findByQuestion_Id(Integer questionId);
}
