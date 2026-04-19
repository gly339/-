package com.feiyi.repository;

import com.feiyi.entity.Works;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorksRepository extends JpaRepository<Works, Integer> {
    List<Works> findByArtifact_Id(Integer artifactId);
    List<Works> findBySessionId(String sessionId);
    List<Works> findByOrderByLikeCountDesc();
}
