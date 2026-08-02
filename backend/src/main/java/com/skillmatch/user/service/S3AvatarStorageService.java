package com.skillmatch.user.service;

import com.skillmatch.config.S3Properties;
import com.skillmatch.user.exception.AvatarStorageException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "s3")
public class S3AvatarStorageService implements AvatarStorageService {

    private final S3Client s3Client;
    private final S3Properties s3Properties;
    private final AvatarImageProcessor imageProcessor;

    @Value("${app.avatar.max-file-size-mb:5}")
    private int maxFileSizeMb;

    @Override
    public String storeAvatar(UUID userId, MultipartFile file) {
        if (file == null) {
            log.warn("Avatar upload failed for user {}: MultipartFile is null", userId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is missing");
        }
        if (file.isEmpty()) {
            log.warn("Avatar upload failed for user {}: File is empty", userId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must not be empty");
        }
        if (file.getSize() > (long) maxFileSizeMb * 1024 * 1024) {
            log.warn("Avatar upload failed for user {}: File size {} exceeds max {}MB", userId, file.getSize(), maxFileSizeMb);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File exceeds maximum allowed size");
        }
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/"))) {
            log.warn("Avatar upload failed for user {}: Invalid content type {}", userId, contentType);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image files are supported");
        }

        try {
            byte[] imageBytes = imageProcessor.processAvatar(file);

            String fileId = UUID.randomUUID().toString();
            String storageKey = "users/" + userId + "/avatars/" + fileId + ".jpg";

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Properties.getBucket())
                    .key(storageKey)
                    .contentType("image/jpeg")
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(imageBytes));

            return storageKey;

        } catch (SdkException e) {
            log.error("Failed to store avatar for user {}", userId, e);
            throw new AvatarStorageException("Failed to store avatar image", e);
        }
    }

    @Override
    public void deleteAvatar(String storageKey) {
        if (storageKey == null || storageKey.isBlank()) return;
        if (storageKey.startsWith("http")) return;

        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(s3Properties.getBucket())
                    .key(storageKey)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (SdkException e) {
            log.warn("Failed to delete avatar file {}", storageKey, e);
        }
    }

    @Override
    public Optional<byte[]> loadAvatar(String storageKey) {
        if (storageKey == null || storageKey.isBlank()) return Optional.empty();

        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(s3Properties.getBucket())
                    .key(storageKey)
                    .build();

            try (ResponseInputStream<GetObjectResponse> response = s3Client.getObject(getObjectRequest)) {
                return Optional.of(response.readAllBytes());
            }
        } catch (SdkException | IOException e) {
            log.error("Failed to read avatar file {}", storageKey, e);
            return Optional.empty();
        }
    }
}
