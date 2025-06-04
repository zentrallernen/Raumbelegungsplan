import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { FaPlus, FaTimes } from 'react-icons/fa';
import './LocationForm.css';

const LocationForm = () => {
  const { addLocation, updateLocation, getLocation } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rooms: [{ id: Date.now().toString(), name: '' }]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const location = getLocation(id);
      if (location) {
        setFormData(location);
      } else {
        navigate('/locations');
      }
    }
  }, [id, getLocation, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRoomChange = (index, value) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms[index].name = value;
    
    setFormData(prev => ({
      ...prev,
      rooms: updatedRooms
    }));
    
    // Clear room errors
    if (errors.rooms && errors.rooms[index]) {
      const updatedErrors = { ...errors };
      updatedErrors.rooms[index] = null;
      setErrors(updatedErrors);
    }
  };

  const addRoom = () => {
    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, { id: Date.now().toString(), name: '' }]
    }));
  };

  const removeRoom = (index) => {
    if (formData.rooms.length === 1) {
      return; // Keep at least one room
    }
    
    const updatedRooms = [...formData.rooms];
    updatedRooms.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      rooms: updatedRooms
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Adresse ist erforderlich';
    }
    
    const roomErrors = [];
    let hasRoomError = false;
    
    formData.rooms.forEach((room, index) => {
      if (!room.name.trim()) {
        roomErrors[index] = 'Raumname ist erforderlich';
        hasRoomError = true;
      } else {
        roomErrors[index] = null;
      }
    });
    
    if (hasRoomError) {
      newErrors.rooms = roomErrors;
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
      updateLocation(formData);
    } else {
      addLocation(formData);
    }
    
    navigate('/locations');
  };

  return (
    <div className="location-form-container">
      <div className="page-header">
        <h1 className="page-title">
          {isEditMode ? 'Standort bearbeiten' : 'Neuen Standort anlegen'}
        </h1>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Standortname eingeben"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <input
              type="text"
              id="address"
              name="address"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              value={formData.address}
              onChange={handleChange}
              placeholder="Straße, Hausnummer, PLZ, Ort"
            />
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>
          
          <div className="form-group">
            <label>Räume</label>
            <div className="rooms-container">
              {formData.rooms.map((room, index) => (
                <div key={room.id} className="room-input-group">
                  <input
                    type="text"
                    className={`form-control ${errors.rooms && errors.rooms[index] ? 'is-invalid' : ''}`}
                    value={room.name}
                    onChange={(e) => handleRoomChange(index, e.target.value)}
                    placeholder={`Raum ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger room-remove-btn"
                    onClick={() => removeRoom(index)}
                    disabled={formData.rooms.length === 1}
                  >
                    <FaTimes />
                  </button>
                  {errors.rooms && errors.rooms[index] && (
                    <div className="invalid-feedback">{errors.rooms[index]}</div>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                className="btn btn-sm add-room-btn"
                onClick={addRoom}
              >
                <FaPlus className="mr-1" /> Raum hinzufügen
              </button>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Aktualisieren' : 'Speichern'}
            </button>
            <Link to="/locations" className="btn">
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;
