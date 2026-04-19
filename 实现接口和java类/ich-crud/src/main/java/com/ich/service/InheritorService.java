package com.ich.service;

import com.ich.entity.Inheritor;
import com.ich.repository.InheritorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InheritorService {

    private final InheritorRepository repository;

    public InheritorService(InheritorRepository repository) {
        this.repository = repository;
    }

    public List<Inheritor> findAll() {
        return repository.findAll();
    }

    public Optional<Inheritor> findById(Long id) {
        return repository.findById(id);
    }

    public List<Inheritor> findByCategoryId(Long categoryId) {
        return repository.findByCategoryId(categoryId);
    }

    public Inheritor save(Inheritor inheritor) {
        return repository.save(inheritor);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
