package com.skillmatch.user.controller;

import com.skillmatch.user.dto.UserProfileResponse;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.repository.UserRepository;
import com.skillmatch.user.service.AvatarStorageService;
import com.skillmatch.user.service.CurrentUserService;
import com.skillmatch.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserAvatarController {

    private final AvatarStorageService avatarStorageService;
    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/me/avatar")
    public ResponseEntity<UserProfileResponse> uploadAvatar(@RequestParam("file") MultipartFile file) {
        User user = currentUserService.getCurrentUser();
        
        String oldPicture = user.getProfilePictureUrl();
        String storageKey = avatarStorageService.storeAvatar(user.getId(), file);

        try {
            user.setProfilePictureUrl(storageKey);
            userRepository.save(user);
        } catch (Exception e) {
            try {
                avatarStorageService.deleteAvatar(storageKey);
            } catch (Exception ignored) {
            }
            throw e;
        }

        if (oldPicture != null) {
            avatarStorageService.deleteAvatar(oldPicture);
        }

        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @DeleteMapping("/me/avatar")
    public ResponseEntity<UserProfileResponse> deleteAvatar() {
        User user = currentUserService.getCurrentUser();
        
        String oldPicture = user.getProfilePictureUrl();
        
        user.setProfilePictureUrl(null);
        userRepository.save(user);

        if (oldPicture != null) {
            avatarStorageService.deleteAvatar(oldPicture);
        }

        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @GetMapping("/{userId}/avatar")
    public ResponseEntity<Resource> getAvatar(@PathVariable UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        String picture = user.getProfilePictureUrl();
        if (picture == null || picture.startsWith("http")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No local avatar found");
        }

        Optional<byte[]> avatarData = avatarStorageService.loadAvatar(picture);
        if (avatarData.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Avatar file not found");
        }

        ByteArrayResource resource = new ByteArrayResource(avatarData.get());
        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(resource);
    }
}
