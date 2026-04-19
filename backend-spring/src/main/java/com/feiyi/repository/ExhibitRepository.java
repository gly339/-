package com.feiyi.repository;

import com.feiyi.entity.Exhibit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExhibitRepository extends JpaRepository<Exhibit, Integer> {
    List<Exhibit> findByCategory_Id(Integer categoryId);

    List<Exhibit> findByPublishedTrueOrderByCreatedAtDesc();

    List<Exhibit> findByPublishedTrueAndCategory_Id(Integer categoryId);
}
