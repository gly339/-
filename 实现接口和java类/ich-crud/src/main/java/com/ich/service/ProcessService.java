package com.ich.service;

import com.ich.entity.Process;
import com.ich.repository.ProcessRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProcessService {

    private final ProcessRepository repository;

    public ProcessService(ProcessRepository repository) {
        this.repository = repository;
    }

    public List<Process> findAll() {
        return repository.findAll();
    }

    public Optional<Process> findById(Long id) {
        return repository.findById(id);
    }

    public List<Process> findByCategoryId(Long categoryId) {
        return repository.findByCategoryIdOrderByStepOrderAsc(categoryId);
    }

    public List<Process> findByExhibitId(Long exhibitId) {
        return repository.findByExhibitIdOrderByStepOrderAsc(exhibitId);
    }

    public Process save(Process process) {
        return repository.save(process);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
