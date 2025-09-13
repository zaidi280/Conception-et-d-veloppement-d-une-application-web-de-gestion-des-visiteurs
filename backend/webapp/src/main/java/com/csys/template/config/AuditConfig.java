package com.csys.template.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * Configuration class for JPA auditing.
 * Provides the current authenticated user for audit fields.
 */
@Configuration
public class AuditConfig {

    /**
     * Bean that provides the current auditor (authenticated user) for JPA auditing.
     * This will be used to populate @CreatedBy and @LastModifiedBy fields.
     */
    @Bean("auditorProvider")
    public AuditorAware<String> auditorProvider() {
        return new AuditorAware<String>() {
            @Override
            public Optional<String> getCurrentAuditor() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                if (authentication == null || !authentication.isAuthenticated() ||
                    "anonymousUser".equals(authentication.getPrincipal())) {
                    return Optional.of("SYSTEM");
                }

                return Optional.of(authentication.getName());
            }
        };
    }

    /**
     * ObjectMapper bean for JSON serialization in audit operations.
     * Configured to handle Java 8 time types properly.
     */
    @Bean("auditObjectMapper")
    public ObjectMapper auditObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
}
