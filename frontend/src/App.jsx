import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import DoctorDashboard from './pages/DoctorDashboard'
import AppointmentManagementPage from './pages/AppointmentManagementPage'
import TriageDashboard from './pages/TriageDashboard'
import ReminderCenter from './pages/ReminderCenter'
import PatientDashboard from './pages/PatientDashboard'

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'DOCTOR' ? '/doctor' : '/patient'} />
  }

  return children
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={user?.role === 'DOCTOR' ? '/doctor' : '/patient'} /> : <LoginPage />}
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

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
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
