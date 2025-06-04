import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const { 
    addAppointment, 
    updateAppointment, 
    getAppointment,
    therapists,
    locations
  } = useAppContext();
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    therapistId: '',
    locationId: '',
    roomId: '',
    dayOfWeek: 1, // Default to Monday
    startTime: '09:00',
    endTime: '10:00',
    recurring: true
  });

  const [availableRooms, setAvailableRooms] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const appointment = getAppointment(id);
      if (appointment) {
        setFormData(appointment);
        
        // Set available rooms based on selected location
        const location = locations.find(loc => loc.id === appointment.locationId);
        if (location) {
          setAvailableRooms(location.rooms);
        }
      } else {
        navigate('/appointments');
      }
    }
  }, [id, getAppointment, isEditMode, navigate, locations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for locationId to update available rooms
    if (name === 'locationId') {
      const location = locations.find(loc => loc.id === value);
      setAvailableRooms(location ? location.rooms : []);
      
      // Reset roomId when location changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        roomId: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'dayOfWeek' ? parseInt(value) : value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.therapistId) {
      newErrors.therapistId = 'Therapeut ist erforderlich';
    }
    
    if (!formData.locationId) {
      newErrors.locationId = 'Standort ist erforderlich';
    }
    
    if (!formData.roomId) {
      newErrors.roomId = 'Raum ist erforderlich';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Startzeit ist erforderlich';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'Endzeit ist erforderlich';
    } else if (formData.endTime <= formData.startTime) {
      newErrors.endTime = 'Endzeit muss nach der Startzeit liegen';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditMode) {
      updateAppointment(formData);
    } else {
      addAppointment(formData);
    }
    
    navigate('/appointments');
  };

  return (
    <div className="appointment-form-container">
      <div className="page-header">
        <h1 className="page-title">
          {isEditMode ? 'Termin bearbeiten' : 'Neuen Termin anlegen'}
        </h1>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="therapistId">Therapeut</label>
              <select
                id="therapistId"
                name="therapistId"
                className={`form-control ${errors.therapistId ? 'is-invalid' : ''}`}
                value={formData.therapistId}
                onChange={handleChange}
              >
                <option value="">Therapeut auswählen</option>
                {therapists.map(therapist => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.name}
                  </option>
                ))}
              </select>
              {errors.therapistId && <div className="invalid-feedback">{errors.therapistId}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="dayOfWeek">Tag</label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                className="form-control"
                value={formData.dayOfWeek}
                onChange={handleChange}
              >
                <option value={1}>Montag</option>
                <option value={2}>Dienstag</option>
                <option value={3}>Mittwoch</option>
                <option value={4}>Donnerstag</option>
                <option value={5}>Freitag</option>
                <option value={6}>Samstag</option>
                <option value={7}>Sonntag</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="locationId">Standort</label>
              <select
                id="locationId"
                name="locationId"
                className={`form-control ${errors.locationId ? 'is-invalid' : ''}`}
                value={formData.locationId}
                onChange={handleChange}
              >
                <option value="">Standort auswählen</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {errors.locationId && <div className="invalid-feedback">{errors.locationId}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="roomId">Raum</label>
              <select
                id="roomId"
                name="roomId"
                className={`form-control ${errors.roomId ? 'is-invalid' : ''}`}
                value={formData.roomId}
                onChange={handleChange}
                disabled={!formData.locationId}
              >
                <option value="">Raum auswählen</option>
                {availableRooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              {errors.roomId && <div className="invalid-feedback">{errors.roomId}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Startzeit</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                className={`form-control ${errors.startTime ? 'is-invalid' : ''}`}
                value={formData.startTime}
                onChange={handleChange}
              />
              {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="endTime">Endzeit</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                className={`form-control ${errors.endTime ? 'is-invalid' : ''}`}
                value={formData.endTime}
                onChange={handleChange}
              />
              {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="recurring"
                name="recurring"
                checked={formData.recurring}
                onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.checked }))}
              />
              <label htmlFor="recurring">Wöchentlich wiederholen</label>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Aktualisieren' : 'Speichern'}
            </button>
            <Link to="/appointments" className="btn">
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
