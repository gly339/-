package com.ich.service;

import com.ich.entity.Comment;
import com.ich.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    public Comment findById(Long id) {
        return commentRepository.findById(id).orElse(null);
    }

    public List<Comment> findByWork_id(Long work_id) {
        return commentRepository.findByWork_id(work_id);
    }

    public List<Comment> findByWork_idOrderByCreated_atDesc(Long work_id) {
        return commentRepository.findByWork_idOrderByCreated_atDesc(work_id);
    }

    public Comment save(Comment comment) {
        return commentRepository.save(comment);
    }

    public void deleteById(Long id) {
        commentRepository.deleteById(id);
    }
}