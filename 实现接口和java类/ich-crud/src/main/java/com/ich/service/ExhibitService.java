package com.ich.service;

import com.ich.entity.Exhibit;
import com.ich.repository.ExhibitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExhibitService {

    private final ExhibitRepository repository;

    public ExhibitService(ExhibitRepository repository) {
        this.repository = repository;
    }

    public List<Exhibit> findAll() {
        return repository.findAll();
    }

    public Optional<Exhibit> findById(Long id) {
        return repository.findById(id);
    }

    public List<Exhibit> findByCategoryId(Long categoryId) {
        return repository.findByCategoryId(categoryId);
    }

    public Exhibit save(Exhibit exhibit) {
        return repository.save(exhibit);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
