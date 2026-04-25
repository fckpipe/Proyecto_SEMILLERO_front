import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Calendar,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PageWrapper } from '../components/UIUtilities'
import Header from '../components/Header'
import logo from '../logo_transito.png'

export default function Enrollment() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    comparendo: '',
    sede: 'Unidad Administrativa - Salomia',
    fecha: ''
  })
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const navigate = useNavigate()

  const sedes = ['Unidad Administrativa - Salomia', 'Centro Virtual Sur', 'Centro Virtual Norte']

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulación de procesamiento
    setTimeout(() => {
      setLoading(false)
      setCompleted(true)
    }, 2000)
  }

  const stepsContent = [
    {
      title: "Datos Personales",
      subtitle: "Ingresa tu información básica de identificación",
      fields: [
        { label: "Nombre Completo", icon: User, name: "nombre", type: "text", placeholder: "Ej. Juan Pérez" },
        { label: "Documento de Identidad", icon: CreditCard, name: "cedula", type: "text", placeholder: "CC 12345678" }
      ]
    },
    {
      title: "Contacto y Trámite",
      subtitle: "Información para la confirmación y el comparendo",
      fields: [
        { label: "Correo Electrónico", icon: Mail, name: "email", type: "email", placeholder: "juan@correo.com" },
        { label: "Número de Celular", icon: Phone, name: "telefono", type: "tel", placeholder: "300 000 0000" },
        { label: "Número de Comparendo", icon: FileText, name: "comparendo", type: "text", placeholder: "760010000000..." }
      ]
    },
    {
      title: "Asignación Virtual",
      subtitle: "Selecciona el centro de gestión para procesar tu trámite",
      fields: [] // Custom rendered below
    }
  ]

  if (completed) {
    return (
      <div className="min-h-screen bg-white font-sans overflow-hidden">
        <Header />
        <div className="pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-xl w-full"
            >
                <div className="w-24 h-24 bg-verde-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-verde-500/20">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="text-4xl font-display font-black text-gris-900 mb-4 tracking-tight">¡Trámite Radicado!</h1>
                <p className="text-lg text-gris-500 font-medium mb-12">
                   Hemos recibido tu solicitud. Recibirás las credenciales de acceso al curso en tu correo: <span className="text-gris-900 font-bold">{formData.email}</span>
                </p>
                
                <div className="bg-gris-50 rounded-[2.5rem] p-8 border border-gris-100 mb-10 text-left space-y-4">
                    <div className="flex items-center gap-4 text-gris-700">
                       <div className="w-10 h-10 rounded-xl bg-white border border-gris-200 flex items-center justify-center"><ShieldCheck size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-gris-400">Estado del Proceso</p>
                          <p className="font-bold">Pendiente por Sincronización</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 text-gris-700">
                       <div className="w-10 h-10 rounded-xl bg-white border border-gris-200 flex items-center justify-center"><MonitorPlay size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-gris-400">Unidad de Gestión</p>
                          <p className="font-bold">{formData.sede}</p>
                       </div>
                    </div>
                </div>

                <Link to="/" className="btn-primary w-full py-5 rounded-full text-lg font-black uppercase tracking-widest shadow-2xl shadow-verde-500/20">
                   Volver al Inicio
                </Link>
            </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden">
      <Header />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50vw] h-full bg-gris-50 -z-10" />

      <main className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center min-h-[calc(100vh-80px)]">
        
        {/* Intro Section */}
        <div className="flex-1 space-y-8">
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-verde-50 text-verde-600 border border-verde-200 text-xs font-black uppercase tracking-widest">
                   <ShieldCheck size={14} /> Solicitud Institucional
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-black text-gris-900 leading-none tracking-tighter">
                   Radica tu curso vial <span className="text-verde-600 underline decoration-verde-500/20">hoy mismo.</span>
                </h1>
                <p className="text-xl text-gris-500 font-medium leading-relaxed max-w-xl text-balance">
                   Realiza el curso pedagógico 100% virtual desde casa, sin filas ni desplazamientos físicos. Nuestra IA validará tu trámite en segundos.
                </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[2rem] bg-white border border-gris-100 shadow-sm flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gris-900 text-white flex items-center justify-center"><Clock size={20} /></div>
                    <p className="text-sm font-black text-gris-900 uppercase tracking-widest leading-none">Rápido</p>
                    <p className="text-xs text-gris-400 font-medium tracking-tight">Menos de 2 minutos para completar.</p>
                </div>
                <div className="p-6 rounded-[2rem] bg-verde-500 text-white shadow-xl shadow-verde-500/20 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center"><ShieldCheck size={20} /></div>
                    <p className="text-sm font-black uppercase tracking-widest leading-none">Seguro</p>
                    <p className="text-xs text-white/70 font-medium tracking-tight">Tus datos están protegidos por SSL.</p>
                </div>
            </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 w-full max-w-xl">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] p-8 md:p-12 shadow-3xl border border-gris-100"
            >
                {/* Progress Bar */}
                <div className="flex gap-2 mb-12">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="flex-1 h-1.5 rounded-full relative overflow-hidden bg-gris-100">
                        {step >= i && (
                          <motion.div 
                            layoutId="progress-bar"
                            className="absolute inset-0 bg-verde-500"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                          />
                        )}
                     </div>
                   ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-2">
                               <h2 className="text-2xl font-display font-black text-gris-900 tracking-tight">{stepsContent[step-1].title}</h2>
                               <p className="text-sm text-gris-400 font-medium">{stepsContent[step-1].subtitle}</p>
                            </div>

                            <div className="space-y-5">
                               {step < 3 ? (
                                 stepsContent[step-1].fields.map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <label className="text-[10px] font-black text-gris-400 uppercase tracking-widest pl-1">{field.label}</label>
                                        <div className="relative group">
                                            <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-300 group-focus-within:text-verde-600 transition-colors" size={20} />
                                            <input 
                                                type={field.type}
                                                required
                                                placeholder={field.placeholder}
                                                className="input-premium pl-12 h-14 bg-gris-50 border-gris-100 focus:bg-white"
                                                value={formData[field.name]}
                                                onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                 ))
                               ) : (
                                  <div className="space-y-6">
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gris-400 uppercase tracking-widest pl-1">Sede de preferencia</label>
                                        <div className="grid grid-cols-1 gap-2">
                                           {sedes.map(s => (
                                              <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFormData({...formData, sede: s})}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                                  formData.sede === s 
                                                    ? 'border-verde-500 bg-verde-50/50 text-verde-700' 
                                                    : 'border-gris-50 bg-gris-50 text-gris-500 hover:border-gris-100'
                                                }`}
                                              >
                                                <span className="text-sm font-bold">{s}</span>
                                                {formData.sede === s && <CheckCircle2 size={18} />}
                                              </button>
                                           ))}
                                        </div>
                                     </div>
                                  </div>
                               )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="pt-4 flex gap-4">
                        {step > 1 && (
                          <button 
                            type="button" 
                            onClick={prevStep}
                            className="flex-1 h-14 rounded-full border-2 border-gris-100 text-gris-500 font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gris-50 transition-all"
                          >
                             <ChevronLeft size={20} /> Atrás
                          </button>
                        )}
                        
                        {step < 3 ? (
                          <button 
                            type="button" 
                            onClick={nextStep}
                            disabled={!formData[stepsContent[step-1].fields[0].name]}
                            className="btn-primary flex-[2] h-14 rounded-full uppercase font-black tracking-widest group shadow-2xl shadow-verde-500/20 disabled:opacity-50 disabled:shadow-none"
                          >
                             Siguiente <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        ) : (
                           <button 
                             type="submit" 
                             disabled={loading}
                             className="btn-primary flex-[2] h-14 rounded-full uppercase font-black tracking-widest group shadow-2xl shadow-verde-500/20"
                           >
                             {loading ? (
                               <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             ) : (
                               <span className="flex items-center gap-2">Confirmar Radicación <CheckCircle2 size={20} /></span>
                             )}
                           </button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
      </main>
    </div>
  )
}
