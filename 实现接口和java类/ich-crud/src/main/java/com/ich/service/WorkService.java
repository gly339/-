package com.ich.service;

import com.ich.entity.Work;
import com.ich.repository.WorkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkService {

    @Autowired
    private WorkRepository workRepository;

    public List<Work> findAll() {
        return workRepository.findAll();
    }

    public Work findById(Long id) {
        return workRepository.findById(id).orElse(null);
    }

    public List<Work> findByArtifact_id(Long artifact_id) {
        return workRepository.findByArtifact_id(artifact_id);
    }

    public List<Work> findBySession_id(String session_id) {
        return workRepository.findBySession_id(session_id);
    }

    public List<Work> findAllByOrderByLike_countDesc() {
        return workRepository.findAllByOrderByLike_countDesc();
    }

    public List<Work> findAllByOrderByCreated_atDesc() {
        return workRepository.findAllByOrderByCreated_atDesc();
    }

    public Work save(Work work) {
        return workRepository.save(work);
    }

    public void deleteById(Long id) {
        workRepository.deleteById(id);
    }

    public void incrementLikeCount(Long id) {
        Work work = workRepository.findById(id).orElse(null);
        if (work != null) {
            work.setLike_count(work.getLike_count() + 1);
            workRepository.save(work);
        }
    }

    public void decrementLikeCount(Long id) {
        Work work = workRepository.findById(id).orElse(null);
        if (work != null && work.getLike_count() > 0) {
            work.setLike_count(work.getLike_count() - 1);
            workRepository.save(work);
        }
    }

    public void incrementCommentCount(Long id) {
        Work work = workRepository.findById(id).orElse(null);
        if (work != null) {
            work.setComment_count(work.getComment_count() + 1);
            workRepository.save(work);
        }
    }
}package com.ich.service;

import com.ich.entity.Work;
import com.ich.repository.WorkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkService {

    @Autowired
    private WorkRepository workRepository;

    public List<Work> findAll() {
        return workRepository.findAll();
    }

    public Work findById(Long id) {
        return workRepository.findById(id).orElse(null);
    }

    public List<Work> findByArtifact_id(Long artifact_id) {
        return workRepository.findByArtifact_id(artifact_id);
    }

    public List<Work> findBySession_id(String session_id) {
        return workRepository.findBySession_id(session_id);
    }

    public List<Work> findAllByOrderByLike_countDesc() {
        return workRepository.findAllByOrderByLike_countDesc();
    }

    public List<Work> findAllByOrderByCreated_atDesc() {
        return workRepository.findAllByOrderByCreated_atDesc();
    }

    public Work save(Work work) {
        return workRepository.save(work);
    }

    public void deleteById(Long id) {
        workRepository.deleteById(id);
    }

    public void incrementLikeCount(Long id) {
        Work work = workRepository.findById(id).orElse(null);
        if (work != null) {
            work.setLike_count(work.getLike_count() + 1);
            workRepository.save(work);
        }
    }

    public void decrementLikeCount(Long id) {
        Work work = workRepository.findById(id).orElse(null);
        if (work != null && work.getLike_count() > 0) {
            work.setLike_count(work.getLike_count() - 1);
            workRepository.save(work);
        }
    }

    public void incrementCommentCount(Long id) {
        Work work = workRepository.findById(id).orElse(null);
        if (work != null) {
            work.setComment_count(work.getComment_count() + 1);
            workRepository.save(work);
        }
    }
}