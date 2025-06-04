import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { FaMapMarkerAlt, FaUserMd, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { 
    locations, 
    therapists, 
    appointments,
    locationHasAppointmentsOnDay
  } = useAppContext();

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const today = new Date().getDay();
  // Convert to our format (1 = Monday, 2 = Tuesday, etc.)
  const currentDayOfWeek = today === 0 ? 7 : today;

  // Check if a specific room is occupied on a specific day
  const isRoomOccupied = (locationId, roomId, dayOfWeek) => {
    return appointments.some(
      appointment => 
        appointment.locationId === locationId && 
        appointment.roomId === roomId && 
        appointment.dayOfWeek === dayOfWeek
    );
  };

  // Days of the week
  const daysOfWeek = [
    { id: 1, name: 'Mo' },
    { id: 2, name: 'Di' },
    { id: 3, name: 'Mi' },
    { id: 4, name: 'Do' },
    { id: 5, name: 'Fr' },
    { id: 6, name: 'Sa' },
    { id: 7, name: 'So' }
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Standorte</h3>
          <div className="stat-value">{locations.length}</div>
          <Link to="/locations" className="btn btn-sm mt-2">
            Alle anzeigen
          </Link>
        </div>
        
        <div className="stat-card">
          <h3>Therapeuten</h3>
          <div className="stat-value">{therapists.length}</div>
          <Link to="/therapists" className="btn btn-sm mt-2">
            Alle anzeigen
          </Link>
        </div>
        
        <div className="stat-card">
          <h3>Termine</h3>
          <div className="stat-value">{appointments.length}</div>
          <Link to="/appointments" className="btn btn-sm mt-2">
            Alle anzeigen
          </Link>
        </div>
      </div>

      {/* Locations Overview */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Standorte Übersicht</h2>
          <Link to="/locations/new" className="btn btn-sm">
            <FaPlus className="mr-1" /> Neuer Standort
          </Link>
        </div>
        
        <div className="location-grid">
          {locations.map(location => (
            <div className="location-card" key={location.id}>
              <div className="location-header">
                <h3>{location.name}</h3>
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
              
              <p>{location.address}</p>
              
              <div className="location-rooms">
                <strong>Räume:</strong> {location.rooms.length}
              </div>

              {/* Weekly schedule for each room */}
              <div className="room-schedule-container">
                <h4>Raumbelegung</h4>
                <table className="room-schedule">
                  <thead>
                    <tr>
                      <th>Raum</th>
                      {daysOfWeek.map(day => (
                        <th key={day.id} className={day.id === currentDayOfWeek ? 'current-day' : ''}>
                          {day.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {location.rooms.map(room => (
                      <tr key={room.id}>
                        <td>{room.name}</td>
                        {daysOfWeek.map(day => (
                          <td key={day.id} className={day.id === currentDayOfWeek ? 'current-day' : ''}>
                            <div 
                              className={`room-status ${
                                isRoomOccupied(location.id, room.id, day.id) 
                                  ? 'status-occupied' 
                                  : 'status-free'
                              }`}
                              title={`${room.name} ist ${isRoomOccupied(location.id, room.id, day.id) ? 'belegt' : 'frei'} am ${getDayName(day.id)}`}
                            ></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="location-actions mt-2">
                <Link to={`/locations/${location.id}`} className="btn btn-sm">
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Appointments */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Aktuelle Termine</h2>
          <Link to="/appointments/new" className="btn btn-sm">
            <FaPlus className="mr-1" /> Neuer Termin
          </Link>
        </div>
        
        <div className="recent-appointments">
          {appointments.length > 0 ? (
            appointments.slice(0, 5).map(appointment => {
              const therapist = therapists.find(t => t.id === appointment.therapistId);
              const location = locations.find(l => l.id === appointment.locationId);
              const room = location?.rooms.find(r => r.id === appointment.roomId);
              
              return (
                <div className="appointment-item" key={appointment.id}>
                  <div className="appointment-details">
                    <div className="appointment-time">
                      {getDayName(appointment.dayOfWeek)}, {appointment.startTime} - {appointment.endTime}
                    </div>
                    <div className="appointment-location">
                      <FaMapMarkerAlt className="mr-1" />
                      {location?.name} - {room?.name}
                    </div>
                    <div className="appointment-therapist">
                      <FaUserMd className="mr-1" />
                      {therapist?.name}
                    </div>
                  </div>
                  <Link to={`/appointments/edit/${appointment.id}`} className="btn btn-sm">
                    Bearbeiten
                  </Link>
                </div>
              );
            })
          ) : (
            <p>Keine Termine vorhanden.</p>
          )}
          
          {appointments.length > 5 && (
            <div className="text-center mt-2">
              <Link to="/appointments" className="btn">
                Alle Termine anzeigen
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Helper function to get day name
const getDayName = (dayOfWeek) => {
  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  return days[dayOfWeek - 1];
};

export default Dashboard;
