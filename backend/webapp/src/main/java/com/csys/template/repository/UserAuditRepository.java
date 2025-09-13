package com.csys.template.repository;

import com.csys.template.domain.UserAudit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for UserAudit entity.
 * Provides methods to query audit history for User entities.
 */
@Repository
public interface UserAuditRepository extends JpaRepository<UserAudit, Long> {

    /**
     * Find all audit records for a specific user ID, ordered by operation timestamp descending.
     */
    Page<UserAudit> findByUserIdOrderByOperationTimestampDesc(Long userId, Pageable pageable);

    /**
     * Find audit records by operation type.
     */
    Page<UserAudit> findByOperationTypeOrderByOperationTimestampDesc(String operationType, Pageable pageable);

    /**
     * Find audit records by performed by user.
     */
    Page<UserAudit> findByPerformedByOrderByOperationTimestampDesc(String performedBy, Pageable pageable);

    /**
     * Find audit records within a date range.
     */
    @Query("SELECT ua FROM UserAudit ua WHERE ua.operationTimestamp BETWEEN :startDate AND :endDate ORDER BY ua.operationTimestamp DESC")
    Page<UserAudit> findByOperationTimestampBetween(@Param("startDate") LocalDateTime startDate, 
                                                    @Param("endDate") LocalDateTime endDate, 
                                                    Pageable pageable);

    /**
     * Find audit records for a specific user within a date range.
     */
    @Query("SELECT ua FROM UserAudit ua WHERE ua.userId = :userId AND ua.operationTimestamp BETWEEN :startDate AND :endDate ORDER BY ua.operationTimestamp DESC")
    Page<UserAudit> findByUserIdAndOperationTimestampBetween(@Param("userId") Long userId,
                                                            @Param("startDate") LocalDateTime startDate,
                                                            @Param("endDate") LocalDateTime endDate,
                                                            Pageable pageable);

    /**
     * Count operations by type for a specific user.
     */
    @Query("SELECT ua.operationType, COUNT(ua) FROM UserAudit ua WHERE ua.userId = :userId GROUP BY ua.operationType")
    List<Object[]> countOperationsByTypeForUser(@Param("userId") Long userId);

    /**
     * Find the latest audit record for a specific user.
     */
    UserAudit findTopByUserIdOrderByOperationTimestampDesc(Long userId);

    /**
     * Find all audit records for multiple users.
     */
    Page<UserAudit> findByUserIdInOrderByOperationTimestampDesc(List<Long> userIds, Pageable pageable);
}
