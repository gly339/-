package com.ich.repository;

import com.ich.entity.Work;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkRepository extends JpaRepository<Work, Long> {
    List<Work> findByArtifact_id(Long artifact_id);
    List<Work> findBySession_id(String session_id);
    List<Work> findAllByOrderByLike_countDesc();
    List<Work> findAllByOrderByCreated_atDesc();
}package com.ich.repository;

import com.ich.entity.Work;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkRepository extends JpaRepository<Work, Long> {
    List<Work> findByArtifact_id(Long artifact_id);
    List<Work> findBySession_id(String session_id);
    List<Work> findAllByOrderByLike_countDesc();
    List<Work> findAllByOrderByCreated_atDesc();
}