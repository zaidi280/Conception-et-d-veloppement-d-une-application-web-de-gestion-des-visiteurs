package com.csys.template.dto;

import com.csys.template.domain.TypeVisiteur;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for VisiteurAudit entity.
 * Used for transferring audit data in API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisiteurAuditDTO {

    private Long auditId;
    private Long visiteurId;
    private String operationType;
    private LocalDateTime operationTimestamp;
    private String performedBy;
    private String cin;
    private String nom;
    private String prenom;
    private String matriculeFiscale;
    private TypeVisiteur typeVisiteur;
    private LocalDateTime dateEntree;
    private LocalDateTime dateSortie;
    private String observation;
    private String detaille;
    private String userEntree;
    private String userSortie;
    private String oldValues;
    private String newValues;
    private String ipAddress;
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
