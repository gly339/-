package com.feiyi.service;

import com.feiyi.entity.Works;
import com.feiyi.repository.WorksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorksService {

    @Autowired
    private WorksRepository worksRepository;

    public Works createWork(Works work) {
        work.setLikeCount(0);
        work.setCommentCount(0);
        return worksRepository.save(work);
    }

    public List<Works> getWorksBySession(String sessionId) {
        return worksRepository.findBySessionId(sessionId);
    }

    public List<Works> getPopularWorks() {
        return worksRepository.findByOrderByLikeCountDesc();
    }

    public void incrementLikes(Integer workId) {
        var work = worksRepository.findById(workId);
        if (work.isPresent()) {
            work.get().setLikeCount(work.get().getLikeCount() + 1);
            worksRepository.save(work.get());
        }
    }

    public void decrementLikes(Integer workId) {
        var work = worksRepository.findById(workId);
        if (work.isPresent() && work.get().getLikeCount() > 0) {
            work.get().setLikeCount(work.get().getLikeCount() - 1);
            worksRepository.save(work.get());
        }
    }

    public void incrementCommentCount(Integer workId) {
        var work = worksRepository.findById(workId);
        if (work.isPresent()) {
            work.get().setCommentCount(work.get().getCommentCount() + 1);
            worksRepository.save(work.get());
        }
    }
}
