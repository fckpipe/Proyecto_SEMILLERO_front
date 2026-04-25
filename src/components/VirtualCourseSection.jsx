import { motion } from 'framer-motion'
import { UserPlus, FileSearch, GraduationCap, Award, Clock, Smartphone, Bot, CheckCircle, Zap, WifiOff } from 'lucide-react'

// ──────────────────────────────────────────────
// ¿Cómo funciona el curso virtual? — 4 pasos
// ──────────────────────────────────────────────
export function ComoFunciona() {
  const steps = [
    {
      icon: UserPlus,
      number: '01',
      title: 'Regístrate',
      desc: 'Crea tu cuenta con tu número de cédula en menos de 2 minutos. Sin formularios complicados.',
      color: 'from-blue-600 to-blue-800',
      glow: 'rgba(37,99,235,0.3)',
    },
    {
      icon: FileSearch,
      number: '02',
      title: 'Valida tu comparendo',
      desc: 'Ingresa el número de tu comparendo. La IA verifica automáticamente tu información ante las bases de datos oficiales.',
      color: 'from-verde-500 to-verde-700',
      glow: 'rgba(34,197,94,0.3)',
    },
    {
      icon: GraduationCap,
      number: '03',
      title: 'Toma el curso con IA',
      desc: 'Aprende a tu ritmo con nuestro asistente de IA. Videos, evaluaciones interactivas y retroalimentación personalizada.',
      color: 'from-indigo-500 to-indigo-700',
      glow: 'rgba(99,102,241,0.3)',
    },
    {
      icon: Award,
      number: '04',
      title: 'Obtén tu certificado',
      desc: 'Al aprobar la evaluación final, descarga tu certificado oficial al instante. 100% válido ante el organismo de tránsito.',
      color: 'from-dorado-400 to-dorado-600',
      glow: 'rgba(234,179,8,0.3)',
    },
  ]

  return (
    <section id="como-funciona" className="py-24 bg-gris-900 relative overflow-hidden">
      {/* BG decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.06)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.06)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-verde-500/10 border border-verde-500/20 text-verde-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Bot size={14} /> Proceso simplificado
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight mb-4">
            ¿Cómo funciona el{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-verde-300 to-verde-500">
              curso virtual?
            </span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Cuatro pasos sencillos para cumplir tu sanción desde donde estés, sin filas ni desplazamientos.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line - desktop only */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-600/30 via-verde-500/30 to-dorado-400/30 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 100 }}
              className="relative group"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col items-center">
                {/* Step Number */}
                <div className="text-xs font-bold text-white/20 tracking-[0.3em] uppercase mb-4">{step.number}</div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10`}
                  style={{ boxShadow: `0 8px 32px ${step.glow}` }}
                >
                  <step.icon size={28} className="text-white" />
                </div>

                <h3 className="text-lg font-display font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{step.desc}</p>

                {/* Arrow for non-last items */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden mt-6 text-white/20 text-2xl">↓</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// Ventajas del curso virtual — Cards
// ──────────────────────────────────────────────
export function VentajasVirtual() {
  const advantages = [
    {
      icon: WifiOff,
      emoji: '🚫',
      title: 'Sin filas',
      desc: 'Olvídate de madrugar. Realiza tu trámite completamente en línea desde cualquier lugar.',
      accent: 'verde',
    },
    {
      icon: Clock,
      emoji: '🕐',
      title: 'Disponible 24/7',
      desc: 'El sistema nunca cierra. Toma el curso a la hora que quieras, sin restricciones horarias.',
      accent: 'blue',
    },
    {
      icon: Smartphone,
      emoji: '📱',
      title: 'Desde tu celular',
      desc: 'Compatible con cualquier dispositivo: celular, tablet o computador. Solo necesitas internet.',
      accent: 'indigo',
    },
    {
      icon: Bot,
      emoji: '🤖',
      title: 'IA que te acompaña',
      desc: 'Nuestro asistente de IA responde tus preguntas, explica los temas y adapta el contenido a ti.',
      accent: 'verde',
    },
    {
      icon: Zap,
      emoji: '⚡',
      title: 'Certificado inmediato',
      desc: 'Al terminar y aprobar, descarga al instante tu certificado oficial. Sin esperas adicionales.',
      accent: 'dorado',
    },
    {
      icon: CheckCircle,
      emoji: '✅',
      title: '100% oficial',
      desc: 'El certificado es completamente válido ante todos los organismos de tránsito del país.',
      accent: 'blue',
    },
  ]

  const accentMap = {
    verde: {
      bg: 'bg-verde-500/10',
      border: 'border-verde-500/20',
      icon: 'bg-verde-500/20 text-verde-400',
      hover: 'hover:border-verde-500/40',
    },
    blue: {
      bg: 'bg-blue-600/10',
      border: 'border-blue-600/20',
      icon: 'bg-blue-600/20 text-blue-400',
      hover: 'hover:border-blue-500/40',
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      icon: 'bg-indigo-500/20 text-indigo-400',
      hover: 'hover:border-indigo-500/40',
    },
    dorado: {
      bg: 'bg-dorado-400/10',
      border: 'border-dorado-400/20',
      icon: 'bg-dorado-400/20 text-dorado-400',
      hover: 'hover:border-dorado-400/40',
    },
  }

  return (
    <section id="ventajas" className="py-24 bg-[#f8fafc] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,197,94,0.04)_0%,transparent_50%),radial-gradient(circle_at_80%_50%,rgba(37,99,235,0.04)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-verde-500/10 border border-verde-500/20 text-verde-700 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={14} /> ¿Por qué elegirnos?
          </div>
          <h2 className="section-title">
            Ventajas del{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-verde-600">
              curso virtual
            </span>
          </h2>
          <p className="section-subtitle mx-auto">
            Diseñado para que cumplas tu obligación vial con la mayor comodidad y sin complicaciones.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((a, i) => {
            const acc = accentMap[a.accent]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative bg-white border ${acc.border} ${acc.hover} rounded-[2rem] p-7 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 overflow-hidden`}
              >
                {/* Subtle bg glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${acc.bg} rounded-full blur-3xl -translate-y-8 translate-x-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className={`w-14 h-14 rounded-2xl ${acc.icon} flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <a.icon size={26} />
                </div>

                <h3 className="text-lg font-display font-bold text-gris-900 mb-2">{a.title}</h3>
                <p className="text-sm text-gris-500 leading-relaxed">{a.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// Atención PQR — Sección
// ──────────────────────────────────────────────
export function AtencionPQR() {
  return (
    <section id="pqr" className="py-24 bg-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-verde-50/40" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[3rem] bg-gris-900 p-10 sm:p-14 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10 shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-verde-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />

          {/* Left: Icon + Text */}
          <div className="flex-1 relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-verde-500/20 border border-verde-500/30 mb-6 mx-auto lg:mx-0">
              <Bot size={36} className="text-verde-400" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-verde-500/10 border border-verde-500/20 text-verde-400 text-xs font-bold uppercase tracking-widest mb-5">
              Atención PQR · IA
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight mb-4">
              ¿Tienes dudas o quejas?{' '}
              <span className="text-verde-400">Nuestra IA las atiende en segundos,</span>{' '}
              a cualquier hora
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl">
              Sin tiempos de espera. Sin formularios interminables. Nuestro asistente de inteligencia artificial está disponible las 24 horas para resolver tus peticiones, quejas y recursos al instante.
            </p>
          </div>

          {/* Right: CTA + stats */}
          <div className="flex flex-col items-center gap-6 relative z-10 shrink-0">
            {/* Chat bubbles */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 w-64 space-y-3">
              {[
                { side: 'left', text: '¿Cuándo vence mi plazo?', time: 'Ahora' },
                { side: 'right', text: 'Tienes hasta el 15 de abril. ¿Quieres agendar?', time: '00:01' },
                { side: 'left', text: 'Sí, por favor', time: '00:01' },
              ].map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.2 }}
                  className={`flex ${msg.side === 'right' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-snug ${
                      msg.side === 'right'
                        ? 'bg-verde-500 text-white rounded-br-sm'
                        : 'bg-white/10 text-white/80 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div className="flex items-center gap-2 text-white/30 text-[10px]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verde-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-verde-500"></span>
                </span>
                IA escribiendo...
              </div>
            </div>

            <a
              href="#pqr-chat"
              className="btn-primary px-8 py-4 text-white text-base shadow-neon w-full justify-center"
              onClick={(e) => e.preventDefault()}
            >
              <Bot size={20} />
              Iniciar chat de atención
            </a>

            <p className="text-white/30 text-xs text-center">
              Tiempo de respuesta promedio: <strong className="text-verde-400/70">menos de 3 segundos</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
