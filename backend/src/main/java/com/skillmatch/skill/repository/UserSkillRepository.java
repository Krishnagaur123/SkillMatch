package com.skillmatch.skill.repository;

import com.skillmatch.skill.entity.Skill;
import com.skillmatch.skill.entity.UserSkill;
import com.skillmatch.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, UUID> {


    @Query("SELECT us FROM UserSkill us JOIN FETCH us.skill WHERE us.user = :user ORDER BY us.skill.name ASC")
    List<UserSkill> findAllByUserWithSkill(@Param("user") User user);

    boolean existsByUser(User user);

    boolean existsByUserAndSkill(User user, Skill skill);

    void deleteByUserAndSkill(User user, Skill skill);

    long countByUser(User user);

    @Query("SELECT us.skill.id FROM UserSkill us WHERE us.user = :user")
    Set<UUID> findSkillIdsByUser(@Param("user") User user);
}
