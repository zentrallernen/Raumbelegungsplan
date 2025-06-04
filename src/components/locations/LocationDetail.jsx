import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import './LocationDetail.css';

const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getLocation, 
    deleteLocation, 
    getAppointmentsForLocation,
    therapists
  } = useAppContext();
  
  const [location, setLocation] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const locationData = getLocation(id);
    if (locationData) {
      setLocation(locationData);
      setAppointments(getAppointmentsForLocation(id));
    } else {
      navigate('/locations');
    }
  }, [id, getLocation, getAppointmentsForLocation, navigate]);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    deleteLocation(id);
    navigate('/locations');
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div className="location-detail-container">
      <div className="page-header">
        <h1 className="page-title">{location.name}</h1>
        <div className="page-actions">
          <Link to={`/locations/edit/${id}`} className="btn btn-warning">
            <FaEdit className="mr-1" /> Bearbeiten
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            <FaTrash className="mr-1" /> Löschen
          </button>
        </div>
      </div>

      <div className="location-detail-content">
        <div className="card location-info">
          <h2>Standort Informationen</h2>
          <p className="location-address">{location.address}</p>
          
          <div className="location-rooms">
            <h3>Räume</h3>
            {location.rooms.length > 0 ? (
              <ul className="room-list-detail">
                {location.rooms.map(room => (
                  <li key={room.id} className="room-item-detail">
                    {room.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Keine Räume vorhanden.</p>
            )}
          </div>
        </div>

        <div className="card location-appointments">
          <div className="appointments-header">
            <h2>Termine</h2>
            <Link to="/appointments/new" className="btn btn-sm">
              <FaCalendarAlt className="mr-1" /> Termin hinzufügen
            </Link>
          </div>
          
          {appointments.length > 0 ? (
            <div className="appointment-list">
              {appointments.map(appointment => {
                const therapist = therapists.find(t => t.id === appointment.therapistId);
                const room = location.rooms.find(r => r.id === appointment.roomId);
                
                return (
                  <div className="appointment-item" key={appointment.id}>
                    <div className="appointment-details">
                      <div className="appointment-time">
                        {getDayName(appointment.dayOfWeek)}, {appointment.startTime} - {appointment.endTime}
                      </div>
                      <div className="appointment-room">
                        Raum: {room?.name}
                      </div>
                      <div className="appointment-therapist">
                        Therapeut: {therapist?.name}
                      </div>
                    </div>
                    <Link to={`/appointments/edit/${appointment.id}`} className="btn btn-sm">
                      Bearbeiten
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Keine Termine für diesen Standort.</p>
          )}
        </div>
      </div>

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

// Helper function to get day name
const getDayName = (dayOfWeek) => {
  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  return days[dayOfWeek - 1];
};

export default LocationDetail;
