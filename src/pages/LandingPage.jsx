import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { 
  ArrowRight, 
  Bot, 
  Mail, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Globe,
  ChevronRight,
  Menu,
  X,
  Calendar,
  User as UserIcon,
  MonitorPlay
} from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import Header from '../components/Header'
import CourseInfo from '../components/CourseInfo'
import Requirements from '../components/Requirements'
import Sedes from '../components/Sedes'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import { ComoFunciona, VentajasVirtual, AtencionPQR } from '../components/VirtualCourseSection'
import ChatbotWidget from '../components/chatbot/ChatbotWidget'

export default function LandingPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  return (
    <div ref={containerRef} className="relative bg-white font-sans overflow-x-hidden" style={{ position: 'relative' }}>
      <Header />
      
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroSection />
      </section>

      {/* Quick Access Stats */}
      <section className="py-12 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
             {[
               { icon: MonitorPlay, title: '100% Virtual', desc: 'Realiza tu curso desde casa' },
               { icon: Mail, title: 'Gestión por Correo', desc: 'Procesamiento automático con IA' },
               { icon: Globe, title: 'Cobertura Nacional', desc: 'Sin filas ni desplazamientos' },
               { icon: ShieldCheck, title: '100% Oficial', desc: 'Certificado avalado por el Estado' }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="p-6 rounded-[2rem] bg-gris-50 border border-gris-100 hover:bg-white hover:shadow-xl transition-all duration-500 group"
               >
                 <div className="w-12 h-12 rounded-2xl bg-cali-gradient text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <item.icon size={24} />
                 </div>
                 <h3 className="text-lg font-display font-bold text-gris-900 mb-1">{item.title}</h3>
                 <p className="text-sm text-gris-500 font-medium leading-relaxed">{item.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona el curso virtual? */}
      <ComoFunciona />

      {/* Ventajas del curso virtual */}
      <VentajasVirtual />

      {/* Main Content: Info Cursos */}
      <CourseInfo />

      {/* AI Automation Section (Immersive) */}
      <section className="py-24 bg-gris-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-cali-gradient opacity-10 mix-blend-screen" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="flex-1 text-white"
           >
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-verde-500/10 border border-verde-500/20 text-verde-400 text-xs font-bold uppercase tracking-widest mb-8">
               <Bot size={14} /> Inteligencia Artificial
             </div>
             <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-8 leading-[1.1]">
                Radica tu curso vial con nuestro <span className="text-verde-400">Procesador IA</span>
             </h2>
             <p className="text-lg text-white/70 font-medium mb-10 leading-relaxed max-w-xl">
                Nuestro sistema analiza tus correos electrónicos automáticamente para detectar tus necesidades y agendarte en segundos, sin filas ni esperas.
             </p>
             <div className="space-y-6 mb-12">
                {[
                  'Detección automática de comparendos',
                  'Validación de requisitos legales en tiempo real',
                  'Agendamiento optimizado por sede',
                  'Confirmación inmediata vía correo'
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-verde-500 flex items-center justify-center text-white"><CheckCircle2 size={14} /></div>
                    <span className="font-bold text-white/90">{text}</span>
                  </div>
                ))}
             </div>
             <Link to="/radicar" className="btn-primary px-10 py-5 text-base shadow-2xl shadow-verde-500/20 active:scale-95 transition-all">
                Radicar Trámite Ahora <ArrowRight size={20} className="ml-2" />
             </Link>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="flex-1 relative lg:mt-0 mt-12"
           >
             <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-4 sm:p-8 shadow-3xl">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                   <div className="w-10 h-10 rounded-full bg-verde-500 flex items-center justify-center text-white"><Mail size={20} /></div>
                   <div className="text-left">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Simulación del Sistema</p>
                      <p className="text-sm font-bold text-white">Bandeja de Entrada Admin</p>
                   </div>
                </div>
                <div className="space-y-4">
                   {[1, 2, 3].map((_, i) => (
                     <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all cursor-default">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-gris-800 flex items-center justify-center text-gris-400 group-hover:text-verde-400 transition-colors">
                              <UserIcon size={20} />
                           </div>
                           <div className="text-left">
                              <p className="text-xs font-bold text-white">Ciudadano #{2050 + i}</p>
                              <p className="text-[10px] text-white/40">Solicitud de curso vial</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="px-3 py-1 rounded-full bg-verde-500/20 text-verde-400 text-[10px] font-bold border border-verde-500/20">Procesado</div>
                           <ChevronRight size={14} className="text-white/20" />
                        </div>
                     </div>
                   ))}
                </div>
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-dashed border-white/10 flex items-center justify-center gap-3 text-white/40 italic text-sm">
                   <Clock size={16} /> Procesando nuevos correos...
                </div>
             </div>
             {/* Floating Accent */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-verde-500/10 rounded-full blur-3xl" />
             <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
           </motion.div>
        </div>
      </section>

      {/* Atención PQR */}
      <AtencionPQR />

      {/* Chatbot Embebido de Agendamiento */}
      <section className="py-24 bg-gris-50 relative border-t border-gris-200">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
               <Bot size={14} /> Asistente 24/7
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-gris-900 mb-6 leading-tight">Agendamiento <span className="text-blue-600">Automatizado</span></h2>
            <p className="text-lg text-gris-600 mb-8 leading-relaxed max-w-lg">Nuestro motor conversacional te guiará paso a paso para agendar tu curso pedagógico, consultar tus comparendos o cancelar citas activas asociadas a tu número de documento, sin tiempos de espera.</p>
          </div>
          <div className="flex-1 flex justify-center w-full relative z-10">
            <ChatbotWidget />
          </div>
        </div>
      </section>

      {/* Requisitos, Sedes, FAQ */}
      <Requirements />
      <div id="sedes">
        <Sedes />
      </div>
      <FAQ />

      <Footer />
    </div>
  )
}
