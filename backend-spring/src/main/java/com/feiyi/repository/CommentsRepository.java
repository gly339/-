package com.feiyi.repository;

import com.feiyi.entity.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentsRepository extends JpaRepository<Comments, Integer> {
    List<Comments> findByWork_Id(Integer workId);
}
