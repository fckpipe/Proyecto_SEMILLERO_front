import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CourseProvider } from './contexts/CourseContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Appointments from './pages/admin/Appointments'
import ActivityLogs from './pages/admin/ActivityLogs'
import Schedules from './pages/admin/Schedules'
import Branches from './pages/admin/Branches'
import Agenda from './pages/admin/Agenda'
import Users from './pages/admin/Users'
import Enrollment from './pages/Enrollment'
import { PageWrapper } from './components/UIUtilities'
import MovIAChatWidget from './components/pqr/PQRWidget';
// Course module
import CursoPortal from './pages/curso/CursoPortal'
import CursoModulos from './pages/curso/CursoModulos'
import CursoLeccion from './pages/curso/CursoLeccion'
import CursoExamen from './pages/curso/CursoExamen'
import CursoCertificado from './pages/curso/CursoCertificado'
import Perfil from './pages/ciudadano/Perfil'
import CourseLayout from './layouts/CourseLayout'

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" />
  return children
}

// Rutas solo para admins
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" />
  if (user?.rol !== 'super_admin' && user?.rol !== 'admin_sede') return <Navigate to="/curso" />
  return children
}

// Rutas solo para ciudadanos
const CitizenRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" />
  if (user?.rol === 'super_admin' || user?.rol === 'admin_sede') return <Navigate to="/dashboard" />
  return children
}

function AnimatedRoutes() {
  return (
    <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/agendar" element={<Enrollment />} />

        {/* ── Módulo Curso Virtual (solo ciudadanos) ── */}
        <Route path="/curso" element={<CitizenRoute><CursoPortal /></CitizenRoute>} />
        <Route path="/curso/modulos" element={<CitizenRoute><CursoModulos /></CitizenRoute>} />
        <Route path="/curso/leccion/:id" element={<CitizenRoute><CursoLeccion /></CitizenRoute>} />
        <Route path="/curso/examen" element={<CitizenRoute><CursoExamen /></CitizenRoute>} />
        <Route path="/curso/certificado" element={<CitizenRoute><CursoCertificado /></CitizenRoute>} />
        <Route path="/perfil" element={
          <CitizenRoute>
            <CourseLayout><Perfil /></CourseLayout>
          </CitizenRoute>
        } />
        
        {/* Rutas admin protegidas */}
        <Route path="/dashboard" element={<AdminRoute><AdminLayout><PageWrapper><Dashboard /></PageWrapper></AdminLayout></AdminRoute>} />
        <Route path="/agenda" element={<AdminRoute><AdminLayout><PageWrapper><Agenda /></PageWrapper></AdminLayout></AdminRoute>} />
        <Route path="/citas" element={<AdminRoute><AdminLayout><PageWrapper><Appointments /></PageWrapper></AdminLayout></AdminRoute>} />
        <Route path="/horarios" element={<AdminRoute><AdminLayout><PageWrapper><Schedules /></PageWrapper></AdminLayout></AdminRoute>} />
        <Route path="/sedes" element={<AdminRoute><AdminLayout><PageWrapper><Branches /></PageWrapper></AdminLayout></AdminRoute>} />
        <Route path="/usuarios" element={<AdminRoute><AdminLayout><PageWrapper><Users /></PageWrapper></AdminLayout></AdminRoute>} />
        <Route path="/logs" element={<AdminRoute><AdminLayout><PageWrapper><ActivityLogs /></PageWrapper></AdminLayout></AdminRoute>} />
    </Routes>
  )
}

function AppShell() {
  const location = useLocation()
  // Show MOV-IA only on public pages
  const hideChat = !['/', '/login', '/registro', '/agendar'].includes(location.pathname)
  return (
    <>
      <AnimatedRoutes />
      {!hideChat && <MovIAChatWidget />}
    </>
  )
}

import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CourseProvider>
          <AppShell />
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
