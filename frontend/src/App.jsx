import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import DoctorDashboard from './pages/DoctorDashboard'
import AppointmentManagementPage from './pages/AppointmentManagementPage'
import TriageDashboard from './pages/TriageDashboard'
import ReminderCenter from './pages/ReminderCenter'
import PatientDashboard from './pages/PatientDashboard'

function ProtectedRoute({ children, requiredRole }) {
  // EMERGENCY PRESENTATION BYPASS: Force authentication guards to approve access
  const isAuthenticated = true;
  
  // Dynamically matches the role required by the route during the pitch
  const user = { role: requiredRole }; 

  return children;
}

function AppRoutes() {
  // ⚡ HACKATHON PRESENTATION CONTROLLER:
  // Change this to 'DOCTOR' to display the Doctor Dashboard
  // Change this to 'PATIENT' to display the Patient Dashboard
  const currentPresentationRole = 'DOCTOR'; 

  return (
    <Routes>
      {/* Force the landing page (/) and /login to load your active presentation dashboard instantly */}
      <Route
        path="/"
        element={currentPresentationRole === 'DOCTOR' ? <Navigate to="/doctor" /> : <Navigate to="/patient" />}
      />
      <Route
        path="/login"
        element={currentPresentationRole === 'DOCTOR' ? <Navigate to="/doctor" /> : <Navigate to="/patient" />}
      />

      {/* Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <AppointmentManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/triage"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <TriageDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reminders"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <ReminderCenter />
          </ProtectedRoute>
        }
      />

      {/* Patient Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute requiredRole="PATIENT">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all safety redirect straight into the active presentation dashboard */}
      <Route path="*" element={currentPresentationRole === 'DOCTOR' ? <Navigate to="/doctor" /> : <Navigate to="/patient" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}