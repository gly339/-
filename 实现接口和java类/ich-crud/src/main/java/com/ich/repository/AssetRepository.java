package com.ich.repository;

import com.ich.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByFile_type(String file_type);
    List<Asset> findAllByOrderByCreated_atDesc();
}