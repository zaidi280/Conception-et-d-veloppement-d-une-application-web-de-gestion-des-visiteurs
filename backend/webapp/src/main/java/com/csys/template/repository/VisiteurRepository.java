package com.csys.template.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import com.csys.template.domain.Visiteur;

public interface VisiteurRepository extends JpaRepository<Visiteur, Long>, JpaSpecificationExecutor<Visiteur> {
	// Filter by CIN
    Page<Visiteur> findByCinContainingIgnoreCase(String cin, Pageable pageable);

    // Filter by nom or prenom
    Page<Visiteur> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom, Pageable pageable);

    // Filter by typeVisiteur
    Page<Visiteur> findByTypeVisiteurIgnoreCase(String typeVisiteur, Pageable pageable);

    // Example of multiple conditions
    Page<Visiteur> findByCinContainingIgnoreCaseAndTypeVisiteurIgnoreCase(String cin, String typeVisiteur, Pageable pageable);

    /**
     * Find active visiteur (not yet left) with the given CIN
     * @param cin the CIN to search for
     * @return Optional visiteur who has entered but not yet left
     */
    @Query("SELECT v FROM Visiteur v WHERE v.cin = :cin AND v.dateSortie IS NULL")
    Optional<Visiteur> findActiveByCin(@Param("cin") String cin);

    /**
     * Find all visiteurs with the given CIN
     * @param cin the CIN to search for
     * @return List of all visiteurs with this CIN
     */
    List<Visiteur> findByCin(String cin);
}
