package com.csys.template.domain;
import javax.persistence.*;

import com.csys.template.audit.AuditEntityListener;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@EntityListeners({AuditingEntityListener.class, AuditEntityListener.class})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visiteur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cin;

    private String nom;
    private String prenom;

    @Column(name = "matricule_fiscale")
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
    private String detaille; // Type-specific details: where doctor is going, what supplier is delivering, patient reason

    @Column(name = "user_entree", length = 100)
    private String userEntree; // User who added the entry

    @Column(name = "user_sortie", length = 100)
    private String userSortie; // User who marked the exit

    // Audit fields
    @CreatedDate
    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @CreatedBy
    @Column(name = "created_by", length = 100)
    private String createdBy;

    @LastModifiedBy
    @Column(name = "last_modified_by", length = 100)
    private String lastModifiedBy;


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getMatriculeFiscale() { return matriculeFiscale; }
    public void setMatriculeFiscale(String matriculeFiscale) { this.matriculeFiscale = matriculeFiscale; }

    public TypeVisiteur getTypeVisiteur() { return typeVisiteur; }
    public void setTypeVisiteur(TypeVisiteur typeVisiteur) { this.typeVisiteur = typeVisiteur; }

    public LocalDateTime getDateEntree() { return dateEntree; }
    public void setDateEntree(LocalDateTime dateEntree) { this.dateEntree = dateEntree; }

    public LocalDateTime getDateSortie() { return dateSortie; }
    public void setDateSortie(LocalDateTime dateSortie) { this.dateSortie = dateSortie; }

    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }

    public String getDetaille() { return detaille; }
    public void setDetaille(String detaille) { this.detaille = detaille; }

    public String getUserEntree() { return userEntree; }
    public void setUserEntree(String userEntree) { this.userEntree = userEntree; }

    public String getUserSortie() { return userSortie; }
    public void setUserSortie(String userSortie) { this.userSortie = userSortie; }

    // Audit field getters and setters
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
}
