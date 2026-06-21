package com.skillmatch.role.repository;

import com.skillmatch.role.entity.TargetRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface TargetRoleRepository extends JpaRepository<TargetRole, UUID> {

    Set<TargetRole> findAllByIdIn(Set<UUID> ids);
}
