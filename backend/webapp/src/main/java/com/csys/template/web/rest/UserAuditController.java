package com.csys.template.web.rest;

import com.csys.template.domain.UserAudit;
import com.csys.template.service.UserAuditService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing User audit operations.
 * Provides endpoints to query audit history for User entities.
 */
@RestController
@RequestMapping("/api/audit/users")
public class UserAuditController {

    private static final Logger log = LoggerFactory.getLogger(UserAuditController.class);

    @Autowired
    private UserAuditService userAuditService;

    /**
     * GET /api/audit/users : Get all user audit records with pagination.
     */
    @GetMapping
    public ResponseEntity<Page<UserAudit>> getAllUserAudits(Pageable pageable) {
        log.debug("REST request to get all UserAudit records");
        Page<UserAudit> page = userAuditService.findAll(pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/users/{id} : Get a specific user audit record.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserAudit> getUserAudit(@PathVariable Long id) {
        log.debug("REST request to get UserAudit : {}", id);
        Optional<UserAudit> userAudit = userAuditService.findById(id);
        return userAudit.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/audit/users/user/{userId} : Get audit history for a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<UserAudit>> getUserAuditHistory(@PathVariable Long userId, Pageable pageable) {
        log.debug("REST request to get audit history for user : {}", userId);
        Page<UserAudit> page = userAuditService.findByUserId(userId, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/users/operation/{operationType} : Get audit records by operation type.
     */
    @GetMapping("/operation/{operationType}")
    public ResponseEntity<Page<UserAudit>> getUserAuditsByOperation(@PathVariable String operationType, Pageable pageable) {
        log.debug("REST request to get audit records by operation type : {}", operationType);
        Page<UserAudit> page = userAuditService.findByOperationType(operationType, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/users/performed-by/{performedBy} : Get audit records by performed by user.
     */
    @GetMapping("/performed-by/{performedBy}")
    public ResponseEntity<Page<UserAudit>> getUserAuditsByPerformedBy(@PathVariable String performedBy, Pageable pageable) {
        log.debug("REST request to get audit records performed by : {}", performedBy);
        Page<UserAudit> page = userAuditService.findByPerformedBy(performedBy, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/users/date-range : Get audit records within a date range.
     */
    @GetMapping("/date-range")
    public ResponseEntity<Page<UserAudit>> getUserAuditsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        log.debug("REST request to get audit records between {} and {}", startDate, endDate);
        Page<UserAudit> page = userAuditService.findByDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/users/user/{userId}/date-range : Get audit records for a specific user within a date range.
     */
    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<Page<UserAudit>> getUserAuditsByUserAndDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        log.debug("REST request to get audit records for user {} between {} and {}", userId, startDate, endDate);
        Page<UserAudit> page = userAuditService.findByUserIdAndDateRange(userId, startDate, endDate, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/users/user/{userId}/operations-count : Count operations by type for a specific user.
     */
    @GetMapping("/user/{userId}/operations-count")
    public ResponseEntity<List<Object[]>> countOperationsByTypeForUser(@PathVariable Long userId) {
        log.debug("REST request to count operations by type for user : {}", userId);
        List<Object[]> counts = userAuditService.countOperationsByTypeForUser(userId);
        return ResponseEntity.ok(counts);
    }

    /**
     * GET /api/audit/users/user/{userId}/latest : Get the latest audit record for a specific user.
     */
    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<UserAudit> getLatestUserAudit(@PathVariable Long userId) {
        log.debug("REST request to get latest audit record for user : {}", userId);
        UserAudit latestAudit = userAuditService.findLatestAuditForUser(userId);
        return latestAudit != null ? ResponseEntity.ok(latestAudit) : ResponseEntity.notFound().build();
    }

    /**
     * GET /api/audit/users/count : Get total count of audit records.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalAuditCount() {
        log.debug("REST request to get total audit count");
        long count = userAuditService.getTotalAuditCount();
        return ResponseEntity.ok(count);
    }

    /**
     * GET /api/audit/users/user/{userId}/count : Get audit count for a specific user.
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getAuditCountForUser(@PathVariable Long userId) {
        log.debug("REST request to get audit count for user : {}", userId);
        long count = userAuditService.getAuditCountForUser(userId);
        return ResponseEntity.ok(count);
    }
}
