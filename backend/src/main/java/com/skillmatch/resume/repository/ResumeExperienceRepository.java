package com.skillmatch.resume.repository;

import com.skillmatch.resume.entity.Resume;
import com.skillmatch.resume.entity.ResumeExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResumeExperienceRepository extends JpaRepository<ResumeExperience, UUID> {

    List<ResumeExperience> findAllByResume(Resume resume);

    void deleteAllByResume(Resume resume);

    long countByResume(Resume resume);
}
