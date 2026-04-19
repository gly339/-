package com.ich.controller;

import com.ich.entity.Process;
import com.ich.service.ProcessService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/processes")
@CrossOrigin
public class ProcessController {

    private final ProcessService service;

    public ProcessController(ProcessService service) {
        this.service = service;
    }

    @GetMapping
    public List<Process> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Process> detail(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public List<Process> listByCategory(@PathVariable Long categoryId) {
        return service.findByCategoryId(categoryId);
    }

    @GetMapping("/exhibit/{exhibitId}")
    public List<Process> listByExhibit(@PathVariable Long exhibitId) {
        return service.findByExhibitId(exhibitId);
    }

    @PostMapping
    public Process create(@RequestBody Process process) {
        return service.save(process);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Process> update(@PathVariable Long id, @RequestBody Process process) {
        return service.findById(id)
                .map(existing -> {
                    existing.setName(process.getName());
                    existing.setDescription(process.getDescription());
                    existing.setStepOrder(process.getStepOrder());
                    existing.setExhibit(process.getExhibit());
                    existing.setCategory(process.getCategory());
                    return ResponseEntity.ok(service.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
