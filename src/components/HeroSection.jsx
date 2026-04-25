import { Shield, CalendarCheck, ArrowRight, PlayCircle, Bot, Laptop } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-[100vh] flex items-center overflow-hidden bg-gris-900"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/fondo.hero.jpg" 
          alt="Clase de Movilidad Vial" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gris-900 via-gris-900/85 to-gris-900/50" />
        {/* Animated orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-verde-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:py-40">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Text column */}
          <div className="lg:col-span-7 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-8 shadow-glass uppercase tracking-wider">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verde-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-verde-500"></span>
              </span>
              Portal Oficial · Secretaría de Movilidad de Cali
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-[1.08] tracking-tight">
              Realiza tu curso pedagógico de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-verde-300 to-verde-500 inline-block">
                seguridad vial
              </span>{' '}
              desde casa
            </h1>

            <p className="mt-8 text-lg md:text-xl text-white/80 leading-relaxed font-sans max-w-2xl font-light">
              Inteligencia Artificial disponible{' '}
              <span className="text-verde-400 font-semibold">24/7</span> para guiarte, enseñarte y evaluarte.
              Sin filas, sin desplazamientos, a tu ritmo.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/curso"
                className="btn-primary px-8 py-4 text-white text-base shadow-neon"
              >
                <Bot size={20} />
                Iniciar curso virtual
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/#como-funciona"
                className="btn-outline border-white/30 text-white hover:bg-white/10 hover:text-white px-8 py-4 text-base backdrop-blur-sm shadow-glass"
              >
                <CalendarCheck size={20} />
                ¿Cómo funciona lo virtual?
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-verde-900 object-cover"
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="Usuario"
                  />
                ))}
              </div>
              <div>
                <div className="text-xl font-bold text-white font-display">+15.000</div>
                <div className="text-sm text-white/60 font-sans">Conductores capacitados este año</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Laptop size={16} className="text-verde-400" />
                <span>Disponible desde cualquier dispositivo</span>
              </div>
            </div>
          </div>

          {/* Decorative floating card */}
          <div className="lg:col-span-5 hidden lg:block relative h-full">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-md animate-float">
              
              {/* Main Card */}
              <div className="card-glass bg-white/10 border-white/20 p-8 shadow-glass-dark relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-verde-400/20 rounded-full blur-3xl" />
                
                <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-6 relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-verde-400 to-verde-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-white">Plataforma 100% Virtual con IA</h3>
                    <p className="text-white/60 text-sm mt-0.5">Gestión inmediata sin traslados físicos</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { step: '01', title: 'Regístrate en minutos' },
                    { step: '02', title: 'Valida tu comparendo' },
                    { step: '03', title: 'Toma el curso con IA' },
                    { step: '04', title: 'Descarga tu certificado' }
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.15 }}
                      className="flex items-center gap-4 bg-white/5 backdrop-blur-md rounded-xl p-3.5 border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="text-verde-400 font-display font-bold text-base w-8">{s.step}</div>
                      <div className="text-white/90 text-sm font-medium">{s.title}</div>
                      <div className="ml-auto w-2 h-2 rounded-full bg-verde-500/60" />
                    </motion.div>
                  ))}
                </div>

                {/* Pulsing indicator */}
                <div className="mt-5 flex items-center gap-2 text-verde-400 text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verde-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-verde-500"></span>
                  </span>
                  IA activa y lista para enseñarte
                </div>
              </div>

              {/* Small floating badge */}
              <div className="absolute -left-12 bottom-12 card-glass bg-white/20 border-white/30 p-4 shadow-glass-dark flex items-center gap-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <div className="w-9 h-9 bg-dorado-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Certificado oficial</div>
                  <div className="text-white/60 text-xs">Entidad avalada por el Estado</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
        <svg className="relative block w-full h-16 md:h-24 lg:h-32" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.9,122.9,190.9,111.45,234.66,103.11,273.84,80.1,321.39,56.44Z" className="fill-[#f8fafc]"></path>
        </svg>
      </div>
    </section>
  )
}
