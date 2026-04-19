package com.feiyi.repository;

import com.feiyi.entity.Assets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssetsRepository extends JpaRepository<Assets, Integer> {
    List<Assets> findByFileType(String fileType);
}
