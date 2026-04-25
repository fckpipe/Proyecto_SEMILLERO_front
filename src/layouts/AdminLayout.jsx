import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, CalendarDays, Clock, MapPin, Activity, LogOut, Menu, X, Bell, ChevronLeft, ChevronRight, Users, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
const logo = '/logo.transito.png'

const allMenuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Resumen Global', roles: ['admin_sede', 'super_admin'] },
  { path: '/usuarios', icon: ShieldCheck, label: 'Control Ciudadano', roles: ['super_admin'] },
  { path: '/agenda', icon: CalendarDays, label: 'Gestión de Trámites', roles: ['admin_sede', 'super_admin'] },
  { path: '/citas', icon: Users, label: 'Radicaciones Virtuales', roles: ['admin_sede', 'super_admin'] },
  { path: '/horarios', icon: Clock, label: 'Ventanas del Sistema', roles: ['admin_sede', 'super_admin'] },
  { path: '/sedes', icon: MapPin, label: 'Centros de Operación', roles: ['super_admin'] },
  { path: '/logs', icon: Activity, label: 'Auditoría Logs', roles: ['super_admin'] },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Filtrar menús según el rol del usuario
  const menuItems = useMemo(() => {
    return allMenuItems.filter(item => item.roles.includes(user?.rol || 'admin_sede'))
  }, [user])

  const activeSedeName = user?.sede?.nombre || 'Centro de Gestión Virtual';

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gris-900/60 z-40 lg:hidden backdrop-blur-md"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? '5rem' : '18rem',
          x: sidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? '-100%' : 0)
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-gris-900 text-white border-r border-white/5 shadow-2xl flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="absolute inset-0 bg-cali-gradient opacity-10 mix-blend-screen pointer-events-none" />
        
        {/* Logo Area */}
        <div className="h-24 flex items-center px-4 border-b border-white/10 relative z-10 shrink-0">
          <Link to="/" className="flex items-center gap-3 w-full bg-white/5 p-2 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors">
            <div className="bg-white p-1.5 rounded-xl flex-shrink-0 shadow-lg">
              <img src={logo} alt="Secretaría de Movilidad" className="h-8 w-8 object-contain" />
            </div>
            {!sidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="font-display font-bold text-sm leading-tight text-white whitespace-nowrap"
              >
                Movilidad<br/><span className="text-verde-400">Panel {user?.rol === 'super_admin' ? 'Central' : 'Virtual'}</span>
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-8 px-3 space-y-2 relative z-10 custom-scrollbar">
          {!sidebarCollapsed && (
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gris-500 mb-6">
              Módulos {user?.rol === 'super_admin' ? 'Globales' : 'Administrativos'}
            </p>
          )}
          
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-verde-500/20 to-transparent text-verde-400 font-bold border-l-2 border-verde-500' 
                    : 'text-gris-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={22} className={`transition-colors flex-shrink-0 ${isActive ? 'text-verde-400' : 'group-hover:text-dorado-400'}`} />
                {!sidebarCollapsed && (
                   <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{item.label}</motion.span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-white/10 relative z-10 shrink-0">
          <div className={`bg-white/5 border border-white/10 rounded-3xl p-3 backdrop-blur-md overflow-hidden ${sidebarCollapsed ? 'items-center' : ''}`}>
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center mb-0' : 'mb-4'}`}>
              <div className="w-10 h-10 rounded-2xl bg-cali-gradient flex items-center justify-center font-display font-bold text-lg shadow-inner flex-shrink-0 border border-white/20 text-white">
                {user?.nombre?.charAt(0) || 'A'}
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden text-white text-left">
                  <p className="text-sm font-bold truncate">{user?.nombre || 'Admin'}</p>
                  <p className="text-[10px] text-verde-400 font-bold uppercase tracking-wider">{activeSedeName}</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-red-100 bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20"
              >
                <LogOut size={14} /> Salir
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 bg-white/90 backdrop-blur-lg border-b border-gris-200 flex items-center justify-between px-6 sm:px-10 shrink-0 z-30 relative shadow-sm">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-2xl bg-gris-100 text-gris-600 hover:bg-gris-200 transition-colors border border-gris-200"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-xl font-display font-extrabold text-gris-900 hidden sm:block">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Panel de Gestión'}
              </h1>
              <p className="text-[10px] font-bold text-gris-400 uppercase tracking-widest hidden sm:block">
                Sistema Centralizado de Movilidad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8 text-left">
            <div className="hidden md:flex flex-col text-right">
                <span className="text-[10px] text-verde-600 font-bold uppercase tracking-widest flex items-center justify-end gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-verde-500 animate-pulse"></div> Canal Virtual Activo
                </span>
                <span className="text-xs text-gris-600 font-black">
                   {activeSedeName}
                </span>
            </div>

            <button className="relative p-2.5 rounded-2xl text-gris-500 bg-gris-50 border border-gris-200 hover:bg-white hover:text-gris-900 transition-all shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20" />
            </button>
            
            <div className="h-10 w-[1px] bg-gris-200 hidden xs:block" />
            
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-extrabold text-gris-900 leading-none">{user?.nombre || 'Admin'}</p>
                <p className="text-[10px] text-verde-500 font-black mt-1 uppercase">Rol: {user?.rol || 'Admin'}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-verde-50 border-2 border-verde-200 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-xl bg-cali-gradient flex items-center justify-center text-white font-bold shadow-md">
                   {user?.nombre?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] w-full p-0">
          <div className="p-4 sm:p-8 md:p-10 max-w-[1600px] mx-auto min-h-full">
               {children}
          </div>
        </main>
      </div>

    </div>
  )
}
