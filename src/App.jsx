import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SubmitRoute from './pages/SubmitRoute'
import Dashboard from './pages/Dashboard'
import Trips from './components/Trips'
import RoutesMap from './pages/RoutesMap'
import RoutesMap2 from './pages/RoutesMap2'
import PopularRoutesPage from './pages/PopularRoutesPage'
import AuthPage from './pages/AuthPage'
import Settings from './pages/Settings'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<Trips />} />
          <Route path="/popular-routes" element={<PopularRoutesPage />} />
          <Route path="/submit" element={<SubmitRoute />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/map" element={<RoutesMap />} />
          <Route path="/map2" element={<RoutesMap2 />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  )
}

export default App
