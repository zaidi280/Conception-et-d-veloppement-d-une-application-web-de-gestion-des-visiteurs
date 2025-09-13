package com.csys.template.service;

import com.csys.template.domain.UserAudit;
import com.csys.template.repository.UserAuditRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for managing User audit operations.
 * Provides methods to query and analyze audit history for User entities.
 */
@Service
@Transactional(readOnly = true)
public class UserAuditService {

    private static final Logger log = LoggerFactory.getLogger(UserAuditService.class);

    @Autowired
    private UserAuditRepository userAuditRepository;

    /**
     * Get all audit records with pagination.
     */
    public Page<UserAudit> findAll(Pageable pageable) {
        log.debug("Request to get all UserAudit records");
        return userAuditRepository.findAll(pageable);
    }

    /**
     * Get audit record by ID.
     */
    public Optional<UserAudit> findById(Long id) {
        log.debug("Request to get UserAudit by id: {}", id);
        return userAuditRepository.findById(id);
    }

    /**
     * Get audit history for a specific user.
     */
    public Page<UserAudit> findByUserId(Long userId, Pageable pageable) {
        log.debug("Request to get audit history for user: {}", userId);
        return userAuditRepository.findByUserIdOrderByOperationTimestampDesc(userId, pageable);
    }

    /**
     * Get audit records by operation type.
     */
    public Page<UserAudit> findByOperationType(String operationType, Pageable pageable) {
        log.debug("Request to get audit records by operation type: {}", operationType);
        return userAuditRepository.findByOperationTypeOrderByOperationTimestampDesc(operationType, pageable);
    }

    /**
     * Get audit records by performed by user.
     */
    public Page<UserAudit> findByPerformedBy(String performedBy, Pageable pageable) {
        log.debug("Request to get audit records performed by: {}", performedBy);
        return userAuditRepository.findByPerformedByOrderByOperationTimestampDesc(performedBy, pageable);
    }

    /**
     * Get audit records within a date range.
     */
    public Page<UserAudit> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        log.debug("Request to get audit records between {} and {}", startDate, endDate);
        return userAuditRepository.findByOperationTimestampBetween(startDate, endDate, pageable);
    }

    /**
     * Get audit records for a specific user within a date range.
     */
    public Page<UserAudit> findByUserIdAndDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        log.debug("Request to get audit records for user {} between {} and {}", userId, startDate, endDate);
        return userAuditRepository.findByUserIdAndOperationTimestampBetween(userId, startDate, endDate, pageable);
    }

    /**
     * Count operations by type for a specific user.
     */
    public List<Object[]> countOperationsByTypeForUser(Long userId) {
        log.debug("Request to count operations by type for user: {}", userId);
        return userAuditRepository.countOperationsByTypeForUser(userId);
    }

    /**
     * Get the latest audit record for a specific user.
     */
    public UserAudit findLatestAuditForUser(Long userId) {
        log.debug("Request to get latest audit record for user: {}", userId);
        return userAuditRepository.findTopByUserIdOrderByOperationTimestampDesc(userId);
    }

    /**
     * Get audit records for multiple users.
     */
    public Page<UserAudit> findByUserIds(List<Long> userIds, Pageable pageable) {
        log.debug("Request to get audit records for users: {}", userIds);
        return userAuditRepository.findByUserIdInOrderByOperationTimestampDesc(userIds, pageable);
    }

    /**
     * Get total count of audit records.
     */
    public long getTotalAuditCount() {
        log.debug("Request to get total audit count");
        return userAuditRepository.count();
    }

    /**
     * Get audit count for a specific user.
     */
    public long getAuditCountForUser(Long userId) {
        log.debug("Request to get audit count for user: {}", userId);
        return userAuditRepository.findByUserIdOrderByOperationTimestampDesc(userId, Pageable.unpaged()).getTotalElements();
    }
}
