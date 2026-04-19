package com.feiyi.service;

import com.feiyi.entity.Exhibit;
import com.feiyi.repository.ExhibitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExhibitService {

    @Autowired
    private ExhibitRepository exhibitRepository;

    public List<Exhibit> getAllExhibits(String category, Integer page, Integer limit) {
        List<Exhibit> exhibits;
        if (category == null || "all".equals(category)) {
            exhibits = exhibitRepository.findByPublishedTrueOrderByCreatedAtDesc();
        } else {
            exhibits = exhibitRepository.findByPublishedTrueAndCategory_Id(Integer.parseInt(category));
        }

        int offset = (page - 1) * limit;
        return exhibits.stream().skip(offset).limit(limit).toList();
    }

    public Exhibit getExhibitById(Integer id) {
        Exhibit exhibit = exhibitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("展品不存在"));

        // 增加浏览量
        exhibit.setViews(exhibit.getViews() != null ? exhibit.getViews() + 1 : 1);
        exhibit.setUpdatedAt(LocalDateTime.now());
        return exhibitRepository.save(exhibit);
    }

    public Exhibit createExhibit(Exhibit exhibit) {
        exhibit.setViews(0);
        exhibit.setPublished(true);
        exhibit.setCreatedAt(LocalDateTime.now());
        exhibit.setUpdatedAt(LocalDateTime.now());
        return exhibitRepository.save(exhibit);
    }

    public Exhibit updateExhibit(Integer id, Exhibit exhibitData) {
        Exhibit exhibit = exhibitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("展品不存在"));

        if (exhibitData.getName() != null) exhibit.setName(exhibitData.getName());
        if (exhibitData.getDescription() != null) exhibit.setDescription(exhibitData.getDescription());
        if (exhibitData.getImageUrl() != null) exhibit.setImageUrl(exhibitData.getImageUrl());
        if (exhibitData.getModelUrl() != null) exhibit.setModelUrl(exhibitData.getModelUrl());
        if (exhibitData.getCategory() != null) exhibit.setCategory(exhibitData.getCategory());
        if (exhibitData.getPublished() != null) exhibit.setPublished(exhibitData.getPublished());

        exhibit.setUpdatedAt(LocalDateTime.now());
        return exhibitRepository.save(exhibit);
    }

    public void deleteExhibit(Integer id) {
        exhibitRepository.deleteById(id);
    }
}
