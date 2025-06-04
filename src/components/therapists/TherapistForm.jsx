import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import './TherapistForm.css';

const TherapistForm = () => {
  const { addTherapist, updateTherapist, getTherapist } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const therapist = getTherapist(id);
      if (therapist) {
        setFormData(therapist);
      } else {
        navigate('/therapists');
      }
    }
  }, [id, getTherapist, isEditMode, navigate]);

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }
    
    if (!formData.specialty.trim()) {
      newErrors.specialty = 'Fachbereich ist erforderlich';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefonnummer ist erforderlich';
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
      updateTherapist(formData);
    } else {
      addTherapist(formData);
    }
    
    navigate('/therapists');
  };

  return (
    <div className="therapist-form-container">
      <div className="page-header">
        <h1 className="page-title">
          {isEditMode ? 'Therapeut bearbeiten' : 'Neuen Therapeuten anlegen'}
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
              placeholder="Vollständigen Namen eingeben"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="specialty">Fachbereich</label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              className={`form-control ${errors.specialty ? 'is-invalid' : ''}`}
              value={formData.specialty}
              onChange={handleChange}
              placeholder="z.B. Physiotherapie, Ergotherapie, etc."
            />
            {errors.specialty && <div className="invalid-feedback">{errors.specialty}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="E-Mail-Adresse eingeben"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Telefon</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="Telefonnummer eingeben"
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Aktualisieren' : 'Speichern'}
            </button>
            <Link to="/therapists" className="btn">
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TherapistForm;
