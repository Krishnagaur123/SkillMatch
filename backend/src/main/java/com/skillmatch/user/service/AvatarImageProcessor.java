package com.skillmatch.user.service;

import com.skillmatch.user.exception.AvatarStorageException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
public class AvatarImageProcessor {

    private static final int MAX_SIZE = 512;

    public byte[] processAvatar(MultipartFile file) {
        try {
            BufferedImage originalImage = ImageIO.read(file.getInputStream());
            if (originalImage == null) {
                throw new AvatarStorageException("Invalid image file format");
            }

            BufferedImage resizedImage = optimizeImage(originalImage);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "jpg", baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new AvatarStorageException("Failed to process avatar image", e);
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

        BufferedImage optimizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = optimizedImage.createGraphics();
        
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
