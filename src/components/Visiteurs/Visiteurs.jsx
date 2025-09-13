import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import VisiteursTable from './VisiteursTable';
import VisiteurDialog from './VisiteurDialog';
import VisiteurDetailsDialog from './VisiteurDetailsDialog';
import VisiteurFilters from './VisiteurFilters';
import { visiteurService } from '../../services/visiteurService';
import { useDateRange } from '../../contexts/DateRangeContext';
import Swal from 'sweetalert2';

const Visiteurs = () => {
  const { dateFrom, dateTo, updateDateRange } = useDateRange();
  const [visiteurs, setVisiteurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedVisiteur, setSelectedVisiteur] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [viewingVisiteur, setViewingVisiteur] = useState(null);

  // Filtering state using context date range
  const [filters, setFilters] = useState({
    filterType: 'tous', // 'entree', 'sortie', 'tous'
    dateFrom: dateFrom,
    dateTo: dateTo
  });

  // Load visiteurs data
  const loadVisiteurs = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        filterType: filters.filterType,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined
      };

      console.log('Loading visiteurs with params:', params); // Debug log

      const response = await visiteurService.getAllVisiteurs(params);

      console.log('Backend response:', response); // Debug log

      // Backend returns array directly, show all results
      setVisiteurs(response);
    } catch (err) {
      console.error('Error loading visiteurs:', err);
      setError('Erreur lors du chargement des visiteurs: ' + (err.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    loadVisiteurs();
  }, [filters]);

  // Sync filters with context when context changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      dateFrom: dateFrom,
      dateTo: dateTo
    }));
  }, [dateFrom, dateTo]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // Update the context if date range changed
    if (newFilters.dateFrom || newFilters.dateTo) {
      updateDateRange(
        newFilters.dateFrom || dateFrom,
        newFilters.dateTo || dateTo
      );
    }
  };



  // Dialog handlers
  const handleCreateVisiteur = () => {
    setSelectedVisiteur(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEditVisiteur = (visiteur) => {
    setSelectedVisiteur(visiteur);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleViewDetails = (visiteur) => {
    setViewingVisiteur(visiteur);
    setDetailsDialogOpen(true);
  };

  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false);
    setViewingVisiteur(null);
  };



  const handleSortieVisiteur = async (visiteurId) => {
    // Find the visiteur to get their name for the confirmation
    const visiteur = visiteurs.find(v => v.id === visiteurId);
    const visiteurName = visiteur ? `${visiteur.prenom} ${visiteur.nom}` : 'ce visiteur';

    const result = await Swal.fire({
      title: 'Confirmer la sortie',
      text: `Êtes-vous sûr de vouloir marquer la sortie de ${visiteurName} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, marquer sortie',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
      customClass: {
        popup: 'military-swal-popup',
        title: 'military-swal-title',
        content: 'military-swal-content',
        confirmButton: 'military-swal-confirm',
        cancelButton: 'military-swal-cancel'
      }
    });

    if (result.isConfirmed) {
      try {
        await visiteurService.markSortie(visiteurId);

        // Success message
        await Swal.fire({
          title: 'Sortie Marquée !',
          text: `La sortie de ${visiteurName} a été enregistrée avec succès.`,
          iconHtml: '<i class="fas fa-check-circle" style="color: #28a745; font-size: 3rem;"></i>',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'military-swal-popup',
            title: 'military-swal-title',
            content: 'military-swal-content',
            confirmButton: 'military-swal-success'
          }
        });

        loadVisiteurs(); // Reload data
      } catch (err) {
        // Error message
        await Swal.fire({
          title: 'Erreur !',
          text: 'Erreur lors de la sortie: ' + (err.message || 'Erreur inconnue'),
          icon: 'error',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'military-swal-popup',
            title: 'military-swal-title',
            content: 'military-swal-content',
            confirmButton: 'military-swal-confirm'
          }
        });
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedVisiteur(null);
  };

  const handleDialogSave = async (visiteurData) => {
    try {
      let successMessage = '';
      let visiteurName = `${visiteurData.prenom} ${visiteurData.nom}`;

      if (dialogMode === 'create') {
        await visiteurService.createVisiteur(visiteurData);
        successMessage = `${visiteurName} a été ajouté avec succès.`;
      } else if (dialogMode === 'edit') {
        await visiteurService.updateVisiteur(selectedVisiteur.id, visiteurData);
        successMessage = `${visiteurName} a été modifié avec succès.`;
      }

      setDialogOpen(false);
      setSelectedVisiteur(null);

      // Success message
      await Swal.fire({
        title: dialogMode === 'create' ? 'Visiteur Ajouté !' : 'Visiteur Modifié !',
        text: successMessage,
        iconHtml: '<i class="fas fa-check-circle" style="color: #28a745; font-size: 3rem;"></i>',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'military-swal-popup',
          title: 'military-swal-title',
          content: 'military-swal-content',
          confirmButton: 'military-swal-success'
        }
      });

      loadVisiteurs(); // Reload data
    } catch (err) {
      // Error message
      await Swal.fire({
        title: 'Erreur !',
        text: 'Erreur lors de la sauvegarde: ' + (err.message || 'Erreur inconnue'),
        icon: 'error',
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'military-swal-popup',
          title: 'military-swal-title',
          content: 'military-swal-content',
          confirmButton: 'military-swal-confirm'
        }
      });
    }
  };

  // Styles
  const containerStyle = {
    padding: '10px',
    backgroundColor: '#f8f9fa',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '10px 15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    flexShrink: 0
  };

  const contentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    gap: '8px'
  };

  const filtersStyle = {
    flexShrink: 0
  };

  const tableContainerStyle = {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyle = {
    color: '#1a3d1f',
    fontSize: '1.4rem',
    fontWeight: '700',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const addButtonStyle = {
    background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(44, 85, 48, 0.3)'
  };

  const errorStyle = {
    background: 'rgba(220, 53, 69, 0.1)',
    border: '1px solid rgba(220, 53, 69, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '20px',
    color: '#721c24',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <Layout>
      {/* Custom SweetAlert2 Styles */}
      <style>
        {`
          .military-swal-popup {
            border-radius: 15px !important;
            box-shadow: 0 20px 40px rgba(44, 85, 48, 0.3) !important;
          }

          .military-swal-title {
            color: #1a3d1f !important;
            font-weight: 700 !important;
            font-size: 1.5rem !important;
          }

          .military-swal-content {
            color: #6c757d !important;
            font-size: 1rem !important;
          }

          .military-swal-confirm {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            padding: 10px 20px !important;
            transition: all 0.3s ease !important;
          }

          .military-swal-confirm:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3) !important;
          }

          .military-swal-cancel {
            background: #6c757d !important;
            border: none !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            padding: 10px 20px !important;
            transition: all 0.3s ease !important;
          }

          .military-swal-cancel:hover {
            background: #5a6268 !important;
            transform: translateY(-1px) !important;
          }

          .military-swal-success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            padding: 10px 20px !important;
            transition: all 0.3s ease !important;
          }

          .military-swal-success:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3) !important;
          }

          .swal2-icon.swal2-success {
            border-color: #28a745 !important;
            color: #28a745 !important;
          }

          .swal2-icon.swal2-success [class^=swal2-success-line] {
            background-color: #28a745 !important;
          }

          .swal2-icon.swal2-success .swal2-success-line-tip {
            background-color: #28a745 !important;
          }

          .swal2-icon.swal2-success .swal2-success-line-long {
            background-color: #28a745 !important;
          }

          .swal2-icon.swal2-success .swal2-success-ring {
            border-color: #28a745 !important;
          }

          .swal2-icon.swal2-success .swal2-success-fix {
            background-color: #28a745 !important;
          }
        `}
      </style>

      <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          <i className="fas fa-users"></i>
          Gestion des Visiteurs
        </h1>
        <button
          style={addButtonStyle}
          onClick={handleCreateVisiteur}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(44, 85, 48, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(44, 85, 48, 0.3)';
          }}
        >
          <i className="fas fa-plus"></i>
          Nouveau Visiteur
        </button>
      </div>

        <div style={contentStyle}>
          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid #f5c6cb',
              flexShrink: 0
            }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
              {error}
            </div>
          )}

          {/* Filters */}
          <div style={filtersStyle}>
            <VisiteurFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Table */}
          <div style={tableContainerStyle}>
            <VisiteursTable
              visiteurs={visiteurs}
              loading={loading}
              onEdit={handleEditVisiteur}
              onSortie={handleSortieVisiteur}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>

      {/* Dialog */}
      <VisiteurDialog
        open={dialogOpen}
        mode={dialogMode}
        visiteur={selectedVisiteur}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />

      {/* Details Dialog */}
      <VisiteurDetailsDialog
        visiteur={viewingVisiteur}
        isOpen={detailsDialogOpen}
        onClose={handleDetailsDialogClose}
      />
      </div>
    </Layout>
  );
};

export default Visiteurs;
