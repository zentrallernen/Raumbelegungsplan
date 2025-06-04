import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './TherapistList.css';

const TherapistList = () => {
  const { therapists, deleteTherapist } = useAppContext();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [therapistToDelete, setTherapistToDelete] = useState(null);

  const handleDelete = (id) => {
    setTherapistToDelete(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    deleteTherapist(therapistToDelete);
    setShowConfirmation(false);
    setTherapistToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setTherapistToDelete(null);
  };

  return (
    <div className="therapist-list-container">
      <div className="page-header">
        <h1 className="page-title">Therapeuten</h1>
        <Link to="/therapists/new" className="btn">
          <FaPlus className="mr-1" /> Neuer Therapeut
        </Link>
      </div>

      {therapists.length === 0 ? (
        <div className="card">
          <p>Keine Therapeuten vorhanden.</p>
          <Link to="/therapists/new" className="btn mt-2">
            Therapeut anlegen
          </Link>
        </div>
      ) : (
        <div className="therapist-list">
          {therapists.map(therapist => (
            <div className="therapist-list-item" key={therapist.id}>
              <div className="therapist-list-content">
                <h2 className="therapist-name">{therapist.name}</h2>
                <p className="therapist-specialty">{therapist.specialty}</p>
                <div className="therapist-contact">
                  <div className="contact-item">
                    <strong>Email:</strong> {therapist.email}
                  </div>
                  <div className="contact-item">
                    <strong>Telefon:</strong> {therapist.phone}
                  </div>
                </div>
              </div>
              <div className="therapist-list-actions">
                <Link to={`/therapists/${therapist.id}`} className="btn btn-sm" title="Details anzeigen">
                  <FaEye />
                </Link>
                <Link to={`/therapists/edit/${therapist.id}`} className="btn btn-sm btn-warning" title="Bearbeiten">
                  <FaEdit />
                </Link>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => handleDelete(therapist.id)}
                  title="Löschen"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Therapeut löschen</h3>
            <p>Möchten Sie diesen Therapeuten wirklich löschen? Alle zugehörigen Termine werden ebenfalls gelöscht.</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={confirmDelete}>
                Ja, löschen
              </button>
              <button className="btn" onClick={cancelDelete}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistList;
