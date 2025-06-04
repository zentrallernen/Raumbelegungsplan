import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import './TherapistDetail.css';

const TherapistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getTherapist, 
    deleteTherapist, 
    getAppointmentsForTherapist,
    locations
  } = useAppContext();
  
  const [therapist, setTherapist] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const therapistData = getTherapist(id);
    if (therapistData) {
      setTherapist(therapistData);
      setAppointments(getAppointmentsForTherapist(id));
    } else {
      navigate('/therapists');
    }
  }, [id, getTherapist, getAppointmentsForTherapist, navigate]);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    deleteTherapist(id);
    navigate('/therapists');
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  // Group appointments by day of week
  const appointmentsByDay = appointments.reduce((acc, appointment) => {
    const day = appointment.dayOfWeek;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(appointment);
    return acc;
  }, {});

  if (!therapist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="therapist-detail-container">
      <div className="page-header">
        <h1 className="page-title">{therapist.name}</h1>
        <div className="page-actions">
          <Link to={`/therapists/edit/${id}`} className="btn btn-warning">
            <FaEdit className="mr-1" /> Bearbeiten
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            <FaTrash className="mr-1" /> Löschen
          </button>
        </div>
      </div>

      <div className="therapist-detail-content">
        <div className="card therapist-info">
          <h2>Therapeut Informationen</h2>
          <div className="info-item">
            <span className="info-label">Fachbereich:</span>
            <span className="info-value">{therapist.specialty}</span>
          </div>
          <div className="info-item">
            <span className="info-label">E-Mail:</span>
            <span className="info-value">{therapist.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Telefon:</span>
            <span className="info-value">{therapist.phone}</span>
          </div>
        </div>

        <div className="card therapist-schedule">
          <div className="schedule-header">
            <h2>Wochenplan</h2>
            <Link to="/appointments/new" className="btn btn-sm">
              <FaCalendarAlt className="mr-1" /> Termin hinzufügen
            </Link>
          </div>
          
          {appointments.length > 0 ? (
            <div className="weekly-schedule">
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <div key={day} className="day-schedule">
                  <h3 className="day-name">{getDayName(day)}</h3>
                  {appointmentsByDay[day] && appointmentsByDay[day].length > 0 ? (
                    <div className="day-appointments">
                      {appointmentsByDay[day].map(appointment => {
                        const location = locations.find(l => l.id === appointment.locationId);
                        const room = location?.rooms.find(r => r.id === appointment.roomId);
                        
                        return (
                          <div className="schedule-appointment" key={appointment.id}>
                            <div className="appointment-time">
                              {appointment.startTime} - {appointment.endTime}
                            </div>
                            <div className="appointment-location">
                              {location?.name} - {room?.name}
                            </div>
                            <Link to={`/appointments/edit/${appointment.id}`} className="btn btn-sm">
                              Bearbeiten
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="no-appointments">Keine Termine</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Keine Termine für diesen Therapeuten.</p>
          )}
        </div>
      </div>

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

// Helper function to get day name
const getDayName = (dayOfWeek) => {
  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  return days[dayOfWeek - 1];
};

export default TherapistDetail;
