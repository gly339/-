package com.feiyi.service;

import com.feiyi.entity.QuizAnswer;
import com.feiyi.entity.QuizQuestion;
import com.feiyi.repository.QuizAnswerRepository;
import com.feiyi.repository.QuizQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizQuestionRepository questionRepository;

    @Autowired
    private QuizAnswerRepository answerRepository;

    public List<QuizQuestion> getQuestions() {
        return questionRepository.findByOrderBySortOrderAsc();
    }

    public List<QuizQuestion> getQuestionsByCategory(String category) {
        return questionRepository.findByCategory(category);
    }

    public List<QuizAnswer> getAnswersForQuestion(Integer questionId) {
        return answerRepository.findByQuestion_Id(questionId);
    }

    public boolean checkAnswer(Integer questionId, Integer answerId) {
        var answer = answerRepository.findById(answerId);
        return answer.isPresent() && answer.get().getCorrect();
    }
}
