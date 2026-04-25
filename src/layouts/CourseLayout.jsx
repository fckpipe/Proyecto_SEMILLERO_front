import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, BookOpen, Home, Award, FileText, User, BarChart2, Menu, X } from 'lucide-react'
import { useCourse } from '../contexts/CourseContext'
import { useAuth } from '../contexts/AuthContext'

export default function CourseLayout({ children }) {
  const { progressPercent, completedCount } = useCourse()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/curso',       icon: Home,      label: 'Mi Curso'  },
    { to: '/perfil',      icon: User,      label: 'Mi Perfil' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col" 
      style={{ 
        background: 'linear-gradient(135deg, #060b14 0%, #0a1628 40%, #061020 100%)'
      }}
    >
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
        <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50">
        <div className="border-b border-white/[0.06]" style={{
          background: 'rgba(6, 11, 20, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)'
        }}>
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            
            {/* Brand */}
            <Link to="/curso" className="flex items-center gap-3 shrink-0 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)', boxShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
                  <BookOpen size={18} className="text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 animate-pulse"
                  style={{ borderColor: '#060b14' }} />
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Secretaría de Movilidad Cali
                </div>
                <div className="text-sm font-bold text-white leading-tight">Curso Virtual Pedagógico</div>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl p-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ color: isActive(l.to) ? '#fff' : 'rgba(255,255,255,0.5)' }}
                >
                  {isActive(l.to) && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.1) 100%)', border: '1px solid rgba(34,197,94,0.3)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <l.icon size={14} className="relative z-10" />
                  <span className="relative z-10">{l.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right: Progress + User */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Circular progress */}
              <div className="hidden sm:flex items-center gap-3 rounded-2xl px-4 py-2 border border-white/[0.08]"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="relative w-8 h-8">
                  <svg viewBox="0 0 36 36" className="w-8 h-8 -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="14"
                      fill="none"
                      stroke="url(#progressGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - progressPercent / 100) }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#16a34a" />
                        <stop offset="100%" stopColor="#4ade80" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">{progressPercent}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest leading-none">Progreso</div>
                  <div className="text-xs text-white font-bold leading-tight">{completedCount}/5 módulos</div>
                </div>
              </div>

              {/* User avatar + name + logout */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #16a34a, #4ade80)', boxShadow: '0 0 10px rgba(34,197,94,0.2)' }}>
                    {(user?.nombre || 'C').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-white/60 max-w-[90px] truncate">
                    {user?.nombre || 'Ciudadano'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)' }}
                  title="Cerrar sesión"
                >
                  <LogOut size={16} />
                </button>
                {/* Mobile menu toggle */}
                <button className="md:hidden p-2 rounded-xl" onClick={() => setMobileOpen(o => !o)}
                  style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)' }}>
                  {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="h-[2px] bg-white/[0.05]">
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #16a34a, #4ade80)', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>

        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(6,11,20,0.95)' }}>
              <div className="flex flex-col p-3 gap-1">
                {navLinks.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                    style={{ background: isActive(l.to) ? 'rgba(34,197,94,0.12)' : 'transparent', color: isActive(l.to) ? '#fff' : 'rgba(255,255,255,0.5)', border: isActive(l.to) ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent' }}>
                    <l.icon size={15} />{l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Content */}
      <main className="flex-1 relative z-10 animate-fade-in">
        {children}
      </main>
    </motion.div>
  )
}
