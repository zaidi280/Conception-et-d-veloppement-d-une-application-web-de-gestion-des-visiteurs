package com.csys.template.factory;

import java.util.List;
import java.util.stream.Collectors;

import com.csys.template.domain.Visiteur;
import com.csys.template.dto.VisiteurDTO;

public class VisiteurFactory {
	public static VisiteurDTO entityToDto(Visiteur v) {
        if (v == null) return null;

        VisiteurDTO dto = new VisiteurDTO();
        dto.setId(v.getId());
        dto.setCin(v.getCin());
        dto.setNom(v.getNom());
        dto.setPrenom(v.getPrenom());
        dto.setMatriculeFiscale(v.getMatriculeFiscale());
        dto.setTypeVisiteur(v.getTypeVisiteur());
        dto.setDateEntree(v.getDateEntree());
        dto.setDateSortie(v.getDateSortie());
        dto.setObservation(v.getObservation());
        dto.setDetaille(v.getDetaille());
        dto.setUserEntree(v.getUserEntree());
        dto.setUserSortie(v.getUserSortie());
        return dto;
    }

    public static Visiteur dtoToEntity(VisiteurDTO dto) {
        if (dto == null) return null;

        Visiteur v = new Visiteur();
        v.setId(dto.getId());
        v.setCin(dto.getCin());
        v.setNom(dto.getNom());
        v.setPrenom(dto.getPrenom());
        v.setMatriculeFiscale(dto.getMatriculeFiscale());
        v.setTypeVisiteur(dto.getTypeVisiteur());
        v.setDateEntree(dto.getDateEntree());
        v.setDateSortie(dto.getDateSortie());
        v.setObservation(dto.getObservation());
        v.setDetaille(dto.getDetaille());
        v.setUserEntree(dto.getUserEntree());
        v.setUserSortie(dto.getUserSortie());
        return v;
    }

    public static List<VisiteurDTO> entityToDtos(List<Visiteur> list) {
        return list.stream().map(VisiteurFactory::entityToDto).collect(Collectors.toList());
    }
}
