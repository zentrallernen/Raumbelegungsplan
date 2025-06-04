import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './LocationList.css';

const LocationList = () => {
  const { locations, deleteLocation, locationHasAppointmentsOnDay } = useAppContext();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const today = new Date().getDay();
  // Convert to our format (1 = Monday, 2 = Tuesday, etc.)
  const currentDayOfWeek = today === 0 ? 7 : today;

  const handleDelete = (id) => {
    setLocationToDelete(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    deleteLocation(locationToDelete);
    setShowConfirmation(false);
    setLocationToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setLocationToDelete(null);
  };

  return (
    <div className="location-list-container">
      <div className="page-header">
        <h1 className="page-title">Standorte</h1>
        <Link to="/locations/new" className="btn">
          <FaPlus className="mr-1" /> Neuer Standort
        </Link>
      </div>

      {locations.length === 0 ? (
        <div className="card">
          <p>Keine Standorte vorhanden.</p>
          <Link to="/locations/new" className="btn mt-2">
            Standort anlegen
          </Link>
        </div>
      ) : (
        <div className="location-list">
          {locations.map(location => (
            <div className="location-list-item" key={location.id}>
              <div className="location-list-content">
                <div className="location-list-header">
                  <h2>{location.name}</h2>
                  <div className="location-status">
                    <div 
                      className={`status-indicator ${
                        locationHasAppointmentsOnDay(location.id, currentDayOfWeek) 
                          ? 'status-occupied' 
                          : 'status-free'
                      }`}
                    ></div>
                    <span>
                      {locationHasAppointmentsOnDay(location.id, currentDayOfWeek) 
                        ? 'Belegt heute' 
                        : 'Frei heute'}
                    </span>
                  </div>
                </div>
                <p className="location-address">{location.address}</p>
                <div className="location-rooms-info">
                  <strong>Räume:</strong> {location.rooms.length}
                  <ul className="room-list">
                    {location.rooms.map(room => (
                      <li key={room.id} className="room-item">{room.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="location-list-actions">
                <Link to={`/locations/${location.id}`} className="btn btn-sm" title="Details anzeigen">
                  <FaEye />
                </Link>
                <Link to={`/locations/edit/${location.id}`} className="btn btn-sm btn-warning" title="Bearbeiten">
                  <FaEdit />
                </Link>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => handleDelete(location.id)}
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
            <h3>Standort löschen</h3>
            <p>Möchten Sie diesen Standort wirklich löschen? Alle zugehörigen Termine werden ebenfalls gelöscht.</p>
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

export default LocationList;
