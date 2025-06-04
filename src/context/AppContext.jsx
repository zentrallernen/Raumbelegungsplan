import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial data
const initialLocations = [
  {
    id: '1',
    name: 'Karlshorst',
    address: 'Karlshorst Straße 1, 10317 Berlin',
    rooms: [
      { id: '1-1', name: 'Raum 1' }
    ]
  },
  {
    id: '2',
    name: 'Tucholskystraße',
    address: 'Tucholskystraße 10, 10117 Berlin',
    rooms: [
      { id: '2-1', name: 'Raum 1' },
      { id: '2-2', name: 'Raum 2' },
      { id: '2-3', name: 'Raum 3' },
      { id: '2-4', name: 'Raum 4' }
    ]
  },
  {
    id: '3',
    name: 'Waldstraße',
    address: 'Waldstraße 20, 10553 Berlin',
    rooms: [
      { id: '3-1', name: 'Raum 1' },
      { id: '3-2', name: 'Raum 2' },
      { id: '3-3', name: 'Raum 3' }
    ]
  }
];

const initialTherapists = [
  {
    id: '1',
    name: 'Dr. Anna Schmidt',
    specialty: 'Physiotherapie',
    email: 'anna.schmidt@example.com',
    phone: '030 1234567'
  },
  {
    id: '2',
    name: 'Thomas Müller',
    specialty: 'Ergotherapie',
    email: 'thomas.mueller@example.com',
    phone: '030 7654321'
  },
  {
    id: '3',
    name: 'Julia Weber',
    specialty: 'Logopädie',
    email: 'julia.weber@example.com',
    phone: '030 9876543'
  }
];

const initialAppointments = [
  {
    id: '1',
    therapistId: '1',
    locationId: '1',
    roomId: '1-1',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '11:00',
    recurring: true
  },
  {
    id: '2',
    therapistId: '2',
    locationId: '2',
    roomId: '2-1',
    dayOfWeek: 2, // Tuesday
    startTime: '14:00',
    endTime: '16:00',
    recurring: true
  },
  {
    id: '3',
    therapistId: '3',
    locationId: '3',
    roomId: '3-1',
    dayOfWeek: 3, // Wednesday
    startTime: '10:00',
    endTime: '12:00',
    recurring: true
  }
];

// Initial state
const initialState = {
  locations: [],
  therapists: [],
  appointments: [],
  loading: false,
  error: null
};

// Load data from localStorage or use initial data
const loadInitialData = () => {
  try {
    const storedLocations = localStorage.getItem('locations');
    const storedTherapists = localStorage.getItem('therapists');
    const storedAppointments = localStorage.getItem('appointments');
    
    return {
      locations: storedLocations ? JSON.parse(storedLocations) : initialLocations,
      therapists: storedTherapists ? JSON.parse(storedTherapists) : initialTherapists,
      appointments: storedAppointments ? JSON.parse(storedAppointments) : initialAppointments,
      loading: false,
      error: null
    };
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return initialState;
  }
};

