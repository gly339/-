package com.ich.service;

import com.ich.entity.Carrier;
import com.ich.repository.CarrierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarrierService {

    private final CarrierRepository repository;

    public CarrierService(CarrierRepository repository) {
        this.repository = repository;
    }

    public List<Carrier> findAll() {
        return repository.findAll();
    }

    public Optional<Carrier> findById(Long id) {
        return repository.findById(id);
    }

    public List<Carrier> findByType(String type) {
        return repository.findByType(type);
    }

    public Carrier save(Carrier carrier) {
        return repository.save(carrier);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
