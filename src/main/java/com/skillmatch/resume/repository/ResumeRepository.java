package com.skillmatch.resume.repository;

import com.skillmatch.resume.entity.Resume;
import com.skillmatch.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, UUID> {

    List<Resume> findAllByUserOrderByUploadedAtDesc(User user);

    Optional<Resume> findByIdAndUser(UUID id, User user);

    boolean existsByUserAndFileName(User user, String fileName);

    List<Resume> findAllByUser(User user);

    boolean existsByUser(User user);

    Optional<Resume> findByUserAndActiveTrue(User user);
}
