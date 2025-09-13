import axios from 'axios';
import config from '../config/config';

// Base URL for your Spring Boot backend
const API_BASE_URL = config.API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in requests
api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(config.JWT_STORAGE_KEY);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem(config.JWT_STORAGE_KEY);
      localStorage.removeItem(config.USER_STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class VisiteurService {
  // Get all visiteurs with filters (simplified)
  async getAllVisiteurs(params = {}) {
    try {
      // Clean up undefined parameters
      const cleanParams = {};

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          cleanParams[key] = value;
        }
      });

      console.log('Sending params to backend:', cleanParams); // Debug log

      const response = await api.get('/api/visiteurs', { params: cleanParams });
      return response.data; // Backend returns array directly
    } catch (error) {
      console.error('Error fetching visiteurs:', error);
      console.error('Error response data:', error.response?.data);

      // Get more specific error message
      let errorMessage = 'Erreur lors de la récupération des visiteurs.';

      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }

      throw new Error(errorMessage);
    }
  }

  // Get all visiteurs without pagination
  async getAllVisiteursWithoutPagination() {
    try {
      const response = await api.get('/api/visiteurs/all');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la récupération des visiteurs.'
      );
    }
  }

  // Get visiteur by ID
  async getVisiteurById(id) {
    try {
      const response = await api.get(`/api/visiteurs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la récupération du visiteur.'
      );
    }
  }

  // Create new visiteur
  async createVisiteur(visiteurData) {
    try {
      const response = await api.post('/api/visiteurs/createvis', visiteurData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la création du visiteur.'
      );
    }
  }

  // Update visiteur
  async updateVisiteur(id, visiteurData) {
    try {
      const response = await api.put(`/api/visiteurs/${id}`, visiteurData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la mise à jour du visiteur.'
      );
    }
  }

  // Mark visiteur sortie
  async markSortie(id) {
    try {
      const response = await api.put(`/api/visiteurs/${id}/sortie`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Erreur lors de la sortie du visiteur.'
      );
    }
  }

  // Helper method to format visiteur data for display
  formatVisiteurForDisplay(visiteur) {
    return {
      ...visiteur,
      nomComplet: `${visiteur.prenom || ''} ${visiteur.nom || ''}`.trim(),
      typeVisiteurLabel: this.getTypeVisiteurLabel(visiteur.typeVisiteur)
    };
  }

  // Get type visiteur label
  getTypeVisiteurLabel(type) {
    const types = {
      'VISITEUR_MALADE': 'Visiteur Malade',
      'DOCTEUR': 'Docteur',
      'FOURNISSEUR': 'Fournisseur'
    };
    return types[type] || type;
  }

  // Get available visiteur types (matching backend enum)
  getVisiteurTypes() {
    return [
      { value: 'VISITEUR_MALADE', label: 'Visiteur Malade' },
      { value: 'DOCTEUR', label: 'Docteur' },
      { value: 'FOURNISSEUR', label: 'Fournisseur' }
    ];
  }

  // Validate visiteur data
  validateVisiteurData(data) {
    const errors = {};

    if (!data.cin || data.cin.trim() === '') {
      errors.cin = 'Le CIN est obligatoire';
    } else if (!/^\d{8}$/.test(data.cin.trim())) {
      errors.cin = 'Le CIN doit contenir exactement 8 chiffres';
    }

    if (!data.nom || data.nom.trim() === '') {
      errors.nom = 'Le nom est obligatoire';
    }

    if (!data.prenom || data.prenom.trim() === '') {
      errors.prenom = 'Le prénom est obligatoire';
    }

    if (!data.typeVisiteur || data.typeVisiteur.trim() === '') {
      errors.typeVisiteur = 'Le type de visiteur est obligatoire';
    }

    if (!data.matriculeFiscale || data.matriculeFiscale.trim() === '') {
      errors.matriculeFiscale = 'Le matricule fiscale est obligatoire';
    } else if (!/^\d{7}[A-Za-z]$/.test(data.matriculeFiscale.trim())) {
      errors.matriculeFiscale = 'Le matricule fiscale doit contenir 7 chiffres suivis d\'une lettre (ex: 1234567A)';
    }

    if (data.dateEntree && data.dateSortie) {
      const entree = new Date(data.dateEntree);
      const sortie = new Date(data.dateSortie);
      if (sortie <= entree) {
        errors.dateSortie = 'La date de sortie doit être postérieure à la date d\'entrée';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation
  isValidPhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
  }
}

// Export singleton instance
export const visiteurService = new VisiteurService();
export default visiteurService;
