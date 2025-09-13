package com.csys.template.web.rest;

import com.csys.template.service.AuditMigrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing audit migration operations.
 * Provides endpoints to manually trigger audit data migration.
 */
@RestController
@RequestMapping("/api/audit/migration")
public class AuditMigrationController {

    private static final Logger log = LoggerFactory.getLogger(AuditMigrationController.class);

    @Autowired
    private AuditMigrationService auditMigrationService;

    /**
     * POST /api/audit/migration/run : Manually trigger audit migration for existing records.
     */
    @PostMapping("/run")
    public ResponseEntity<String> runMigration() {
        log.debug("REST request to run audit migration manually");
        
        try {
            auditMigrationService.runMigrationManually();
            return ResponseEntity.ok("Audit migration completed successfully");
        } catch (Exception e) {
            log.error("Error running audit migration: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error running audit migration: " + e.getMessage());
        }
    }

    /**
     * GET /api/audit/migration/status : Get migration status information.
     */
    @GetMapping("/status")
    public ResponseEntity<String> getMigrationStatus() {
        log.debug("REST request to get audit migration status");
        return ResponseEntity.ok("Audit migration service is available. Use POST /api/audit/migration/run to trigger migration.");
    }
}
