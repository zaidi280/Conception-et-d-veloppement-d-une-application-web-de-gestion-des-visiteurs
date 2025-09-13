package com.csys.template.service;

import com.csys.template.domain.User;
import com.csys.template.domain.Visiteur;
import com.csys.template.repository.UserRepository;
import com.csys.template.repository.VisiteurRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service to handle migration of existing data to include audit fields.
 * This runs once when the application starts to populate audit fields for existing records.
 */
@Service
public class AuditMigrationService {

    private static final Logger log = LoggerFactory.getLogger(AuditMigrationService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VisiteurRepository visiteurRepository;

    @Value("${audit.migration.auto-run:false}")
    private boolean autoRunMigration;

    /**
     * Migrate existing records to include audit information.
     * This method runs automatically when the application starts if auto-run is enabled.
     */
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void migrateExistingRecords() {
        if (!autoRunMigration) {
            log.info("Audit migration auto-run is disabled. Use POST /api/audit/migration/run to run manually.");
            return;
        }
        log.info("Starting audit migration for existing records...");
        
        try {
            migrateUsers();
            migrateVisiteurs();
            log.info("Audit migration completed successfully");
        } catch (Exception e) {
            log.error("Error during audit migration: {}", e.getMessage(), e);
        }
    }

    /**
     * Migrate existing User records to include audit fields.
     */
    private void migrateUsers() {
        log.info("Migrating User records...");
        
        List<User> users = userRepository.findAll();
        LocalDateTime migrationTime = LocalDateTime.now();
        int updatedCount = 0;

        for (User user : users) {
            boolean needsUpdate = false;
            
            if (user.getCreatedDate() == null) {
                user.setCreatedDate(migrationTime);
                needsUpdate = true;
            }
            
            if (user.getCreatedBy() == null) {
                user.setCreatedBy("MIGRATION");
                needsUpdate = true;
            }
            
            if (user.getLastModifiedDate() == null) {
                user.setLastModifiedDate(migrationTime);
                needsUpdate = true;
            }
            
            if (user.getLastModifiedBy() == null) {
                user.setLastModifiedBy("MIGRATION");
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                userRepository.save(user);
                updatedCount++;
            }
        }
        
        log.info("Migrated {} User records", updatedCount);
    }

    /**
     * Migrate existing Visiteur records to include audit fields.
     */
    private void migrateVisiteurs() {
        log.info("Migrating Visiteur records...");
        
        List<Visiteur> visiteurs = visiteurRepository.findAll();
        LocalDateTime migrationTime = LocalDateTime.now();
        int updatedCount = 0;

        for (Visiteur visiteur : visiteurs) {
            boolean needsUpdate = false;
            
            if (visiteur.getCreatedDate() == null) {
                // Use dateEntree if available, otherwise use migration time
                LocalDateTime createdDate = visiteur.getDateEntree() != null ? 
                    visiteur.getDateEntree() : migrationTime;
                visiteur.setCreatedDate(createdDate);
                needsUpdate = true;
            }
            
            if (visiteur.getCreatedBy() == null) {
                // Use userEntree if available, otherwise use MIGRATION
                String createdBy = visiteur.getUserEntree() != null ? 
                    visiteur.getUserEntree() : "MIGRATION";
                visiteur.setCreatedBy(createdBy);
                needsUpdate = true;
            }
            
            if (visiteur.getLastModifiedDate() == null) {
                // Use dateSortie if available and after dateEntree, otherwise use migration time
                LocalDateTime lastModified = migrationTime;
                if (visiteur.getDateSortie() != null && 
                    visiteur.getDateEntree() != null && 
                    visiteur.getDateSortie().isAfter(visiteur.getDateEntree())) {
                    lastModified = visiteur.getDateSortie();
                }
                visiteur.setLastModifiedDate(lastModified);
                needsUpdate = true;
            }
            
            if (visiteur.getLastModifiedBy() == null) {
                // Use userSortie if available, otherwise use userEntree, otherwise use MIGRATION
                String lastModifiedBy = "MIGRATION";
                if (visiteur.getUserSortie() != null) {
                    lastModifiedBy = visiteur.getUserSortie();
                } else if (visiteur.getUserEntree() != null) {
                    lastModifiedBy = visiteur.getUserEntree();
                }
                visiteur.setLastModifiedBy(lastModifiedBy);
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                visiteurRepository.save(visiteur);
                updatedCount++;
            }
        }
        
        log.info("Migrated {} Visiteur records", updatedCount);
    }

    /**
     * Manual method to re-run migration if needed.
     * Can be called via a REST endpoint if necessary.
     */
    @Transactional
    public void runMigrationManually() {
        log.info("Running manual audit migration...");
        migrateExistingRecords();
    }
}
