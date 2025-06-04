import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/pages/Dashboard';
import LocationList from './components/locations/LocationList';
import LocationForm from './components/locations/LocationForm';
import LocationDetail from './components/locations/LocationDetail';
import TherapistList from './components/therapists/TherapistList';
import TherapistForm from './components/therapists/TherapistForm';
import TherapistDetail from './components/therapists/TherapistDetail';
import AppointmentList from './components/appointments/AppointmentList';
import AppointmentForm from './components/appointments/AppointmentForm';
import Footer from './components/layout/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            <Route path="/locations" element={<LocationList />} />
            <Route path="/locations/new" element={<LocationForm />} />
            <Route path="/locations/edit/:id" element={<LocationForm />} />
            <Route path="/locations/:id" element={<LocationDetail />} />
            
            <Route path="/therapists" element={<TherapistList />} />
            <Route path="/therapists/new" element={<TherapistForm />} />
            <Route path="/therapists/edit/:id" element={<TherapistForm />} />
            <Route path="/therapists/:id" element={<TherapistDetail />} />
            
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/appointments/new" element={<AppointmentForm />} />
            <Route path="/appointments/edit/:id" element={<AppointmentForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
