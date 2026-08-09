package com.skillmatch.analytics;

import com.skillmatch.analytics.dto.CareerAnalyticsResponse;
import com.skillmatch.analytics.service.CareerAnalyticsService;
import com.skillmatch.config.CacheConfig;
import com.skillmatch.opportunity.repository.OpportunitySkillRepository;
import com.skillmatch.resume.repository.ResumeSkillRepository;
import com.skillmatch.skill.repository.UserSkillRepository;
import com.skillmatch.user.entity.User;
import com.skillmatch.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link CareerAnalyticsService} caching behaviour.
 *
 * <p>These tests use a simple in-memory {@link ConcurrentMapCacheManager} in place
 * of the production Redis-backed {@link CacheManager}. This means:
 * <ul>
 *   <li>No Redis server is required to run the tests.</li>
 *   <li>The caching proxy wiring (Spring AOP, {@link EnableCaching}, SpEL key
 *       evaluation) is verified end-to-end.</li>
 *   <li>The tests are fast, deterministic, and fully isolated.</li>
 * </ul>
 *
 * <p>What is NOT tested here:
 * <ul>
 *   <li>The JSON serialization of the value in Redis (tested separately by
 *       inspecting the Redis CLI output after a live deploy).</li>
 *   <li>TTL expiry (requires a real Redis instance with time manipulation).</li>
 * </ul>
 */
@SpringBootTest(classes = CareerAnalyticsServiceCacheTest.TestConfig.class)
class CareerAnalyticsServiceCacheTest {

    // ── Test doubles ─────────────────────────────────────────────────────────

    @Autowired private CareerAnalyticsService careerAnalyticsService;
    @Autowired private CacheManager           cacheManager;
    @Autowired private UserRepository         userRepository;
    @Autowired private OpportunitySkillRepository opportunitySkillRepository;
    @Autowired private ResumeSkillRepository  resumeSkillRepository;
    @Autowired private UserSkillRepository    userSkillRepository;

    // ── Test fixtures ─────────────────────────────────────────────────────────

    private static final UUID USER_A = UUID.fromString("aaaaaaaa-0000-0000-0000-000000000001");
    private static final UUID USER_B = UUID.fromString("bbbbbbbb-0000-0000-0000-000000000002");

    private final User userA = User.builder().build();
    private final User userB = User.builder().build();

    @BeforeEach
    void setUp() {
        // Clear the in-memory cache before each test for isolation.
        cacheManager.getCache(CacheConfig.CAREER_ANALYTICS_CACHE).clear();

        // Default stub: users have no target roles → returns emptyResponse().
        given(userRepository.findWithTargetRolesById(USER_A)).willReturn(Optional.of(userA));
        given(userRepository.findWithTargetRolesById(USER_B)).willReturn(Optional.of(userB));

        // No extra DB calls needed for the empty-response path.
        given(resumeSkillRepository.findSkillIdsByActiveResumeOfUser(any())).willReturn(Set.of());
        given(userSkillRepository.findSkillIdsByUser(any())).willReturn(Set.of());
    }

    // ── Tests ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Cache miss: service is invoked on first call")
    void firstCall_invokesService() {
        CareerAnalyticsResponse result = careerAnalyticsService.getCareerAnalytics(USER_A);

        assertThat(result).isNotNull();
        verify(userRepository, times(1)).findWithTargetRolesById(USER_A);
    }

    @Test
    @DisplayName("Cache hit: second call returns cached value without hitting DB")
    void secondCall_returnsCachedValue() {
        // First call — populates cache.
        careerAnalyticsService.getCareerAnalytics(USER_A);

        // Reset interaction count — second call must NOT hit the repository again.
        reset(userRepository);
        given(userRepository.findWithTargetRolesById(USER_A)).willReturn(Optional.of(userA));

        CareerAnalyticsResponse second = careerAnalyticsService.getCareerAnalytics(USER_A);

        assertThat(second).isNotNull();
        // Critical assertion: the repository was NOT called on the second request.
        verify(userRepository, never()).findWithTargetRolesById(USER_A);
    }

    @Test
    @DisplayName("User isolation: User A and User B have separate cache entries")
    void userIsolation_separateCacheEntries() {
        careerAnalyticsService.getCareerAnalytics(USER_A);
        careerAnalyticsService.getCareerAnalytics(USER_B);

        // Both users' entries must coexist independently in the cache.
        String keyA = "analytics:career:" + USER_A;
        String keyB = "analytics:career:" + USER_B;

        assertThat(cacheManager.getCache(CacheConfig.CAREER_ANALYTICS_CACHE).get(keyA)).isNotNull();
        assertThat(cacheManager.getCache(CacheConfig.CAREER_ANALYTICS_CACHE).get(keyB)).isNotNull();

        // The two keys must be distinct.
        assertThat(keyA).isNotEqualTo(keyB);
    }

    @Test
    @DisplayName("Cache key format: key is 'analytics:career:{userId}'")
    void cacheKey_hasCorrectFormat() {
        careerAnalyticsService.getCareerAnalytics(USER_A);

        String expectedKey = "analytics:career:" + USER_A;
        Object cached = cacheManager.getCache(CacheConfig.CAREER_ANALYTICS_CACHE).get(expectedKey);

        assertThat(cached).isNotNull();
    }

    @Test
    @DisplayName("Cache name: CAREER_ANALYTICS_CACHE constant is 'careerAnalytics'")
    void cacheName_isCorrectConstant() {
        assertThat(CacheConfig.CAREER_ANALYTICS_CACHE).isEqualTo("careerAnalytics");
    }

    @Test
    @DisplayName("TTL: CacheConfig defines careerAnalytics cache region")
    void cacheRegion_exists() {
        // The in-memory manager creates caches on demand; verify via the constant
        // used in @Cacheable annotation.
        careerAnalyticsService.getCareerAnalytics(USER_A);
        assertThat(cacheManager.getCache(CacheConfig.CAREER_ANALYTICS_CACHE)).isNotNull();
    }

    // ── Test configuration ────────────────────────────────────────────────────

    /**
     * Minimal Spring context that wires caching with an in-memory cache manager
     * (no Redis required) and mocked repositories.
     *
     * <p>Note: {@link RedisAutoConfiguration} and {@link CacheAutoConfiguration}
     * are NOT imported here — we define our own {@link CacheManager} bean.
     */
    @Configuration
    @EnableCaching
    static class TestConfig {

        @Bean
        public CacheManager cacheManager() {
            // ConcurrentMapCacheManager is Spring's in-memory cache — no Redis needed.
            return new ConcurrentMapCacheManager(CacheConfig.CAREER_ANALYTICS_CACHE);
        }

        @Bean
        public CareerAnalyticsService careerAnalyticsService(
                UserRepository userRepository,
                OpportunitySkillRepository opportunitySkillRepository,
                ResumeSkillRepository resumeSkillRepository,
                UserSkillRepository userSkillRepository) {
            return new CareerAnalyticsService(
                    userRepository,
                    opportunitySkillRepository,
                    resumeSkillRepository,
                    userSkillRepository);
        }

        @Bean
        public UserRepository userRepository() {
            return mock(UserRepository.class);
        }

        @Bean
        public OpportunitySkillRepository opportunitySkillRepository() {
            return mock(OpportunitySkillRepository.class);
        }

        @Bean
        public ResumeSkillRepository resumeSkillRepository() {
            return mock(ResumeSkillRepository.class);
        }

        @Bean
        public UserSkillRepository userSkillRepository() {
            return mock(UserSkillRepository.class);
        }
    }
}
