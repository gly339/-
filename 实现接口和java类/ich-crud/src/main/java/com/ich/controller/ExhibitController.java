package com.ich.controller;

import com.ich.entity.Exhibit;
import com.ich.service.ExhibitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exhibits")
@CrossOrigin
public class ExhibitController {

    private final ExhibitService service;

    public ExhibitController(ExhibitService service) {
        this.service = service;
    }

    @GetMapping
    public List<Exhibit> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exhibit> detail(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public List<Exhibit> listByCategory(@PathVariable Long categoryId) {
        return service.findByCategoryId(categoryId);
    }

    @PostMapping
    public Exhibit create(@RequestBody Exhibit exhibit) {
        return service.save(exhibit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exhibit> update(@PathVariable Long id, @RequestBody Exhibit exhibit) {
        return service.findById(id)
                .map(existing -> {
                    existing.setName(exhibit.getName());
                    existing.setDescription(exhibit.getDescription());
                    existing.setImageUrl(exhibit.getImageUrl());
                    existing.setCategory(exhibit.getCategory());
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
