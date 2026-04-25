import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, User, Lock, ArrowRight, CheckCircle2, AlertCircle, Building2, Info } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
const logo = '/logo.transito.png'

export default function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const images = [
    'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=2071&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=1924&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop'
  ]
  
  const [currentImg, setCurrentImg] = useState(0)

  useEffect(() => {
    // Capturar mensaje de éxito del registro si existe
    if (location.state?.message) {
      setSuccessMsg(location.state.message)
    }

    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')
    
    try {
        const usuario = await login(formData.identifier, formData.password)
        
        // El objeto usuario ahora viene de AuthContext.login() que retorna response.data.data.usuario
        // Lógica de Redirección según Roles
        if (usuario.rol === 'super_admin' || usuario.rol === 'admin_sede') {
            navigate('/dashboard')
        } else {
            // Ciudadano va al curso
            navigate('/curso')
        }
    } catch (err) {
        setError(err.message || 'Credenciales inválidas. Por favor intente de nuevo.')
        setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex bg-white font-sans overflow-hidden"
    >
      
      {/* Columna Izquierda: Formulario */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-[45%] xl:w-[40%] flex flex-col p-8 sm:p-12 lg:p-20 relative z-10 bg-white"
      >
        <div className="mb-12">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="bg-verde-50 p-2 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
                </div>
                <div>
                    <h1 className="text-xl font-display font-bold text-gris-900 leading-tight">Secretaría de <span className="text-verde-600 underline decoration-verde-500/30">Movilidad</span></h1>
                    <p className="text-[10px] text-gris-400 font-bold uppercase tracking-[0.2em]">Alcaldía de Cali</p>
                </div>
            </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="mb-10 text-left">
                <h2 className="text-4xl font-display font-extrabold text-gris-900 tracking-tight mb-3">Iniciar Sesión</h2>
                <p className="text-gris-500 font-medium">Ingresa para realizar trámites o tomar tu curso pedagógico virtual guiado por IA.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
                        >
                            <AlertCircle size={20} /> {error}
                        </motion.div>
                    )}
                    {successMsg && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-verde-50 border border-verde-100 p-4 rounded-2xl flex items-center gap-3 text-verde-600 text-sm font-bold"
                        >
                            <CheckCircle2 size={20} /> {successMsg}
                        </motion.div>
                    )}

                </AnimatePresence>

                <>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Cédula o Usuario Admin</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400 group-focus-within:text-verde-600 transition-colors" size={20} />
                            <input 
                                type="text" 
                                required
                                className="input-premium pl-12 h-14 bg-gris-50 border-gris-200 focus:bg-white"
                                placeholder="Ej: 1144001001 o 'superadmin'"
                                value={formData.identifier}
                                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest">Contraseña</label>
                            <button type="button" className="text-[10px] font-bold text-verde-600 hover:text-verde-700 transition-colors uppercase tracking-widest">¿Olvidaste tu clave?</button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400 group-focus-within:text-verde-600 transition-colors" size={20} />
                            <input 
                                type="password" 
                                required
                                className="input-premium pl-12 h-14 bg-gris-50 border-gris-200 focus:bg-white"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full btn-primary h-14 text-base font-extrabold shadow-xl shadow-verde-500/20 active:scale-95 transition-all relative overflow-hidden group"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Iniciar Sesión <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </>
            </form>

            <div className="mt-10 text-center">
                <p className="text-sm text-gris-500 font-medium">
                    ¿No tienes una cuenta? {' '}
                    <Link to="/registro" className="text-verde-600 font-extrabold hover:underline">Crear Cuenta</Link>
                </p>
            </div>
        </div>

        <div className="mt-auto pt-10 text-left">
            <div className="flex items-center gap-2 text-gris-400 text-[10px] font-bold uppercase tracking-widest">
                <Building2 size={14} /> Sistema Integrado de Movilidad - Cali
            </div>
        </div>
      </motion.div>

      {/* Columna Derecha: Galería Animada */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-gris-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-cali-gradient/40 mix-blend-multiply z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10 opacity-30" />
            <img 
              src={images[currentImg]} 
              className="w-full h-full object-cover" 
              alt="Cali Ciudad" 
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex flex-col justify-end p-20 text-white">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-xl"
            >
                <div className="w-16 h-1 bg-verde-500 mb-6 rounded-full" />
                <h2 className="text-5xl font-display font-extrabold tracking-tight mb-6">Innovación al servicio del <span className="text-verde-400">ciudadano.</span></h2>
                <p className="text-xl text-white/80 font-medium leading-relaxed">
                    Estamos transformando la movilidad de Cali con tecnología de punta y procesos eficientes.
                </p>
            </motion.div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-12 right-12 z-20 space-y-4">
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex items-center gap-4 text-white shadow-2xl">
                <div className="bg-verde-500 p-2 rounded-2xl"><CheckCircle2 size={24} /></div>
                <div>
                   <p className="text-[10px] font-bold uppercase opacity-60">Sedes Activas</p>
                   <p className="text-lg font-bold">5 Puntos de Atención</p>
                </div>
            </motion.div>
        </div>
      </div>

    </motion.div>
  )
}
