package com.skillmatch.resume.repository;

import com.skillmatch.resume.entity.Resume;
import com.skillmatch.resume.entity.ResumeSkill;
import com.skillmatch.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ResumeSkillRepository extends JpaRepository<ResumeSkill, UUID> {


    @Query("SELECT rs FROM ResumeSkill rs JOIN FETCH rs.skill WHERE rs.resume = :resume")
    List<ResumeSkill> findAllByResumeWithSkill(@Param("resume") Resume resume);

    void deleteAllByResume(Resume resume);

    long countByResume(Resume resume);


    @Query("SELECT rs.skill.id FROM ResumeSkill rs WHERE rs.resume.user = :user AND rs.resume.active = true")
    Set<UUID> findSkillIdsByActiveResumeOfUser(@Param("user") User user);
}
