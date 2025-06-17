import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

// Page Imports
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CreateEventPage from './pages/CreateEventPage.jsx';
import EditEventPage from './pages/EditEventPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import EventAttendeesPage from './pages/EventAttendees.jsx';
// import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

// Helper Component
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    // The Router MUST wrap the AuthProvider. This fixes the `useNavigate()` error[6].
    <Router>
      <AuthProvider>
        <div className="bg-secondary min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />

            {/* General Protected Route */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

            {/* Vendor-Specific Protected Routes */}
            <Route path="/create-event" element={<ProtectedRoute allowedRoles={['vendor']}><CreateEventPage /></ProtectedRoute>} />
            <Route path="/edit-event/:eventId" element={<ProtectedRoute allowedRoles={['vendor']}><EditEventPage /></ProtectedRoute>} />
            <Route path="/event-attendees/:eventId" element={<ProtectedRoute allowedRoles={['vendor']}><EventAttendeesPage /></ProtectedRoute>} />

            {/* Admin-Only Protected Route */}
            {/* <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>} /> */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;



