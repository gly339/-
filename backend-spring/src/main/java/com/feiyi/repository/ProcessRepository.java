package com.feiyi.repository;

import com.feiyi.entity.Process;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProcessRepository extends JpaRepository<Process, Integer> {
    List<Process> findByExhibit_Id(Integer exhibitId);
    List<Process> findByCategory_IdOrderByStepOrderAsc(Integer categoryId);
}
