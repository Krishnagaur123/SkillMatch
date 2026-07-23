package com.skillmatch.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocalAvatarStorageService implements AvatarStorageService {

    @Value("${app.avatar.storage-path}")
    private String storagePath;

    @Value("${app.avatar.max-file-size-mb:5}")
    private int maxFileSizeMb;

    private static final int MAX_SIZE = 512;

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
            BufferedImage originalImage = ImageIO.read(file.getInputStream());
            if (originalImage == null) {
                log.warn("Avatar upload failed for user {}: ImageIO could not parse the file", userId);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image file format");
            }

            BufferedImage resizedImage = optimizeImage(originalImage);

            String fileId = UUID.randomUUID().toString();
            String storageKey = fileId + ".jpg";
            Path storageDir = Paths.get(storagePath);
            Files.createDirectories(storageDir);

            Path destination = storageDir.resolve(storageKey);
            
            // Save as JPEG
            ImageIO.write(resizedImage, "jpg", destination.toFile());

            return storageKey;

        } catch (IOException e) {
            log.error("Failed to store avatar for user {}", userId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store avatar image");
        }
    }

    @Override
    public void deleteAvatar(String storageKey) {
        if (storageKey == null || storageKey.isBlank()) return;
        Path filePath = Paths.get(storagePath).resolve(storageKey);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Failed to delete avatar file {}", storageKey, e);
        }
    }

    @Override
    public Optional<byte[]> loadAvatar(String storageKey) {
        if (storageKey == null || storageKey.isBlank()) return Optional.empty();
        Path filePath = Paths.get(storagePath).resolve(storageKey);
        if (!Files.exists(filePath)) {
            return Optional.empty();
        }
        try {
            return Optional.of(Files.readAllBytes(filePath));
        } catch (IOException e) {
            log.error("Failed to read avatar file {}", storageKey, e);
            return Optional.empty();
        }
    }

    private BufferedImage optimizeImage(BufferedImage originalImage) {
        int imgWidth = originalImage.getWidth();
        int imgHeight = originalImage.getHeight();

        int targetWidth = imgWidth;
        int targetHeight = imgHeight;

        if (imgWidth > MAX_SIZE || imgHeight > MAX_SIZE) {
            double ratio = Math.min((double) MAX_SIZE / imgWidth, (double) MAX_SIZE / imgHeight);
            targetWidth = (int) (imgWidth * ratio);
            targetHeight = (int) (imgHeight * ratio);
        }

        // Draw image onto a TYPE_INT_RGB canvas with white background (to handle PNG transparency safely)
        BufferedImage optimizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = optimizedImage.createGraphics();
        
        // Better scaling
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, targetWidth, targetHeight);
        g2d.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        g2d.dispose();

        return optimizedImage;
    }
}
