package com.feiyi.repository;

import com.feiyi.entity.Inheritor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InheritorRepository extends JpaRepository<Inheritor, Integer> {
    List<Inheritor> findByCategory_Id(Integer categoryId);
}
