package com.feiyi.service;

import com.feiyi.entity.Comments;
import com.feiyi.repository.CommentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentsService {

    @Autowired
    private WorksService worksService;

    private final CommentsRepository commentsRepository;

    public CommentsService(CommentsRepository commentsRepository, WorksService worksService) {
        this.commentsRepository = commentsRepository;
        this.worksService = worksService;
    }

    public Comments addComment(Comments comment) {
        var saved = commentsRepository.save(comment);
        incrementCommentCount(saved.getWork().getId());
        return saved;
    }

    private void incrementCommentCount(Integer workId) {
        worksService.incrementCommentCount(workId);
    }

    public List<Comments> getCommentsByWork(Integer workId) {
        return commentsRepository.findByWork_Id(workId);
    }
}
