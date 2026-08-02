package com.skillmatch.resume.service;

import com.skillmatch.config.S3Properties;
import com.skillmatch.resume.exception.ResumeStorageException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.exception.SdkException;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "s3")
public class S3ResumeStorageService implements ResumeStorageService {

    private final S3Client s3Client;
    private final S3Properties s3Properties;

    @Override
    public String store(UUID userId, MultipartFile file) {
        String storageKey = "users/" + userId + "/resumes/" + UUID.randomUUID() + ".pdf";

        try (InputStream inputStream = file.getInputStream()) {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Properties.getBucket())
                    .key(storageKey)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
            return storageKey;
        } catch (IOException | SdkException e) {
            log.error("Failed to store resume for user {} in S3", userId, e);
            throw new ResumeStorageException("Failed to store file", e);
        }
    }

    @Override
    public InputStream load(String storageKey) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(s3Properties.getBucket())
                    .key(storageKey)
                    .build();

            return s3Client.getObject(getObjectRequest);
        } catch (SdkException e) {
            log.error("Failed to load resume with key {} from S3", storageKey, e);
            throw new ResumeStorageException("Failed to load file", e);
        }
    }

    @Override
    public void delete(String storageKey) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(s3Properties.getBucket())
                    .key(storageKey)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (SdkException e) {
            log.error("Failed to delete resume with key {} from S3", storageKey, e);
            throw new ResumeStorageException("Failed to delete file", e);
        }
    }
}
