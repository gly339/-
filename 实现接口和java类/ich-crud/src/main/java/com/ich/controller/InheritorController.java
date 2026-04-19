package com.ich.controller;

import com.ich.entity.Inheritor;
import com.ich.service.InheritorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inheritors")
@CrossOrigin
public class InheritorController {

    private final InheritorService service;

    public InheritorController(InheritorService service) {
        this.service = service;
    }

    @GetMapping
    public List<Inheritor> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inheritor> detail(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public List<Inheritor> listByCategory(@PathVariable Long categoryId) {
        return service.findByCategoryId(categoryId);
    }

    @PostMapping
    public Inheritor create(@RequestBody Inheritor inheritor) {
        return service.save(inheritor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inheritor> update(@PathVariable Long id, @RequestBody Inheritor inheritor) {
        return service.findById(id)
                .map(existing -> {
                    existing.setName(inheritor.getName());
                    existing.setTitle(inheritor.getTitle());
                    existing.setBio(inheritor.getBio());
                    existing.setAvatarUrl(inheritor.getAvatarUrl());
                    existing.setCategory(inheritor.getCategory());
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
