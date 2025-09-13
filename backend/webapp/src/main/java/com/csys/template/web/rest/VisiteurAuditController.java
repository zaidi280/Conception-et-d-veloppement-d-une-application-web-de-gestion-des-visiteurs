package com.csys.template.web.rest;

import com.csys.template.domain.VisiteurAudit;
import com.csys.template.domain.TypeVisiteur;
import com.csys.template.service.VisiteurAuditService;
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
 * REST controller for managing Visiteur audit operations.
 * Provides endpoints to query audit history for Visiteur entities.
 */
@RestController
@RequestMapping("/api/audit/visiteurs")
public class VisiteurAuditController {

    private static final Logger log = LoggerFactory.getLogger(VisiteurAuditController.class);

    @Autowired
    private VisiteurAuditService visiteurAuditService;

    /**
     * GET /api/audit/visiteurs : Get all visiteur audit records with pagination.
     */
    @GetMapping
    public ResponseEntity<Page<VisiteurAudit>> getAllVisiteurAudits(Pageable pageable) {
        log.debug("REST request to get all VisiteurAudit records");
        Page<VisiteurAudit> page = visiteurAuditService.findAll(pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/visiteurs/{id} : Get a specific visiteur audit record.
     */
    @GetMapping("/{id}")
    public ResponseEntity<VisiteurAudit> getVisiteurAudit(@PathVariable Long id) {
        log.debug("REST request to get VisiteurAudit : {}", id);
        Optional<VisiteurAudit> visiteurAudit = visiteurAuditService.findById(id);
        return visiteurAudit.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/audit/visiteurs/visiteur/{visiteurId} : Get audit history for a specific visiteur.
     */
    @GetMapping("/visiteur/{visiteurId}")
    public ResponseEntity<Page<VisiteurAudit>> getVisiteurAuditHistory(@PathVariable Long visiteurId, Pageable pageable) {
        log.debug("REST request to get audit history for visiteur : {}", visiteurId);
        Page<VisiteurAudit> page = visiteurAuditService.findByVisiteurId(visiteurId, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/visiteurs/operation/{operationType} : Get audit records by operation type.
     */
    @GetMapping("/operation/{operationType}")
    public ResponseEntity<Page<VisiteurAudit>> getVisiteurAuditsByOperation(@PathVariable String operationType, Pageable pageable) {
        log.debug("REST request to get audit records by operation type : {}", operationType);
        Page<VisiteurAudit> page = visiteurAuditService.findByOperationType(operationType, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/visiteurs/performed-by/{performedBy} : Get audit records by performed by user.
     */
    @GetMapping("/performed-by/{performedBy}")
    public ResponseEntity<Page<VisiteurAudit>> getVisiteurAuditsByPerformedBy(@PathVariable String performedBy, Pageable pageable) {
        log.debug("REST request to get audit records performed by : {}", performedBy);
        Page<VisiteurAudit> page = visiteurAuditService.findByPerformedBy(performedBy, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/visiteurs/cin/{cin} : Get audit records by CIN.
     */
    @GetMapping("/cin/{cin}")
    public ResponseEntity<Page<VisiteurAudit>> getVisiteurAuditsByCin(@PathVariable String cin, Pageable pageable) {
        log.debug("REST request to get audit records for CIN : {}", cin);
        Page<VisiteurAudit> page = visiteurAuditService.findByCin(cin, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/visiteurs/type/{typeVisiteur} : Get audit records by visitor type.
     */
    @GetMapping("/type/{typeVisiteur}")
    public ResponseEntity<Page<VisiteurAudit>> getVisiteurAuditsByType(@PathVariable TypeVisiteur typeVisiteur, Pageable pageable) {
        log.debug("REST request to get audit records for visitor type : {}", typeVisiteur);
        Page<VisiteurAudit> page = visiteurAuditService.findByTypeVisiteur(typeVisiteur, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/visiteurs/date-range : Get audit records within a date range.
     */
    @GetMapping("/date-range")
    public ResponseEntity<Page<VisiteurAudit>> getVisiteurAuditsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        log.debug("REST request to get audit records between {} and {}", startDate, endDate);
        Page<VisiteurAudit> page = visiteurAuditService.findByDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/visiteurs/visiteur/{visiteurId}/date-range : Get audit records for a specific visiteur within a date range.
     */
    @GetMapping("/visiteur/{visiteurId}/date-range")
    public ResponseEntity<Page<VisiteurAudit>> getVisiteurAuditsByVisiteurAndDateRange(
            @PathVariable Long visiteurId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        log.debug("REST request to get audit records for visiteur {} between {} and {}", visiteurId, startDate, endDate);
        Page<VisiteurAudit> page = visiteurAuditService.findByVisiteurIdAndDateRange(visiteurId, startDate, endDate, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/visiteurs/visiteur/{visiteurId}/operations-count : Count operations by type for a specific visiteur.
     */
    @GetMapping("/visiteur/{visiteurId}/operations-count")
    public ResponseEntity<List<Object[]>> countOperationsByTypeForVisiteur(@PathVariable Long visiteurId) {
        log.debug("REST request to count operations by type for visiteur : {}", visiteurId);
        List<Object[]> counts = visiteurAuditService.countOperationsByTypeForVisiteur(visiteurId);
        return ResponseEntity.ok(counts);
    }

    /**
     * GET /api/audit/visiteurs/visiteur/{visiteurId}/latest : Get the latest audit record for a specific visiteur.
     */
    @GetMapping("/visiteur/{visiteurId}/latest")
    public ResponseEntity<VisiteurAudit> getLatestVisiteurAudit(@PathVariable Long visiteurId) {
        log.debug("REST request to get latest audit record for visiteur : {}", visiteurId);
        VisiteurAudit latestAudit = visiteurAuditService.findLatestAuditForVisiteur(visiteurId);
        return latestAudit != null ? ResponseEntity.ok(latestAudit) : ResponseEntity.notFound().build();
    }

    /**
     * GET /api/audit/visiteurs/exits : Get exit operations (when visiteurs leave).
     */
    @GetMapping("/exits")
    public ResponseEntity<Page<VisiteurAudit>> getExitOperations(Pageable pageable) {
        log.debug("REST request to get exit operations");
        Page<VisiteurAudit> page = visiteurAuditService.findExitOperations(pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/audit/visiteurs/operations-summary : Count operations by visitor type and operation type.
     */
    @GetMapping("/operations-summary")
    public ResponseEntity<List<Object[]>> countOperationsByTypeAndVisitorType() {
        log.debug("REST request to count operations by type and visitor type");
        List<Object[]> counts = visiteurAuditService.countOperationsByTypeAndVisitorType();
        return ResponseEntity.ok(counts);
    }

    /**
     * GET /api/audit/visiteurs/count : Get total count of audit records.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalAuditCount() {
        log.debug("REST request to get total audit count");
        long count = visiteurAuditService.getTotalAuditCount();
        return ResponseEntity.ok(count);
    }

    /**
     * GET /api/audit/visiteurs/visiteur/{visiteurId}/count : Get audit count for a specific visiteur.
     */
    @GetMapping("/visiteur/{visiteurId}/count")
    public ResponseEntity<Long> getAuditCountForVisiteur(@PathVariable Long visiteurId) {
        log.debug("REST request to get audit count for visiteur : {}", visiteurId);
        long count = visiteurAuditService.getAuditCountForVisiteur(visiteurId);
        return ResponseEntity.ok(count);
    }
}
