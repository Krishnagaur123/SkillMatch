package com.skillmatch.user.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.UUID;

public interface AvatarStorageService {
    
    /**
     * Stores and optimizes the given avatar file for the specified user.
     * @param userId The ID of the user.
     * @param file The multipart file to store.
     * @return The storage key generated for this avatar (e.g. "avatars/123e4567.jpg").
     */
    String storeAvatar(UUID userId, MultipartFile file);

    /**
     * Deletes the avatar with the given storage key.
     * @param storageKey The storage key to delete.
     */
    void deleteAvatar(String storageKey);

    /**
     * Loads the avatar as a byte array.
     * @param storageKey The storage key to load.
     * @return Optional containing the file bytes, or empty if not found.
     */
    Optional<byte[]> loadAvatar(String storageKey);
}
