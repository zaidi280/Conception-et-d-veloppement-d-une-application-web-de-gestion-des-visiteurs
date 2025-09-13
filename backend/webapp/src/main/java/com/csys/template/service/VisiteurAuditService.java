package com.csys.template.service;

import com.csys.template.domain.VisiteurAudit;
import com.csys.template.domain.TypeVisiteur;
import com.csys.template.repository.VisiteurAuditRepository;
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
 * Service class for managing Visiteur audit operations.
 * Provides methods to query and analyze audit history for Visiteur entities.
 */
@Service
@Transactional(readOnly = true)
public class VisiteurAuditService {

    private static final Logger log = LoggerFactory.getLogger(VisiteurAuditService.class);

    @Autowired
    private VisiteurAuditRepository visiteurAuditRepository;

    /**
     * Get all audit records with pagination.
     */
    public Page<VisiteurAudit> findAll(Pageable pageable) {
        log.debug("Request to get all VisiteurAudit records");
        return visiteurAuditRepository.findAll(pageable);
    }

    /**
     * Get audit record by ID.
     */
    public Optional<VisiteurAudit> findById(Long id) {
        log.debug("Request to get VisiteurAudit by id: {}", id);
        return visiteurAuditRepository.findById(id);
    }

    /**
     * Get audit history for a specific visiteur.
     */
    public Page<VisiteurAudit> findByVisiteurId(Long visiteurId, Pageable pageable) {
        log.debug("Request to get audit history for visiteur: {}", visiteurId);
        return visiteurAuditRepository.findByVisiteurIdOrderByOperationTimestampDesc(visiteurId, pageable);
    }

    /**
     * Get audit records by operation type.
     */
    public Page<VisiteurAudit> findByOperationType(String operationType, Pageable pageable) {
        log.debug("Request to get audit records by operation type: {}", operationType);
        return visiteurAuditRepository.findByOperationTypeOrderByOperationTimestampDesc(operationType, pageable);
    }

    /**
     * Get audit records by performed by user.
     */
    public Page<VisiteurAudit> findByPerformedBy(String performedBy, Pageable pageable) {
        log.debug("Request to get audit records performed by: {}", performedBy);
        return visiteurAuditRepository.findByPerformedByOrderByOperationTimestampDesc(performedBy, pageable);
    }

    /**
     * Get audit records by CIN.
     */
    public Page<VisiteurAudit> findByCin(String cin, Pageable pageable) {
        log.debug("Request to get audit records for CIN: {}", cin);
        return visiteurAuditRepository.findByCinOrderByOperationTimestampDesc(cin, pageable);
    }

    /**
     * Get audit records by visitor type.
     */
    public Page<VisiteurAudit> findByTypeVisiteur(TypeVisiteur typeVisiteur, Pageable pageable) {
        log.debug("Request to get audit records for visitor type: {}", typeVisiteur);
        return visiteurAuditRepository.findByTypeVisiteurOrderByOperationTimestampDesc(typeVisiteur, pageable);
    }

    /**
     * Get audit records within a date range.
     */
    public Page<VisiteurAudit> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        log.debug("Request to get audit records between {} and {}", startDate, endDate);
        return visiteurAuditRepository.findByOperationTimestampBetween(startDate, endDate, pageable);
    }

    /**
     * Get audit records for a specific visiteur within a date range.
     */
    public Page<VisiteurAudit> findByVisiteurIdAndDateRange(Long visiteurId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        log.debug("Request to get audit records for visiteur {} between {} and {}", visiteurId, startDate, endDate);
        return visiteurAuditRepository.findByVisiteurIdAndOperationTimestampBetween(visiteurId, startDate, endDate, pageable);
    }

    /**
     * Count operations by type for a specific visiteur.
     */
    public List<Object[]> countOperationsByTypeForVisiteur(Long visiteurId) {
        log.debug("Request to count operations by type for visiteur: {}", visiteurId);
        return visiteurAuditRepository.countOperationsByTypeForVisiteur(visiteurId);
    }

    /**
     * Get the latest audit record for a specific visiteur.
     */
    public VisiteurAudit findLatestAuditForVisiteur(Long visiteurId) {
        log.debug("Request to get latest audit record for visiteur: {}", visiteurId);
        return visiteurAuditRepository.findTopByVisiteurIdOrderByOperationTimestampDesc(visiteurId);
    }

    /**
     * Get audit records for multiple visiteurs.
     */
    public Page<VisiteurAudit> findByVisiteurIds(List<Long> visiteurIds, Pageable pageable) {
        log.debug("Request to get audit records for visiteurs: {}", visiteurIds);
        return visiteurAuditRepository.findByVisiteurIdInOrderByOperationTimestampDesc(visiteurIds, pageable);
    }

    /**
     * Get exit operations (when visiteurs leave).
     */
    public Page<VisiteurAudit> findExitOperations(Pageable pageable) {
        log.debug("Request to get exit operations");
        return visiteurAuditRepository.findExitOperations(pageable);
    }

    /**
     * Count operations by visitor type and operation type.
     */
    public List<Object[]> countOperationsByTypeAndVisitorType() {
        log.debug("Request to count operations by type and visitor type");
        return visiteurAuditRepository.countOperationsByTypeAndVisitorType();
    }

    /**
     * Get total count of audit records.
     */
    public long getTotalAuditCount() {
        log.debug("Request to get total audit count");
        return visiteurAuditRepository.count();
    }

    /**
     * Get audit count for a specific visiteur.
     */
    public long getAuditCountForVisiteur(Long visiteurId) {
        log.debug("Request to get audit count for visiteur: {}", visiteurId);
        return visiteurAuditRepository.findByVisiteurIdOrderByOperationTimestampDesc(visiteurId, Pageable.unpaged()).getTotalElements();
    }
}
