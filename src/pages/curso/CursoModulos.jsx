import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle, Lock, Play, Clock, ChevronRight, BookOpen } from 'lucide-react'
import { useCourse } from '../../contexts/CourseContext'
import CourseLayout from '../../layouts/CourseLayout'

const STATUS_STYLES = {
  locked:        'text-white/30 border-white/10',
  available:     'text-verde-400 border-verde-500/30',
  'in-progress': 'text-blue-400 border-blue-500/30',
  completed:     'text-verde-300 border-verde-400/40',
}

export default function CursoModulos() {
  const [openModule, setOpenModule] = useState(null)
  const navigate = useNavigate()
  const { moduleState, modulesData } = useCourse()

  return (
    <CourseLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            <BookOpen size={12} /> Plan de estudios
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white">Módulos del curso</h1>
          <p className="text-white/50 mt-2">Revisa el contenido completo y el estado de cada lección.</p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-4">
          {modulesData.map((dbMod, i) => {
            // Keep hardcoded icons and colors for mapping (fallback to first if missing)
            const hardcodedMod = [{id: 1, icon: '📋', color: 'from-blue-600 to-blue-800', estimatedMinutes: 30},
                                  {id: 2, icon: '🚦', color: 'from-verde-500 to-verde-700', estimatedMinutes: 30},
                                  {id: 3, icon: '🤝', color: 'from-indigo-500 to-indigo-700', estimatedMinutes: 30},
                                  {id: 4, icon: '⚖️', color: 'from-red-600 to-red-800', estimatedMinutes: 30},
                                  {id: 5, icon: '🎯', color: 'from-dorado-400 to-dorado-600', estimatedMinutes: 30}]
            const modProps = hardcodedMod.find(m => m.id === dbMod.id) || hardcodedMod[0]
            
            const mod = { ...dbMod, ...modProps }
            const status = moduleState[mod.id]?.status || 'locked'
            const isOpen = openModule === mod.id
            const isLocked = status === 'locked'
            const timeSpent = moduleState[mod.id]?.timeSpentSeconds || 0

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`border rounded-[1.75rem] overflow-hidden transition-all duration-300 ${
                  status === 'completed'
                    ? 'border-verde-400/25 bg-verde-500/6'
                    : status === 'in-progress'
                    ? 'border-blue-500/25 bg-blue-600/6'
                    : isLocked
                    ? 'border-white/6 bg-white/3 opacity-60'
                    : 'border-white/10 bg-white/4'
                }`}
              >
                {/* Module Header */}
                <button
                  disabled={isLocked}
                  onClick={() => setOpenModule(isOpen ? null : mod.id)}
                  className="w-full flex items-center gap-5 p-5 text-left transition-all hover:bg-white/3 disabled:cursor-not-allowed"
                >
                  {/* Module icon */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-xl shrink-0 ${isLocked ? 'opacity-40' : ''}`}>
                    {mod.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-white/30 uppercase">Módulo {mod.id}</span>
                      <span className={`text-xs font-bold border rounded-full px-2 py-0.5 ${STATUS_STYLES[status]}`}>
                        {status === 'completed' ? '✅ Completado' : status === 'in-progress' ? '🔄 En progreso' : status === 'available' ? '▶ Disponible' : '🔒 Bloqueado'}
                      </span>
                    </div>
                    <div className="font-display font-bold text-white text-base truncate">{dbMod.titulo}</div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5 text-white/40 text-xs">
                      <Clock size={12} />
                      {mod.estimatedMinutes} min
                    </div>
                    {!isLocked && (
                      <ChevronDown
                        size={18}
                        className={`text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                    {isLocked && <Lock size={16} className="text-white/20" />}
                  </div>
                </button>

                {/* Expanded Lessons */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 border-t border-white/8 pt-4">
                        <p className="text-sm text-white/50 mb-4">{dbMod.descripcion}</p>

                        {/* Lessons list */}
                        <div className="space-y-2 mb-4">
                           <div className="flex items-center gap-3 bg-white/4 border border-white/6 rounded-xl p-3">
                             <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                               status === 'completed' ? 'bg-verde-500/20 text-verde-400' : 'bg-white/8 text-white/40'
                             }`}>
                               {status === 'completed' ? <CheckCircle size={14} /> : 1}
                             </div>
                             <span className="text-sm text-white/80 flex-1">Lección única guiada por IA</span>
                             <span className="text-xs text-white/30">{mod.estimatedMinutes} min</span>
                           </div>
                         </div>

                        {/* Time info */}
                        {timeSpent > 0 && (
                          <div className="text-xs text-white/30 mb-3">
                            Tiempo invertido: {Math.floor(timeSpent / 60)} min {timeSpent % 60} seg
                          </div>
                        )}

                        {/* CTA */}
                        <button
                          onClick={() => navigate(`/curso/leccion/${mod.id}`)}
                          className="btn-primary w-full py-3 text-sm"
                        >
                          {status === 'completed' ? <><CheckCircle size={16} /> Repasar módulo</> : <><Play size={16} /> {status === 'in-progress' ? 'Continuar' : 'Iniciar módulo'}</>}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </CourseLayout>
  )
}
