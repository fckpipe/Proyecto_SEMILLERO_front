import { useNavigate } from 'react-router-dom'
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { 
  Play, Lock, CheckCircle, Clock, ChevronRight, 
  Award, BookOpen, Target, Zap, ArrowRight, 
  ShieldAlert, Flame, Trophy, BarChart3, Star, 
  Wallet, TrendingDown, Search, Download, Sparkle, ExternalLink
} from 'lucide-react'
import { useCourse } from '../../contexts/CourseContext'
import { useAuth } from '../../contexts/AuthContext'
import { MODULES } from '../../utils/courseData'
import CourseLayout from '../../layouts/CourseLayout'
import api from '../../services/api'

const STATUS_CONFIG = {
  locked:       { label: 'Bloqueado',    icon: Lock,        borderColor: 'rgba(255,255,255,0.06)', bg: 'rgba(255,255,255,0.03)', glow: 'transparent' },
  available:    { label: 'Disponible',   icon: Play,        borderColor: 'rgba(34,197,94,0.35)',   bg: 'rgba(34,197,94,0.05)',   glow: 'rgba(34,197,94,0.15)' },
  'in-progress':{ label: 'En Progreso',  icon: Zap,         borderColor: 'rgba(59,130,246,0.35)',  bg: 'rgba(59,130,246,0.05)',  glow: 'rgba(59,130,246,0.15)' },
  completed:    { label: 'Completado',   icon: CheckCircle, borderColor: 'rgba(34,197,94,0.4)',    bg: 'rgba(34,197,94,0.07)',   glow: 'rgba(34,197,94,0.18)' },
}

const MOD_GRADIENTS = {
  1: ['#2563eb', '#60a5fa'],
  2: ['#16a34a', '#4ade80'],
  3: ['#7c3aed', '#a78bfa'],
  4: ['#dc2626', '#f87171'],
  5: ['#d97706', '#fbbf24'],
}

function AnimatedCounter({ target, duration = 1500 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start = Math.min(start + step, target)
      setCount(Math.floor(start))
      if (start >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count}</span>
}

function ModuleCard({ mod, status, onClick, index }) {
  const cfg = STATUS_CONFIG[status]
  const StatusIcon = cfg.icon
  const isClickable = status !== 'locked'
  const [hovered, setHovered] = useState(false)
  const [grad] = useState(MOD_GRADIENTS[mod.id] || ['#16a34a', '#4ade80'])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.09, type: 'spring', stiffness: 120, damping: 18 }}
      onClick={isClickable ? onClick : undefined}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`relative rounded-[1.75rem] overflow-hidden transition-all duration-300 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      style={{
        border: `1px solid ${hovered && isClickable ? cfg.borderColor.replace('0.35', '0.6').replace('0.4', '0.6') : cfg.borderColor}`,
        background: cfg.bg,
        boxShadow: hovered && isClickable ? `0 20px 60px -10px ${cfg.glow}, 0 0 0 1px ${cfg.borderColor}` : 'none',
        transform: hovered && isClickable ? 'translateY(-4px) scale(1.01)' : 'none',
        opacity: status === 'locked' ? 0.45 : 1,
      }}
    >
      {/* Gradient top stripe */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${grad[0]}, ${grad[1]})` }} />

      {/* Glow bg blob */}
      {isClickable && (
        <motion.div
          animate={{ opacity: hovered ? 0.15 : 0, scale: hovered ? 1.2 : 0.8 }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${grad[1]}, transparent)`, transform: 'translate(40%, -40%)' }}
        />
      )}

      <div className="relative z-10 p-6">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <motion.div
            animate={{ scale: hovered && isClickable ? 1.1 : 1, rotate: hovered && isClickable ? 5 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl"
            style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`, boxShadow: `0 8px 24px ${grad[0]}55` }}
          >
            {mod.icon}
          </motion.div>

          <motion.div 
            animate={status === 'in-progress' ? { opacity: [1, 0.6, 1], scale: [1, 1.05, 1] } : {}}
            transition={status === 'in-progress' ? { duration: 2, repeat: Infinity } : {}}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border"
            style={{
              background: cfg.bg,
              borderColor: cfg.borderColor,
              color: status === 'completed' ? '#4ade80' : status === 'in-progress' ? '#93c5fd' : status === 'available' ? '#86efac' : 'rgba(255,255,255,0.3)'
            }}>
            <StatusIcon size={11} className={status === 'in-progress' ? 'animate-pulse' : ''} />
            {cfg.label}
          </motion.div>
        </div>

        {/* Text */}
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: `${grad[1]}99` }}>
          Módulo {String(mod.id).padStart(2, '0')}
        </div>
        <h3 className="text-base font-bold text-white mb-2 leading-snug">{mod.title}</h3>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>{mod.description}</p>

        {/* Lessons pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {mod.lessons.slice(0, 2).map((lesson, li) => (
            <span key={li} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
              {lesson.title.length > 28 ? lesson.title.slice(0, 28) + '…' : lesson.title}
            </span>
          ))}
          {mod.lessons.length > 2 && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
              +{mod.lessons.length - 2} más
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <Clock size={12} />
            <span>{mod.estimatedMinutes} min</span>
            <span className="w-0.5 h-0.5 rounded-full bg-white/20 mx-1" />
            <span>{mod.lessons.length} lecciones</span>
          </div>
          {isClickable && (
            <motion.div
              animate={{ x: hovered ? 4 : 0 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${grad[0]}33, ${grad[1]}33)`, border: `1px solid ${grad[1]}33` }}
            >
              <ChevronRight size={15} style={{ color: grad[1] }} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Completed shimmer overlay */}
      {status === 'completed' && (
        <div className="absolute inset-0 pointer-events-none rounded-[1.75rem] overflow-hidden">
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.5, delay: index * 0.3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 }}
            className="absolute inset-y-0 w-1/3 opacity-10"
            style={{ background: 'linear-gradient(90deg, transparent, white, transparent)', transform: 'skewX(-12deg)' }}
          />
        </div>
      )}
    </motion.div>
  )
}

