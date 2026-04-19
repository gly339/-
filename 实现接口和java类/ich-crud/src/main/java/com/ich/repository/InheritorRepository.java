package com.ich.repository;

import com.ich.entity.Inheritor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InheritorRepository extends JpaRepository<Inheritor, Long> {
    List<Inheritor> findByCategoryId(Long categoryId);
}
