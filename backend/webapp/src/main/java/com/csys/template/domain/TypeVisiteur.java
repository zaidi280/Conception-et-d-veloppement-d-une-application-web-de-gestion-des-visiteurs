package com.csys.template.domain;

/**
 * Enumeration for visitor types
 */
public enum TypeVisiteur {
    VISITEUR_MALADE("visiteurMalade"),
    DOCTEUR("docteur"),
    FOURNISSEUR("fournisseur");

    private final String value;

    TypeVisiteur(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }

    /**
     * Get enum from string value (case-insensitive)
     */
    public static TypeVisiteur fromValue(String value) {
        if (value == null) {
            return null;
        }
        
        for (TypeVisiteur type : TypeVisiteur.values()) {
            if (type.value.equalsIgnoreCase(value.trim())) {
                return type;
            }
        }
        
        throw new IllegalArgumentException("Invalid TypeVisiteur value: " + value + 
            ". Valid values are: visiteurMalade, docteur, fournisseur");
    }
}
