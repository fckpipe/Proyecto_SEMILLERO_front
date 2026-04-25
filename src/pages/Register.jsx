import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, User, Mail, Lock, Building2, ArrowLeft, ArrowRight, ShieldCheck, MapPin, Clock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
const logo = '/logo.transito.png'

export default function Register() {
  const [formData, setFormData] = useState({ 
    cedula: '',
    nombre: '', 
    apellido: '',
    telefono: '',
    email: '', 
    password: '', 
    sede: 'Centro Norte' 
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { register } = useAuth()

  const images = [
    'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=2071&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=1924&auto=format&fit=crop'
  ]
  const [currentImg, setCurrentImg] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
        await register(formData)
        setSuccess(true)
        setLoading(false)
        // Redirigir al login inmediatamente con mensaje de éxito
        navigate('/login', { state: { message: '¡Cuenta creada! Ya puedes iniciar sesión.' } })
    } catch (err) {
        setLoading(false)
        setError(err.message || 'Ocurrió un error al registrarse. Inténtalo de nuevo.')
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      
      {/* Columna Izquierda: Formulario */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-[45%] xl:w-[40%] flex flex-col p-8 sm:p-12 lg:p-20 relative z-10 bg-white"
      >
        <div className="mb-8">
            <Link to="/" className="flex items-center gap-3">
                <div className="bg-verde-50 p-2 rounded-2xl">
                    <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
                </div>
                <div>
                    <h1 className="text-xl font-display font-bold text-gris-900 leading-tight">Secretaría de <span className="text-verde-600">Movilidad</span></h1>
                    <p className="text-[10px] text-gris-400 font-bold uppercase tracking-[0.2em]">Registro de Ciudadanos</p>
                </div>
            </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-24 h-24 bg-verde-50 text-verde-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-verde-200">
                            <ShieldCheck size={48} />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-gris-900">Solicitud Exitosa</h2>
                        <p className="text-gris-500 font-medium">
                            Tu cuenta ha sido creada. Ahora puedes iniciar sesión para gestionar tus trámites.
                        </p>
                        <div className="w-12 h-1 bg-verde-500 mx-auto rounded-full animate-pulse" />
                    </motion.div>
                ) : (
                    <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                        <div className="mb-6">
                            <h2 className="text-4xl font-display font-extrabold text-gris-900 tracking-tight mb-3">Crear Cuenta</h2>
                            <p className="text-gris-500 font-medium">Regístrate para realizar tu curso pedagógico virtual y gestionar comparendos.</p>
                        </div>
                        {error && (
                          <div className="mb-4 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                            <span>⚠️</span> {error}
                          </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Cédula</label>
                                    <div className="relative group">
                                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-400" size={16} />
                                      <input type="text" required className="input-premium pl-9 h-12 bg-gris-50" placeholder="114400..." value={formData.cedula} onChange={(e) => setFormData({...formData, cedula: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Teléfono</label>
                                    <input type="tel" className="input-premium h-12 bg-gris-50 px-4" placeholder="300 000 0000" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Nombres</label>
                                    <input type="text" required className="input-premium h-12 bg-gris-50 px-4" placeholder="Juan" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Apellidos</label>
                                    <input type="text" required className="input-premium h-12 bg-gris-50 px-4" placeholder="Pérez" value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" size={20} />
                                    <input type="email" required className="input-premium pl-12 h-12 bg-gris-50" placeholder="ejemplo@correo.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Sede de Preferencia</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400 group-focus-within:text-verde-600 transition-colors" size={20} />
                                    <select 
                                        className="input-premium pl-12 h-14 bg-gris-50 border-gris-200 appearance-none"
                                        value={formData.sede}
                                        onChange={(e) => setFormData({...formData, sede: e.target.value})}
                                    >
                                        <option>Centro Norte</option>
                                        <option>Centro Sur</option>
                                        <option>Centro Oriente</option>
                                        <option>Centro Oeste</option>
                                        <option>Centro Centro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Contraseña</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400 group-focus-within:text-verde-600 transition-colors" size={20} />
                                    <input 
                                        type="password" 
                                        required
                                        className="input-premium pl-12 h-14 bg-gris-50 border-gris-200"
                                        placeholder="Min. 8 caracteres"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full btn-primary h-14 text-base font-extrabold shadow-xl shadow-verde-500/20 active:scale-95 transition-all mt-4"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Crear mi Cuenta <UserPlus size={20} />
                                    </span>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-8 text-center">
                <p className="text-sm text-gris-500 font-medium">
                    ¿Ya tienes una cuenta? {' '}
                    <Link to="/login" className="text-verde-600 font-extrabold hover:underline">Iniciar Sesión</Link>
                </p>
            </div>
        </div>

        <div className="mt-auto pt-8">
            <Link to="/login" className="flex items-center gap-2 text-gris-400 text-[10px] font-bold uppercase tracking-widest hover:text-gris-600 transition-colors">
                <ArrowLeft size={14} /> Volver
            </Link>
        </div>
      </motion.div>

      {/* Columna Derecha: Galería Animada */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-gris-900 border-l border-gris-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gris-900/40 z-10" />
            <img 
              src={images[currentImg]} 
              className="w-full h-full object-cover" 
              alt="Movilidad Cali" 
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex flex-col justify-center p-20 text-white">
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-xl"
            >
                <h2 className="text-6xl font-display font-extrabold tracking-tight mb-8">Únete al equipo del <span className="text-verde-400">futuro.</span></h2>
                <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg p-5 rounded-[2rem] border border-white/10">
                        <div className="w-12 h-12 rounded-2xl bg-verde-500 flex items-center justify-center shadow-lg"><ShieldCheck size={28} /></div>
                        <div>
                            <p className="text-sm font-extrabold">Seguridad Institucional</p>
                            <p className="text-xs text-white/60">Protocolos de acceso restringido.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg p-5 rounded-[2rem] border border-white/10">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg"><Clock size={28} /></div>
                        <div>
                            <p className="text-sm font-extrabold">Gestión en tiempo real</p>
                            <p className="text-xs text-white/60">Control total de agenda y sedes.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>

    </div>
  )
}