// Action types
const ADD_LOCATION = 'ADD_LOCATION';
const UPDATE_LOCATION = 'UPDATE_LOCATION';
const DELETE_LOCATION = 'DELETE_LOCATION';
const ADD_THERAPIST = 'ADD_THERAPIST';
const UPDATE_THERAPIST = 'UPDATE_THERAPIST';
const DELETE_THERAPIST = 'DELETE_THERAPIST';
const ADD_APPOINTMENT = 'ADD_APPOINTMENT';
const UPDATE_APPOINTMENT = 'UPDATE_APPOINTMENT';
const DELETE_APPOINTMENT = 'DELETE_APPOINTMENT';
const SET_ERROR = 'SET_ERROR';

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ADD_LOCATION:
      return {
        ...state,
        locations: [...state.locations, action.payload]
      };
    case UPDATE_LOCATION:
      return {
        ...state,
        locations: state.locations.map(location => 
          location.id === action.payload.id ? action.payload : location
        )
      };
    case DELETE_LOCATION:
      return {
        ...state,
        locations: state.locations.filter(location => location.id !== action.payload),
        // Also delete appointments for this location
        appointments: state.appointments.filter(appointment => appointment.locationId !== action.payload)
      };
    case ADD_THERAPIST:
      return {
        ...state,
        therapists: [...state.therapists, action.payload]
      };
    case UPDATE_THERAPIST:
      return {
        ...state,
        therapists: state.therapists.map(therapist => 
          therapist.id === action.payload.id ? action.payload : therapist
        )
      };
    case DELETE_THERAPIST:
      return {
        ...state,
        therapists: state.therapists.filter(therapist => therapist.id !== action.payload),
        // Also delete appointments for this therapist
        appointments: state.appointments.filter(appointment => appointment.therapistId !== action.payload)
      };
    case ADD_APPOINTMENT:
      return {
        ...state,
        appointments: [...state.appointments, action.payload]
      };
    case UPDATE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.map(appointment => 
          appointment.id === action.payload.id ? action.payload : appointment
        )
      };
    case DELETE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== action.payload)
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, loadInitialData);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('locations', JSON.stringify(state.locations));
    localStorage.setItem('therapists', JSON.stringify(state.therapists));
    localStorage.setItem('appointments', JSON.stringify(state.appointments));
  }, [state.locations, state.therapists, state.appointments]);

  // Location actions
  const addLocation = (location) => {
    const newLocation = {
      ...location,
      id: uuidv4()
    };
    dispatch({ type: ADD_LOCATION, payload: newLocation });
    return newLocation;
  };

  const updateLocation = (location) => {
    dispatch({ type: UPDATE_LOCATION, payload: location });
  };

  const deleteLocation = (id) => {
    dispatch({ type: DELETE_LOCATION, payload: id });
  };

  const getLocation = (id) => {
    return state.locations.find(location => location.id === id);
  };

  // Therapist actions
  const addTherapist = (therapist) => {
    const newTherapist = {
      ...therapist,
      id: uuidv4()
    };
    dispatch({ type: ADD_THERAPIST, payload: newTherapist });
    return newTherapist;
  };

  const updateTherapist = (therapist) => {
    dispatch({ type: UPDATE_THERAPIST, payload: therapist });
  };

  const deleteTherapist = (id) => {
    dispatch({ type: DELETE_THERAPIST, payload: id });
  };

  const getTherapist = (id) => {
    return state.therapists.find(therapist => therapist.id === id);
  };

  // Appointment actions
  const addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: uuidv4()
    };
    dispatch({ type: ADD_APPOINTMENT, payload: newAppointment });
    return newAppointment;
  };

  const updateAppointment = (appointment) => {
    dispatch({ type: UPDATE_APPOINTMENT, payload: appointment });
  };

  const deleteAppointment = (id) => {
    dispatch({ type: DELETE_APPOINTMENT, payload: id });
  };

  const getAppointment = (id) => {
    return state.appointments.find(appointment => appointment.id === id);
  };

  // Get appointments for a location
  const getAppointmentsForLocation = (locationId) => {
    return state.appointments.filter(appointment => appointment.locationId === locationId);
  };

  // Get appointments for a therapist
  const getAppointmentsForTherapist = (therapistId) => {
    return state.appointments.filter(appointment => appointment.therapistId === therapistId);
  };

  // Check if a location has appointments on a specific day
  const locationHasAppointmentsOnDay = (locationId, dayOfWeek) => {
    return state.appointments.some(
      appointment => appointment.locationId === locationId && appointment.dayOfWeek === dayOfWeek
    );
  };

  // Error handling
  const setError = (error) => {
    dispatch({ type: SET_ERROR, payload: error });
    // Clear error after 5 seconds
    setTimeout(() => {
      dispatch({ type: SET_ERROR, payload: null });
    }, 5000);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addLocation,
        updateLocation,
        deleteLocation,
        getLocation,
        addTherapist,
        updateTherapist,
        deleteTherapist,
        getTherapist,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointment,
        getAppointmentsForLocation,
        getAppointmentsForTherapist,
        locationHasAppointmentsOnDay,
        setError
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
