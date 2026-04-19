package com.ich.repository;

import com.ich.entity.Exhibit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExhibitRepository extends JpaRepository<Exhibit, Long> {
    List<Exhibit> findByCategoryId(Long categoryId);
}
