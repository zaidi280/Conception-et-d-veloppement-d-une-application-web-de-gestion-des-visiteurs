package com.csys.template.domain;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Audit entity to track all operations performed on User entities.
 * Stores complete history of User changes including who made the change and when.
 */
@Entity
@Table(name = "user_audit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "operation_type", nullable = false, length = 10)
    private String operationType; // CREATE, UPDATE, DELETE

    @Column(name = "operation_timestamp", nullable = false)
    private LocalDateTime operationTimestamp;

    @Column(name = "performed_by", nullable = false, length = 100)
    private String performedBy;

    // User fields at the time of operation
    @Column(name = "username", length = 255)
    private String username;

    @Column(name = "role", length = 100)
    private String role;

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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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
