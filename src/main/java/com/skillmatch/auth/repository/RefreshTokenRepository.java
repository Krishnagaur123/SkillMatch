package com.skillmatch.auth.repository;

import com.skillmatch.auth.entity.RefreshToken;
import com.skillmatch.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByToken(String token);

    void deleteAllByUser(User user);

    /** Useful for a scheduled cleanup job — deletes all expired tokens. */
    void deleteAllByExpiresAtBefore(LocalDateTime threshold);
}
