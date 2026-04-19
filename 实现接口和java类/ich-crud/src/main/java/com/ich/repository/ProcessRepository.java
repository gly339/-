package com.ich.repository;

import com.ich.entity.Process;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProcessRepository extends JpaRepository<Process, Long> {
    List<Process> findByCategoryIdOrderByStepOrderAsc(Long categoryId);
    List<Process> findByExhibitIdOrderByStepOrderAsc(Long exhibitId);
}
