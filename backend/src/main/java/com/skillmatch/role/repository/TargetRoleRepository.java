package com.skillmatch.role.repository;

import com.skillmatch.role.entity.TargetRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface TargetRoleRepository extends JpaRepository<TargetRole, UUID> {

    List<TargetRole> findAllByOrderByNameAsc();

    Set<TargetRole> findAllByIdIn(Collection<UUID> ids);
}
