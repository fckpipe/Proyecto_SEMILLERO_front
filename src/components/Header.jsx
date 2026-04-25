import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, ChevronRight, User, LogIn, Sparkles, Globe, Calendar, LogOut, Bot } from 'lucide-react'
const logo = '/logo.transito.png'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const { user, logout } = useAuth()
  const location = useLocation()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50)
  })

  // Detect if we are in admin dashboard area
  const isAdminArea = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/citas') || 
                      location.pathname.startsWith('/horarios') || 
                      location.pathname.startsWith('/sedes') || 
                      location.pathname.startsWith('/logs')

  const navLinks = [
    { label: 'Inicio',         href: '/#inicio' },
    { label: 'Curso Virtual',  href: '/curso',   isRoute: true },
    { label: 'Centros de Gestión', href: '/#sedes' },
    { label: 'Respuestas',     href: '/#faq' },
  ]

  const isHome = location.pathname === '/'

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700 pointer-events-none">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 transition-all duration-500`}>
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`flex items-center justify-between rounded-full transition-all duration-700 px-4 md:px-8 py-2 md:py-3 pointer-events-auto border group shadow-2xl relative mx-auto ${
            scrolled 
              ? 'bg-white/80 backdrop-blur-3xl border-white/40 shadow-gris-900/10 max-w-5xl' 
              : 'bg-white/10 backdrop-blur-xl border-white/20 shadow-transparent max-w-7xl'
          }`}
        >
          {/* Subtle Inner Glow */}
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Island Logo Area */}
          <Link to="/" className="flex items-center gap-3 relative z-10">
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white p-1.5 rounded-full shadow-lg border border-gris-100/50"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-8 md:h-9 w-auto object-contain"
              />
            </motion.div>
            <div className={`hidden md:block text-left transition-colors duration-500 ${scrolled ? 'text-gris-900' : 'text-white'}`}>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-0.5 opacity-60">Movilidad</p>
                <p className="text-xs font-black uppercase tracking-widest leading-none">Cali</p>
            </div>
          </Link>

          {/* Floating Navigation Links */}
          {!isAdminArea && (
            <nav className="hidden lg:flex items-center p-1 bg-gris-900/5 backdrop-blur-sm rounded-full border border-gris-900/5 relative">
                {navLinks.map((link) => (
                  link.isRoute ? (
                    <Link
                      key={link.href}
                      to={link.href}
                      onMouseEnter={() => setHoveredLink(link.label)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 relative z-10 flex items-center gap-1.5 ${
                          scrolled ? 'text-verde-700 hover:text-verde-900' : 'text-verde-300 hover:text-verde-200'
                      }`}
                    >
                      <Bot size={11} />
                      {link.label}
                      {hoveredLink === link.label && (
                        <motion.div
                          layoutId="nav-island-pill"
                          className={`absolute inset-0 rounded-full -z-10 shadow-sm ${scrolled ? 'bg-verde-50 border border-verde-100' : 'bg-verde-500/15 border border-verde-500/25'}`}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  ) : (
                    <a
                        key={link.href}
                        href={link.href}
                        onMouseEnter={() => setHoveredLink(link.label)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 relative z-10 ${
                            scrolled ? 'text-gris-700 hover:text-gris-900' : 'text-white/80 hover:text-white'
                        }`}
                    >
                        {link.label}
                        {hoveredLink === link.label && (
                        <motion.div 
                            layoutId="nav-island-pill"
                            className={`absolute inset-0 rounded-full -z-10 shadow-sm ${scrolled ? 'bg-white border border-gris-100' : 'bg-white/10 border border-white/20'}`}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                        )}
                    </a>
                  )
                ))}
            </nav>
          )}

          {/* Adaptive Action Hub */}
          <div className="flex items-center gap-2 md:gap-4 relative z-10">
            {user ? (
               <div className="flex items-center gap-3">
                 <Link 
                   to="/dashboard" 
                   className="btn-primary rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-widest gap-2"
                 >
                   <Sparkles size={14} />
                   Panel Admin
                 </Link>
                 <button 
                   onClick={logout}
                   className={`p-2 rounded-full border transition-all ${scrolled ? 'bg-gris-100 border-gris-200 text-gris-600' : 'bg-white/10 border-white/20 text-white'}`}
                 >
                   <LogOut size={16} />
                 </button>
               </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`hidden md:block text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 px-3 ${
                      scrolled ? 'text-gris-600 hover:text-verde-600' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Admin
                </Link>
                <Link 
                  to="/curso" 
                  className="group relative hidden sm:block"
                >
                  <div className="absolute -inset-0.5 bg-verde-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition duration-500" />
                  <div className="relative rounded-full px-5 md:px-6 py-2.5 md:py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-verde-500/15 border border-verde-500/30 text-verde-300 hover:bg-verde-500/25 transition-all">
                    <Bot size={13} /> Curso Virtual
                  </div>
                </Link>
                <Link 
                  to="/agendar" 
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-verde-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition duration-500" />
                  <div className="relative btn-primary rounded-full px-5 md:px-7 py-2.5 md:py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Trámite Virtual
                  </div>
                </Link>
              </>
            )}

            {/* Mobile Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-500 ${
                scrolled 
                  ? 'bg-gris-900 text-white border-gris-800 shadow-lg' 
                  : 'bg-white/10 text-white border-white/20 backdrop-blur-md'
              }`}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Ultra-Premium Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
           <motion.div 
             initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
             animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
             exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
             className="lg:hidden fixed inset-0 bg-gris-900/40 z-[90] flex items-center justify-center p-4"
           >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-sm bg-white rounded-[3.5rem] shadow-4xl overflow-hidden p-8 border border-white"
              >
                 <div className="flex justify-between items-center mb-10">
                    <img src={logo} alt="Logo" className="h-8" />
                    <button onClick={() => setMenuOpen(false)} className="w-10 h-10 bg-gris-100 rounded-full flex items-center justify-center text-gris-900">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="space-y-1">
                    {navLinks.map((link, i) => (
                      <motion.a
                        key={link.href}
                        href={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between py-5 border-b border-gris-50 group px-2"
                      >
                         <span className="text-2xl font-display font-black text-gris-900 tracking-tight">
                            {link.label}
                         </span>
                         <ChevronRight size={18} className="text-gris-300 group-hover:text-verde-600 group-hover:translate-x-1 transition-all" />
                      </motion.a>
                    ))}
                 </div>

                 <div className="mt-10 space-y-3">
                    {user ? (
                      <>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn-primary rounded-3xl py-5 text-sm font-black uppercase w-full">
                           Panel Administrativo
                        </Link>
                        <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full py-5 text-red-500 font-black uppercase text-xs tracking-widest border border-red-50 rounded-3xl">
                           Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/curso" onClick={() => setMenuOpen(false)} className="btn-primary rounded-3xl py-5 text-sm font-black uppercase w-full shadow-2xl shadow-verde-500/20">
                           <Bot size={18} className="inline mr-2" /> Iniciar Curso Virtual
                        </Link>
                        <Link to="/agendar" onClick={() => setMenuOpen(false)} className="w-full py-5 rounded-3xl border border-gris-100 text-gris-700 font-black uppercase text-sm tracking-widest text-center flex items-center justify-center gap-2">
                           <Calendar size={16} /> Iniciar Trámite 100% Virtual
                        </Link>
                        <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full py-4 text-gris-400 font-black uppercase text-xs tracking-widest text-center block">
                           Acceso Administrador
                        </Link>
                      </>
                    )}
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
