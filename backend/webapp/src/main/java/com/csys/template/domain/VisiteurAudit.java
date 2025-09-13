package com.csys.template.domain;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Audit entity to track all operations performed on Visiteur entities.
 * Stores complete history of Visiteur changes including who made the change and when.
 */
@Entity
@Table(name = "visiteur_audit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisiteurAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditId;

    @Column(name = "visiteur_id", nullable = false)
    private Long visiteurId;

    @Column(name = "operation_type", nullable = false, length = 10)
    private String operationType; // CREATE, UPDATE, DELETE

    @Column(name = "operation_timestamp", nullable = false)
    private LocalDateTime operationTimestamp;

    @Column(name = "performed_by", nullable = false, length = 100)
    private String performedBy;

    // Visiteur fields at the time of operation
    @Column(name = "cin", length = 15)
    private String cin;

    @Column(name = "nom", length = 100)
    private String nom;

    @Column(name = "prenom", length = 100)
    private String prenom;

    @Column(name = "matricule_fiscale", length = 50)
    private String matriculeFiscale;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_visiteur")
    private TypeVisiteur typeVisiteur;

    @Column(name = "date_entree")
    private LocalDateTime dateEntree;

    @Column(name = "date_sortie")
    private LocalDateTime dateSortie;

    @Column(name = "observation", length = 500)
    private String observation;

    @Column(name = "detaille", length = 300)
    private String detaille;

    @Column(name = "user_entree", length = 100)
    private String userEntree;

    @Column(name = "user_sortie", length = 100)
    private String userSortie;

    // Additional audit information
    @Column(name = "old_values", columnDefinition = "TEXT")
    private String oldValues; // JSON string of old values for UPDATE operations

    @Column(name = "new_values", columnDefinition = "TEXT")
    private String newValues; // JSON string of new values for CREATE/UPDATE operations

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    // Getters and Setters
    public Long getAuditId() {
        return auditId;
    }

    public void setAuditId(Long auditId) {
        this.auditId = auditId;
    }

    public Long getVisiteurId() {
        return visiteurId;
    }

    public void setVisiteurId(Long visiteurId) {
        this.visiteurId = visiteurId;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public LocalDateTime getOperationTimestamp() {
        return operationTimestamp;
    }

    public void setOperationTimestamp(LocalDateTime operationTimestamp) {
        this.operationTimestamp = operationTimestamp;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getMatriculeFiscale() {
        return matriculeFiscale;
    }

    public void setMatriculeFiscale(String matriculeFiscale) {
        this.matriculeFiscale = matriculeFiscale;
    }

    public TypeVisiteur getTypeVisiteur() {
        return typeVisiteur;
    }

    public void setTypeVisiteur(TypeVisiteur typeVisiteur) {
        this.typeVisiteur = typeVisiteur;
    }

    public LocalDateTime getDateEntree() {
        return dateEntree;
    }

    public void setDateEntree(LocalDateTime dateEntree) {
        this.dateEntree = dateEntree;
    }

    public LocalDateTime getDateSortie() {
        return dateSortie;
    }

    public void setDateSortie(LocalDateTime dateSortie) {
        this.dateSortie = dateSortie;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public String getDetaille() {
        return detaille;
    }

    public void setDetaille(String detaille) {
        this.detaille = detaille;
    }

    public String getUserEntree() {
        return userEntree;
    }

    public void setUserEntree(String userEntree) {
        this.userEntree = userEntree;
    }

    public String getUserSortie() {
        return userSortie;
    }

    public void setUserSortie(String userSortie) {
        this.userSortie = userSortie;
    }

    public String getOldValues() {
        return oldValues;
    }

    public void setOldValues(String oldValues) {
        this.oldValues = oldValues;
    }

    public String getNewValues() {
        return newValues;
    }

    public void setNewValues(String newValues) {
        this.newValues = newValues;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}
