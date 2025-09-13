# JPA Audit Implementation Documentation

## Overview

This document describes the comprehensive JPA auditing system implemented for tracking all operations on User and Visiteur entities. The audit system automatically captures who performed what action, when it was performed, and provides detailed change history.

## Features

### 1. Automatic Audit Tracking
- **Creation**: Tracks when entities are created, by whom, and with what values
- **Updates**: Tracks modifications with before/after values
- **Deletions**: Records when entities are deleted and by whom
- **Timestamps**: All operations are timestamped with precise LocalDateTime
- **User Tracking**: Captures the authenticated user performing each operation
- **IP Address & User Agent**: Records client information for security auditing

### 2. Comprehensive Change History
- **Old Values**: JSON representation of entity state before changes
- **New Values**: JSON representation of entity state after changes
- **Field-Level Tracking**: Individual field changes are captured
- **Audit Trail**: Complete chronological history of all operations

## Architecture

### Core Components

#### 1. Base Auditable Entity
```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditableEntity
```
- Provides common audit fields: `createdDate`, `lastModifiedDate`, `createdBy`, `lastModifiedBy`
- Automatically populated by Spring Data JPA auditing

#### 2. Audit Entities
- **UserAudit**: Tracks all operations on User entities
- **VisiteurAudit**: Tracks all operations on Visiteur entities

#### 3. Audit Configuration
- **AuditConfig**: Configures JPA auditing and provides current user context
- **AuditEntityListener**: Custom entity listener for detailed audit capture

#### 4. Repositories
- **UserAuditRepository**: Query interface for User audit records
- **VisiteurAuditRepository**: Query interface for Visiteur audit records

#### 5. Services
- **UserAuditService**: Business logic for User audit operations
- **VisiteurAuditService**: Business logic for Visiteur audit operations

#### 6. REST Controllers
- **UserAuditController**: REST endpoints for User audit queries
- **VisiteurAuditController**: REST endpoints for Visiteur audit queries

## Database Schema

### Audit Tables

#### user_audit Table
```sql
- audit_id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (BIGINT, NOT NULL)
- operation_type (VARCHAR(10), NOT NULL) -- CREATE, UPDATE, DELETE
- operation_timestamp (DATETIME, NOT NULL)
- performed_by (VARCHAR(100), NOT NULL)
- username (VARCHAR(255))
- role (VARCHAR(100))
- old_values (TEXT) -- JSON string of old values
- new_values (TEXT) -- JSON string of new values
- ip_address (VARCHAR(45))
- user_agent (VARCHAR(500))
```

#### visiteur_audit Table
```sql
- audit_id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- visiteur_id (BIGINT, NOT NULL)
- operation_type (VARCHAR(10), NOT NULL) -- CREATE, UPDATE, DELETE
- operation_timestamp (DATETIME, NOT NULL)
- performed_by (VARCHAR(100), NOT NULL)
- cin (VARCHAR(15))
- nom (VARCHAR(100))
- prenom (VARCHAR(100))
- matricule_fiscale (VARCHAR(50))
- type_visiteur (VARCHAR(50))
- date_entree (DATETIME)
- date_sortie (DATETIME)
- observation (VARCHAR(500))
- detaille (VARCHAR(300))
- user_entree (VARCHAR(100))
- user_sortie (VARCHAR(100))
- old_values (TEXT) -- JSON string of old values
- new_values (TEXT) -- JSON string of new values
- ip_address (VARCHAR(45))
- user_agent (VARCHAR(500))
```

#### Enhanced Entity Tables
Both `users` and `visiteur` tables now include:
```sql
- created_date (DATETIME, NOT NULL)
- last_modified_date (DATETIME)
- created_by (VARCHAR(100))
- last_modified_by (VARCHAR(100))
```

## API Endpoints

### User Audit Endpoints

#### Base URL: `/api/audit/users`

- `GET /` - Get all user audit records (paginated)
- `GET /{id}` - Get specific audit record by ID
- `GET /user/{userId}` - Get audit history for specific user
- `GET /operation/{operationType}` - Get audits by operation type (CREATE/UPDATE/DELETE)
- `GET /performed-by/{performedBy}` - Get audits by user who performed the action
- `GET /date-range?startDate={start}&endDate={end}` - Get audits within date range
- `GET /user/{userId}/date-range?startDate={start}&endDate={end}` - Get user audits within date range
- `GET /user/{userId}/operations-count` - Count operations by type for user
- `GET /user/{userId}/latest` - Get latest audit record for user
- `GET /count` - Get total audit count
- `GET /user/{userId}/count` - Get audit count for specific user

### Visiteur Audit Endpoints

#### Base URL: `/api/audit/visiteurs`

- `GET /` - Get all visiteur audit records (paginated)
- `GET /{id}` - Get specific audit record by ID
- `GET /visiteur/{visiteurId}` - Get audit history for specific visiteur
- `GET /operation/{operationType}` - Get audits by operation type
- `GET /performed-by/{performedBy}` - Get audits by user who performed the action
- `GET /cin/{cin}` - Get audits by CIN
- `GET /type/{typeVisiteur}` - Get audits by visitor type
- `GET /date-range?startDate={start}&endDate={end}` - Get audits within date range
- `GET /visiteur/{visiteurId}/date-range?startDate={start}&endDate={end}` - Get visiteur audits within date range
- `GET /visiteur/{visiteurId}/operations-count` - Count operations by type for visiteur
- `GET /visiteur/{visiteurId}/latest` - Get latest audit record for visiteur
- `GET /exits` - Get exit operations (when visiteurs leave)
- `GET /operations-summary` - Count operations by visitor type and operation type
- `GET /count` - Get total audit count
- `GET /visiteur/{visiteurId}/count` - Get audit count for specific visiteur

## Usage Examples

### Query User Audit History
```bash
GET /api/audit/users/user/1?page=0&size=10&sort=operationTimestamp,desc
```

### Query Visiteur Operations by Date Range
```bash
GET /api/audit/visiteurs/date-range?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59&page=0&size=20
```

### Get Exit Operations
```bash
GET /api/audit/visiteurs/exits?page=0&size=10
```

## Security Considerations

1. **Authentication Required**: All audit endpoints require authentication
2. **User Context**: Audit records capture the authenticated user performing operations
3. **IP Tracking**: Client IP addresses are recorded for security analysis
4. **Immutable Records**: Audit records should never be modified or deleted
5. **Data Privacy**: Sensitive information in old/new values should be handled carefully

## Performance Considerations

1. **Indexing**: Consider adding indexes on frequently queried fields:
   - `operation_timestamp`
   - `user_id` / `visiteur_id`
   - `performed_by`
   - `operation_type`

2. **Archiving**: Implement archiving strategy for old audit records
3. **Pagination**: All endpoints support pagination to handle large datasets
4. **Async Processing**: Consider async audit processing for high-volume operations

## Monitoring and Maintenance

1. **Log Monitoring**: Monitor audit creation failures
2. **Storage Growth**: Monitor audit table growth
3. **Performance**: Monitor query performance on audit tables
4. **Data Retention**: Implement data retention policies as needed

## Configuration

The audit system is automatically enabled through:
- `@EnableJpaAuditing(auditorAwareRef = "auditorProvider")` in WebappApplication
- Entity listeners configured on User and Visiteur entities
- Automatic dependency injection of audit repositories and services
