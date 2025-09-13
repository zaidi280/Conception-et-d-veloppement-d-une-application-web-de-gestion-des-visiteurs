package com.csys.template.repository;

import com.csys.template.domain.VisiteurAudit;
import com.csys.template.domain.TypeVisiteur;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for VisiteurAudit entity.
 * Provides methods to query audit history for Visiteur entities.
 */
@Repository
public interface VisiteurAuditRepository extends JpaRepository<VisiteurAudit, Long> {

    /**
     * Find all audit records for a specific visiteur ID, ordered by operation timestamp descending.
     */
    Page<VisiteurAudit> findByVisiteurIdOrderByOperationTimestampDesc(Long visiteurId, Pageable pageable);

    /**
     * Find audit records by operation type.
     */
    Page<VisiteurAudit> findByOperationTypeOrderByOperationTimestampDesc(String operationType, Pageable pageable);

    /**
     * Find audit records by performed by user.
     */
    Page<VisiteurAudit> findByPerformedByOrderByOperationTimestampDesc(String performedBy, Pageable pageable);

    /**
     * Find audit records by CIN.
     */
    Page<VisiteurAudit> findByCinOrderByOperationTimestampDesc(String cin, Pageable pageable);

    /**
     * Find audit records by visitor type.
     */
    Page<VisiteurAudit> findByTypeVisiteurOrderByOperationTimestampDesc(TypeVisiteur typeVisiteur, Pageable pageable);

    /**
     * Find audit records within a date range.
     */
    @Query("SELECT va FROM VisiteurAudit va WHERE va.operationTimestamp BETWEEN :startDate AND :endDate ORDER BY va.operationTimestamp DESC")
    Page<VisiteurAudit> findByOperationTimestampBetween(@Param("startDate") LocalDateTime startDate, 
                                                       @Param("endDate") LocalDateTime endDate, 
                                                       Pageable pageable);

    /**
     * Find audit records for a specific visiteur within a date range.
     */
    @Query("SELECT va FROM VisiteurAudit va WHERE va.visiteurId = :visiteurId AND va.operationTimestamp BETWEEN :startDate AND :endDate ORDER BY va.operationTimestamp DESC")
    Page<VisiteurAudit> findByVisiteurIdAndOperationTimestampBetween(@Param("visiteurId") Long visiteurId,
                                                                    @Param("startDate") LocalDateTime startDate,
                                                                    @Param("endDate") LocalDateTime endDate,
                                                                    Pageable pageable);

    /**
     * Count operations by type for a specific visiteur.
     */
    @Query("SELECT va.operationType, COUNT(va) FROM VisiteurAudit va WHERE va.visiteurId = :visiteurId GROUP BY va.operationType")
    List<Object[]> countOperationsByTypeForVisiteur(@Param("visiteurId") Long visiteurId);

    /**
     * Find the latest audit record for a specific visiteur.
     */
    VisiteurAudit findTopByVisiteurIdOrderByOperationTimestampDesc(Long visiteurId);

    /**
     * Find all audit records for multiple visiteurs.
     */
    Page<VisiteurAudit> findByVisiteurIdInOrderByOperationTimestampDesc(List<Long> visiteurIds, Pageable pageable);

    /**
     * Find audit records by entry/exit operations.
     */
    @Query("SELECT va FROM VisiteurAudit va WHERE va.operationType = 'UPDATE' AND (va.oldValues LIKE '%dateSortie\":null%' AND va.newValues NOT LIKE '%dateSortie\":null%') ORDER BY va.operationTimestamp DESC")
    Page<VisiteurAudit> findExitOperations(Pageable pageable);

    /**
     * Count audit records by visitor type and operation type.
     */
    @Query("SELECT va.typeVisiteur, va.operationType, COUNT(va) FROM VisiteurAudit va GROUP BY va.typeVisiteur, va.operationType")
    List<Object[]> countOperationsByTypeAndVisitorType();
}
