package com.skillmatch.skill.repository;

import com.skillmatch.skill.entity.SkillAlias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillAliasRepository extends JpaRepository<SkillAlias, UUID> {

    Optional<SkillAlias> findByAliasIgnoreCase(String alias);

    @Query("SELECT sa.alias, sa.skill.id FROM SkillAlias sa")
    List<Object[]> findAllAliasProjections();
}
