import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoginPage from './modules/auth/pages/LoginPage'
import SignupPage from './modules/auth/pages/SignupPage'
import Dashboard from './modules/dashboard/pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './modules/auth/hooks/useAuth'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">Loading Personal OS...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route 
        path="/" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
