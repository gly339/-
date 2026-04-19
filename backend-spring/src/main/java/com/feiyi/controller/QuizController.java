package com.feiyi.controller;

import com.feiyi.dto.ApiResponse;
import com.feiyi.entity.QuizAnswer;
import com.feiyi.entity.QuizQuestion;
import com.feiyi.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse> getQuestions() {
        List<QuizQuestion> questions = quizService.getQuestions();
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse> getQuestionsByCategory(@PathVariable String category) {
        List<QuizQuestion> questions = quizService.getQuestionsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    @GetMapping("/question/{questionId}/answers")
    public ResponseEntity<ApiResponse> getAnswers(@PathVariable Integer questionId) {
        List<QuizAnswer> answers = quizService.getAnswersForQuestion(questionId);
        return ResponseEntity.ok(ApiResponse.success(answers));
    }

    @PostMapping("/check")
    public ResponseEntity<ApiResponse> checkAnswer(@RequestBody Map<String, Integer> request) {
        Integer questionId = request.get("questionId");
        Integer answerId = request.get("answerId");
        boolean correct = quizService.checkAnswer(questionId, answerId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("correct", correct)));
    }
}
