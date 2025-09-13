package com.csys.template.dto;

import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.csys.template.domain.TypeVisiteur;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisiteurDTO {
    private Long id;

	    @NotNull
	    @Size(min = 1, max = 15)
	    private String cin;

	    @NotNull
	    @Size(min = 1, max = 30)
	    private String nom;

	    @NotNull
	    @Size(min = 1, max = 30)
	    private String prenom;

	    @NotBlank(message = "MatriculeFiscale is required")
	    @Size(max = 50)
	    private String matriculeFiscale;

	    private TypeVisiteur typeVisiteur;

	    private LocalDateTime dateEntree;

	    private LocalDateTime dateSortie;

	    @Size(max = 500)
	    private String observation;

	    @Size(max = 300)
	    private String detaille;

	    @Size(max = 100)
	    private String userEntree;

	    @Size(max = 100)
	    private String userSortie;

    // Default constructor
    public VisiteurDTO() {
        super();
    }

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
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

}
