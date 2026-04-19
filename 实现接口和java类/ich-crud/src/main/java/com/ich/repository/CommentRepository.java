package com.ich.repository;

import com.ich.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByWork_id(Long work_id);
    List<Comment> findByWork_idOrderByCreated_atDesc(Long work_id);
}