import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './AppointmentList.css';

const AppointmentList = () => {
  const { appointments, deleteAppointment, therapists, locations } = useAppContext();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [filter, setFilter] = useState({
    therapistId: '',
    locationId: '',
    dayOfWeek: ''
  });

  const handleDelete = (id) => {
    setAppointmentToDelete(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    deleteAppointment(appointmentToDelete);
    setShowConfirmation(false);
    setAppointmentToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setAppointmentToDelete(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter(appointment => {
    if (filter.therapistId && appointment.therapistId !== filter.therapistId) {
      return false;
    }
    if (filter.locationId && appointment.locationId !== filter.locationId) {
      return false;
    }
    if (filter.dayOfWeek && appointment.dayOfWeek !== parseInt(filter.dayOfWeek)) {
      return false;
    }
    return true;
  });

  return (
    <div className="appointment-list-container">
      <div className="page-header">
        <h1 className="page-title">Termine</h1>
        <Link to="/appointments/new" className="btn">
          <FaPlus className="mr-1" /> Neuer Termin
        </Link>
      </div>

      <div className="card filter-card">
        <h3>Filter</h3>
        <div className="filter-form">
          <div className="filter-group">
            <label htmlFor="therapistId">Therapeut</label>
            <select
              id="therapistId"
              name="therapistId"
              className="form-control"
              value={filter.therapistId}
              onChange={handleFilterChange}
            >
              <option value="">Alle Therapeuten</option>
              {therapists.map(therapist => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="locationId">Standort</label>
            <select
              id="locationId"
              name="locationId"
              className="form-control"
              value={filter.locationId}
              onChange={handleFilterChange}
            >
              <option value="">Alle Standorte</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="dayOfWeek">Tag</label>
            <select
              id="dayOfWeek"
              name="dayOfWeek"
              className="form-control"
              value={filter.dayOfWeek}
              onChange={handleFilterChange}
            >
              <option value="">Alle Tage</option>
              <option value="1">Montag</option>
              <option value="2">Dienstag</option>
              <option value="3">Mittwoch</option>
              <option value="4">Donnerstag</option>
              <option value="5">Freitag</option>
              <option value="6">Samstag</option>
              <option value="7">Sonntag</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="card">
          <p>Keine Termine gefunden.</p>
          <Link to="/appointments/new" className="btn mt-2">
            Termin anlegen
          </Link>
        </div>
      ) : (
        <div className="appointments-table-container">
          <table className="table appointments-table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Zeit</th>
                <th>Therapeut</th>
                <th>Standort</th>
                <th>Raum</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => {
                const therapist = therapists.find(t => t.id === appointment.therapistId);
                const location = locations.find(l => l.id === appointment.locationId);
                const room = location?.rooms.find(r => r.id === appointment.roomId);
                
                return (
                  <tr key={appointment.id}>
                    <td>{getDayName(appointment.dayOfWeek)}</td>
                    <td>{appointment.startTime} - {appointment.endTime}</td>
                    <td>{therapist?.name}</td>
                    <td>{location?.name}</td>
                    <td>{room?.name}</td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/appointments/edit/${appointment.id}`} 
                          className="btn btn-sm btn-warning"
                          title="Bearbeiten"
                        >
                          <FaEdit />
                        </Link>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDelete(appointment.id)}
                          title="Löschen"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Termin löschen</h3>
            <p>Möchten Sie diesen Termin wirklich löschen?</p>
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

// Helper function to get day name
const getDayName = (dayOfWeek) => {
  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  return days[dayOfWeek - 1];
};

export default AppointmentList;
