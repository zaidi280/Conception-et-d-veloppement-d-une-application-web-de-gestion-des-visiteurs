package com.csys.template.audit;

import com.csys.template.domain.User;
import com.csys.template.domain.UserAudit;
import com.csys.template.domain.Visiteur;
import com.csys.template.domain.VisiteurAudit;
import com.csys.template.repository.UserAuditRepository;
import com.csys.template.repository.VisiteurAuditRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.persistence.*;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

/**
 * JPA Entity Listener for auditing User and Visiteur entities.
 * Automatically captures audit information when entities are created, updated, or deleted.
 */
@Component
public class AuditEntityListener {

    private static UserAuditRepository userAuditRepository;
    private static VisiteurAuditRepository visiteurAuditRepository;
    private static ObjectMapper objectMapper;

    @Autowired
    public void setUserAuditRepository(UserAuditRepository userAuditRepository) {
        AuditEntityListener.userAuditRepository = userAuditRepository;
    }

    @Autowired
    public void setVisiteurAuditRepository(VisiteurAuditRepository visiteurAuditRepository) {
        AuditEntityListener.visiteurAuditRepository = visiteurAuditRepository;
    }

    @Autowired
    @Qualifier("auditObjectMapper")
    public void setObjectMapper(ObjectMapper objectMapper) {
        AuditEntityListener.objectMapper = objectMapper;
    }

    @PostPersist
    public void postPersist(Object entity) {
        if (entity instanceof User) {
            createUserAudit((User) entity, "CREATE", null);
        } else if (entity instanceof Visiteur) {
            createVisiteurAudit((Visiteur) entity, "CREATE", null);
        }
    }

    @PostUpdate
    public void postUpdate(Object entity) {
        if (entity instanceof User) {
            createUserAudit((User) entity, "UPDATE", null);
        } else if (entity instanceof Visiteur) {
            createVisiteurAudit((Visiteur) entity, "UPDATE", null);
        }
    }

    @PostRemove
    public void postRemove(Object entity) {
        if (entity instanceof User) {
            createUserAudit((User) entity, "DELETE", null);
        } else if (entity instanceof Visiteur) {
            createVisiteurAudit((Visiteur) entity, "DELETE", null);
        }
    }

    private void createUserAudit(User user, String operationType, User oldUser) {
        if (userAuditRepository == null) return;

        try {
            UserAudit audit = new UserAudit();
            audit.setUserId(user.getId());
            audit.setOperationType(operationType);
            audit.setOperationTimestamp(LocalDateTime.now());
            audit.setPerformedBy(getCurrentUser());
            audit.setUsername(user.getUsername());
            audit.setRole(user.getRole());
            audit.setNewValues(entityToJson(user));
            audit.setOldValues(oldUser != null ? entityToJson(oldUser) : null);
            audit.setIpAddress(getClientIpAddress());
            audit.setUserAgent(getUserAgent());

            userAuditRepository.save(audit);
        } catch (Exception e) {
            // Log error but don't fail the main operation
            System.err.println("Error creating user audit: " + e.getMessage());
        }
    }

    private void createVisiteurAudit(Visiteur visiteur, String operationType, Visiteur oldVisiteur) {
        if (visiteurAuditRepository == null) return;

        try {
            VisiteurAudit audit = new VisiteurAudit();
            audit.setVisiteurId(visiteur.getId());
            audit.setOperationType(operationType);
            audit.setOperationTimestamp(LocalDateTime.now());
            audit.setPerformedBy(getCurrentUser());
            audit.setCin(visiteur.getCin());
            audit.setNom(visiteur.getNom());
            audit.setPrenom(visiteur.getPrenom());
            audit.setMatriculeFiscale(visiteur.getMatriculeFiscale());
            audit.setTypeVisiteur(visiteur.getTypeVisiteur());
            audit.setDateEntree(visiteur.getDateEntree());
            audit.setDateSortie(visiteur.getDateSortie());
            audit.setObservation(visiteur.getObservation());
            audit.setDetaille(visiteur.getDetaille());
            audit.setUserEntree(visiteur.getUserEntree());
            audit.setUserSortie(visiteur.getUserSortie());
            audit.setNewValues(entityToJson(visiteur));
            audit.setOldValues(oldVisiteur != null ? entityToJson(oldVisiteur) : null);
            audit.setIpAddress(getClientIpAddress());
            audit.setUserAgent(getUserAgent());

            visiteurAuditRepository.save(audit);
        } catch (Exception e) {
            // Log error but don't fail the main operation
            System.err.println("Error creating visiteur audit: " + e.getMessage());
        }
    }

    private String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            "anonymousUser".equals(authentication.getPrincipal())) {
            return "SYSTEM";
        }
        return authentication.getName();
    }

    private String getClientIpAddress() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            // Ignore
        }
        return "UNKNOWN";
    }

    private String getUserAgent() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                return request.getHeader("User-Agent");
            }
        } catch (Exception e) {
            // Ignore
        }
        return "UNKNOWN";
    }

    private String entityToJson(Object entity) {
        try {
            if (objectMapper != null) {
                return objectMapper.writeValueAsString(entity);
            }
        } catch (JsonProcessingException e) {
            // Ignore
        }
        return entity.toString();
    }
}