export default function CursoPortal() {
  const navigate = useNavigate()
  const { 
    moduleState, progressPercent, completedCount, allModulesCompleted, 
    examResult, certificateUnlocked, multas, ahorroTotal, 
    showSavingCelebration, setShowSavingCelebration, fetchMultas, aplicarDescuento, multasFetched
  } = useCourse()
  const { user } = useAuth()
  const [searching, setSearching] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [searchType, setSearchType] = useState('cedula')

  useEffect(() => {
    if (user?.cedula && !multasFetched) {
      fetchMultas()
    }
  }, [user, fetchMultas, multasFetched])

  const firstName = user?.nombre?.split(' ')[0] || 'Ciudadano'
  const remaining = (MODULES.length - completedCount) * 30

  const handleModuleClick = (mod) => {
    if (moduleState[mod.id]?.status === 'locked') return
    navigate(`/curso/leccion/${mod.id}`)
  }

  const stats = [
    { label: 'Módulos terminados', value: completedCount, suffix: `/${MODULES.length}`, icon: CheckCircle, color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
    { label: 'Progreso total', value: progressPercent, suffix: '%', icon: BarChart3, color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
    { label: 'Tiempo restante', value: remaining, suffix: ' min', icon: Clock, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
    { label: 'Examen final', value: examResult ? (examResult.passed ? '✅' : '❌') : '—', suffix: '', icon: Trophy, color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)', isText: true },
  ]

  return (
    <CourseLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── HERO BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          className="relative rounded-[2.5rem] p-8 md:p-10 mb-8 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(6,11,20,0.8) 60%, rgba(37,99,235,0.08) 100%)',
            border: '1px solid rgba(34,197,94,0.15)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Background accents */}
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #4ade80 0%, transparent 65%)' }} />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 65%)' }} />
            {/* Animated orb */}
            <motion.div
              animate={{ y: [-8, 8, -8], x: [-4, 4, -4] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 right-[30%] w-px h-16 opacity-20"
              style={{ background: 'linear-gradient(to bottom, transparent, #4ade80, transparent)' }}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac' }}>
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute w-full h-full rounded-full bg-green-400 opacity-60" />
                  <span className="relative w-2 h-2 rounded-full bg-green-400" />
                </span>
                Sesión activa · Tus datos están guardados
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                Hola, <span style={{ color: '#4ade80' }}>{firstName}</span>{' '}
                <motion.span
                  animate={{ rotate: [0, 15, -5, 15, 0] }}
                  transition={{ delay: 1, duration: 0.6 }}
                  style={{ display: 'inline-block' }}
                >👋</motion.span>
              </h1>
              <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {completedCount === 0
                  ? 'Bienvenido a tu curso pedagógico de seguridad vial. Comienza cuando estés listo.'
                  : completedCount === MODULES.length
                  ? '¡Brillante! Completaste todos los módulos. Ya puedes presentar el examen final.'
                  : `Llevas ${completedCount} de ${MODULES.length} módulos — ¡vas muy bien! Sigue así.`}
              </p>
            </div>

            {/* CTA block */}
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              {allModulesCompleted ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/curso/examen')}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #4ade80)', boxShadow: '0 0 30px rgba(34,197,94,0.4), 0 4px 20px rgba(0,0,0,0.4)', color: '#fff' }}
                >
                  <Target size={20} /> Ir al Examen Final <ArrowRight size={16} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const first = MODULES.find(m => moduleState[m.id]?.status !== 'completed')
                    if (first) navigate(`/curso/leccion/${first.id}`)
                  }}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #4ade80)', boxShadow: '0 0 30px rgba(34,197,94,0.4), 0 4px 20px rgba(0,0,0,0.4)', color: '#fff' }}
                >
                  <Play size={20} />
                  {completedCount === 0 ? 'Iniciar el curso' : 'Continuar'}
                  <ArrowRight size={16} />
                </motion.button>
              )}
              {certificateUnlocked && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/curso/certificado')}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm"
                  style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}
                >
                  <Award size={18} /> Ver mi certificado
                </motion.button>
              )}
            </div>
          </div>

          {/* Segmented progress bar */}
          <div className="relative z-10 mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Progreso del curso</span>
              <span className="text-sm font-bold" style={{ color: '#4ade80' }}>{progressPercent}%</span>
            </div>
            {/* Segmented blocks */}
            <div className="flex gap-1.5">
              {MODULES.map((mod) => {
                const st = moduleState[mod.id]?.status
                return (
                  <div key={mod.id} className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: st === 'completed' ? '100%' : st === 'in-progress' ? '50%' : '0%' }}
                      transition={{ duration: 1, delay: 0.3 + mod.id * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        background: st === 'completed' ? 'linear-gradient(90deg, #16a34a, #4ade80)' : 'linear-gradient(90deg, #2563eb, #60a5fa)',
                        boxShadow: st === 'completed' ? '0 0 8px rgba(34,197,94,0.5)' : st === 'in-progress' ? '0 0 8px rgba(59,130,246,0.5)' : 'none'
                      }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-2">
              {MODULES.map(m => (
                <div key={m.id} className="flex-1 text-center text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  M{m.id}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="p-5 rounded-2xl"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}22` }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">
                {s.isText ? s.value : <><AnimatedCounter target={typeof s.value === 'number' ? s.value : 0} />{s.suffix}</>}
              </div>
              <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── SECCIÓN: MIS COMPARENDOS (SIMIT) ── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-black text-white flex items-center gap-3">
               <ShieldAlert size={22} className="text-dorado-400" /> 
               Deuda Actual (SIMIT)
             </h2>
             {multas.length > 0 && (
               <div className="flex items-center gap-2 px-4 py-2 bg-verde-500/10 border border-verde-500/20 rounded-full">
                  <TrendingDown size={14} className="text-verde-400" />
                  <span className="text-xs font-black text-verde-400 uppercase tracking-widest">
                    Ahorro Disponible: ${ahorroTotal.toLocaleString()}
                  </span>
               </div>
             )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
             {multas.length > 0 ? (
               multas.map((comp, ci) => (
                 <motion.div
                   key={comp.numero || ci}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: ci * 0.1 }}
                   className="relative group p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-hidden"
                 >
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Wallet size={80} />
                   </div>

                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Comparendo N°</div>
                        <div className="text-lg font-black text-white">{comp.numero}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        comp.estado.toLowerCase().includes('pag') ? 'bg-verde-500/20 text-verde-400 border border-verde-500/30' : 'bg-dorado-500/20 text-dorado-400 border border-dorado-500/30'
                      }`}>
                        {comp.estado}
                      </div>
                   </div>

                   <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Clock size={14} className="text-white/40" />
                         </div>
                         <div className="text-sm text-white/70 font-semibold">{comp.fecha}</div>
                      </div>
                      <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <ShieldAlert size={14} className="text-white/40" />
                         </div>
                         <div className="text-sm text-white/60 leading-snug line-clamp-2">{comp.descripcion}</div>
                      </div>
                   </div>

                   <div className="pt-5 border-t border-white/5 flex items-end justify-between">
                      <div>
                         <div className="text-[10px] font-black text-red-400/50 line-through mb-1">${comp.valor_original.toLocaleString()}</div>
                         <div className="text-2xl font-black text-verde-400">${(comp.valor_original * 0.5).toLocaleString()}</div>
                         <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Con Descuento 50%</div>
                      </div>
                      
                      {examResult?.passed ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => aplicarDescuento(comp.numero)}
                          className="px-6 py-3 bg-verde-600 hover:bg-verde-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-verde-900/40 uppercase tracking-widest"
                        >
                          Aplicar Ahorro
                        </motion.button>
                      ) : (
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest text-right max-w-[120px]">
                           Completa el curso para desbloquear ahorro
                        </div>
                      )}
                   </div>
                 </motion.div>
               ))
             ) : (
               <div className="lg:col-span-2 p-12 rounded-[2.5rem] bg-verde-500/5 border border-verde-500/10 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-verde-500/10 border border-verde-500/20 flex items-center justify-center mx-auto mb-6">
                     <CheckCircle size={32} className="text-verde-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">¡Paz y Salvo Detectado!</h3>
                  <p className="text-white/40 text-sm max-w-sm mx-auto">No registras multas pendientes en el SIMIT en este momento. Sigue conduciendo con responsabilidad.</p>
               </div>
             )}
          </div>
        </div>

        {/* ── SECCIÓN: CONSULTA MANUAL ── */}
        <div className="mb-12">
           <motion.div 
             className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 relative overflow-hidden"
             whileHover={{ borderColor: 'rgba(59,130,246,0.3)' }}
           >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Search size={120} />
              </div>

              <div className="max-w-xl">
                 <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                   ¿Quieres consultar por otro vehículo o cédula?
                 </h2>
                 <p className="text-white/50 text-sm mb-6">Puedes verificar radicaciones de amigos o familiares para ayudarlos con sus trámites virtuales.</p>
                 
                 <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1">
                       <select 
                         value={searchType} 
                         onChange={(e) => setSearchType(e.target.value)}
                         className="bg-white/5 border-r border-white/10 px-4 text-xs font-bold text-white/70 focus:outline-none"
                       >
                          <option value="cedula">Cédula</option>
                          <option value="placa">Placa</option>
                       </select>
                       <input 
                         type="text" 
                         placeholder={`Ingrese ${searchType === 'cedula' ? 'número' : 'placa'}...`}
                         value={searchVal}
                         onChange={(e) => setSearchVal(e.target.value.toUpperCase())}
                         className="flex-1 bg-transparent px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none"
                       />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fetchMultas(searchType, searchVal)}
                      className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2"
                    >
                      <Search size={16} /> Consultar
                    </motion.button>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* ── MODULES ── */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen size={18} style={{ color: '#60a5fa' }} /> Módulos del curso
          </h2>
          <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {completedCount} de {MODULES.length} completados
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {MODULES.map((mod, i) => {
            const status = moduleState[mod.id]?.status || 'locked'
            return (
              <ModuleCard
                key={mod.id}
                mod={mod}
                status={status}
                onClick={() => handleModuleClick(mod)}
                index={i}
              />
            )
          })}
        </div>

        {/* ── SECCIÓN: MI AHORRO (RESUMEN) ── */}
        <AnimatePresence>
           {ahorroTotal > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 p-10 rounded-[3rem] bg-verde-600 text-white shadow-2xl shadow-verde-900/40 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-10 opacity-20 rotate-12">
                     <Sparkle size={150} />
                 </div>

                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left">
                       <h2 className="text-3xl font-black mb-2">¡Tu ahorro está asegurado! 💰</h2>
                       <p className="text-white/80 font-bold">Por aprobar este curso virtual, has ganado el derecho al 50% de descuento.</p>
                       <div className="mt-6 flex flex-col sm:flex-row gap-8">
                          <div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Ahorro Generado</div>
                             <div className="text-4xl font-black">${ahorroTotal.toLocaleString()}</div>
                          </div>
                          <div className="w-[1px] bg-white/20 hidden sm:block" />
                          <div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Estado del Beneficio</div>
                             <div className="text-xl font-bold flex items-center gap-2">
                                <CheckCircle size={20} /> ACTIVO Y VÁLIDO
                             </div>
                          </div>
                       </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/curso/certificado')}
                      className="px-10 py-5 bg-white text-verde-600 rounded-[2rem] font-black shadow-2xl flex items-center gap-3 text-lg"
                    >
                      <Download size={24} /> Descargar Vouchers
                    </motion.button>
                 </div>
              </motion.div>
           )}
        </AnimatePresence>

        {/* ── MODAL DE CELEBRACIÓN DE AHORRO ── */}
        <AnimatePresence>
           {showSavingCelebration && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
             >
                <motion.div 
                  initial={{ scale: 0.5, y: 100 }}
                  animate={{ scale: 1, y: 0 }}
                  className="max-w-md w-full p-10 rounded-[3rem] bg-white text-center shadow-[0_0_100px_rgba(34,197,94,0.5)]"
                >
                   <div className="w-24 h-24 rounded-[2.5rem] bg-verde-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-verde-200">
                      <Trophy size={48} className="text-white" />
                   </div>
                   <h2 className="text-3xl font-black text-gris-900 mb-4">🏆 ¡Lo lograste!</h2>
                   <p className="text-gris-500 font-bold mb-8 leading-relaxed">
                     Has aprobado el curso con éxito. Ahora puedes aplicar el <span className="text-verde-600">50% de descuento</span> en tus comparendos directamente desde el portal.
                   </p>
                   <button 
                     onClick={() => setShowSavingCelebration(false)}
                     className="w-full py-5 bg-gris-900 text-white rounded-[1.75rem] font-black text-lg shadow-xl shadow-gris-400"
                   >
                     Entendido, ¡gracias!
                   </button>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </CourseLayout>
  )
}
