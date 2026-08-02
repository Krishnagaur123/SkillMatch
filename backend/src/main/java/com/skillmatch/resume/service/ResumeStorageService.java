package com.skillmatch.resume.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

public interface ResumeStorageService {

    String store(UUID userId, MultipartFile file);

    InputStream load(String storageKey);

    void delete(String storageKey);
}
