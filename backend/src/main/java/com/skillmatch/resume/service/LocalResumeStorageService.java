package com.skillmatch.resume.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.skillmatch.resume.exception.ResumeStorageException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@Slf4j
@Service
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "local", matchIfMissing = true)
@RequiredArgsConstructor
public class LocalResumeStorageService implements ResumeStorageService {

    @Value("${app.resume.storage-path}")
    private String storagePath;

    @Override
    public String store(UUID userId, MultipartFile file) {
        String storageKey = "users/" + userId + "/resumes/" + UUID.randomUUID() + ".pdf";
        Path destination = resolveLocalPath(storageKey);
        try {
            Files.createDirectories(destination.getParent());
            file.transferTo(destination);
        } catch (IOException e) {
            log.error("Failed to store resume for user {}", userId, e);
            throw new ResumeStorageException("Failed to store file", e);
        }
        return storageKey;
    }

    @Override
    public InputStream load(String storageKey) {
        Path filePath = resolveLocalPath(storageKey);
        try {
            return Files.newInputStream(filePath);
        } catch (IOException e) {
            log.error("Failed to load resume file {}", storageKey, e);
            throw new ResumeStorageException("Failed to load file", e);
        }
    }

    @Override
    public void delete(String storageKey) {
        if (storageKey == null || storageKey.isBlank()) return;
        Path filePath = resolveLocalPath(storageKey);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("Failed to delete resume file {}", storageKey, e);
            throw new ResumeStorageException("Failed to delete file", e);
        }
    }

    private Path resolveLocalPath(String storageKey) {
        return Paths.get(storagePath).resolve(storageKey);
    }
}
