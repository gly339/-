package com.ich.service;

import com.ich.entity.Asset;
import com.ich.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    public List<Asset> findAll() {
        return assetRepository.findAll();
    }

    public Asset findById(Long id) {
        return assetRepository.findById(id).orElse(null);
    }

    public List<Asset> findByFile_type(String file_type) {
        return assetRepository.findByFile_type(file_type);
    }

    public List<Asset> findAllByOrderByCreated_atDesc() {
        return assetRepository.findAllByOrderByCreated_atDesc();
    }

    public Asset save(Asset asset) {
        return assetRepository.save(asset);
    }

    public void deleteById(Long id) {
        assetRepository.deleteById(id);
    }
}