import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
// Confetti removed temporarily to clear Vite cache error
import { 
  ChevronRight, CheckCircle, Lock, AlertTriangle, 
  BookOpen, Brain, Sparkles, Star, Zap, LayoutGrid, 
  Trophy, ArrowRight, Award, History, ShieldCheck
} from 'lucide-react'
import { useCourse } from '../../contexts/CourseContext'
import { MODULES, LESSON_CONTENT } from '../../utils/courseData'
import CourseLayout from '../../layouts/CourseLayout'
import AIChatPanel from '../../components/curso/AIChatPanel'
import AntiCheatGuard from '../../components/curso/AntiCheatGuard'

const MOD_GRADIENTS = {
  1: { from: '#2563eb', to: '#60a5fa', glow: 'rgba(37,99,235,0.3)' },
  2: { from: '#16a34a', to: '#4ade80', glow: 'rgba(22,163,74,0.3)' },
  3: { from: '#7c3aed', to: '#a78bfa', glow: 'rgba(124,58,237,0.3)' },
  4: { from: '#dc2626', to: '#f87171', glow: 'rgba(220,38,38,0.3)' },
  5: { from: '#d97706', to: '#fbbf24', glow: 'rgba(217,119,6,0.3)' },
}

function ContentBlock({ block, index }) {
  if (block.type === 'intro') {
    return (
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}
        className="relative px-6 py-5 rounded-2xl overflow-hidden bg-white/5 border-l-4 border-verde-500">
        <p className="text-white/80 text-base leading-relaxed relative z-10">{block.text}</p>
      </motion.div>
    )
  }
  if (block.type === 'highlight') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
        className="rounded-2xl p-5 bg-blue-600/10 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{block.icon}</span>
          <h4 className="font-bold text-white text-base">{block.title}</h4>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">{block.text}</p>
      </motion.div>
    )
  }
  if (block.type === 'list') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
        <h4 className="font-bold text-white text-base mb-4 flex items-center gap-2"><CheckCircle size={16} className="text-verde-400" /> {block.title}</h4>
        <ul className="space-y-3">
          {block.items.map((item, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 + i * 0.04 }}
              className="flex items-start gap-3 text-sm text-white/75">
              <div className="w-1.5 h-1.5 rounded-full bg-verde-500 shrink-0 mt-1.5" />
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    )
  }
  if (block.type === 'stat') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.08 }}
        className="rounded-2xl p-5 flex items-center gap-5 bg-white/5 border border-white/10">
        <div className="text-4xl">{block.icon}</div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{block.label}</div>
          <div className="text-2xl font-black text-verde-400">{block.value}</div>
          <div className="text-[10px] text-white/30 uppercase font-bold">{block.sub}</div>
        </div>
      </motion.div>
    )
  }
  return null
}

export default function CursoLeccion() {
  const { id } = useParams()
  const moduleId = parseInt(id)
  const navigate = useNavigate()
  const { 
    moduleState, loading, completeModule, startModule,
    progressPercent, completedCount, allModulesCompleted
  } = useCourse()

  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showFinalScreen, setShowFinalScreen] = useState(false)
  const [progressKey, setProgressKey] = useState(0) // Logic to reset components

  const mod = MODULES.find(m => m.id === moduleId)
  const lessonData = LESSON_CONTENT[moduleId]
  const grad = MOD_GRADIENTS[moduleId] || MOD_GRADIENTS[1]

  useEffect(() => {
    if (moduleState[moduleId]?.status === 'available') startModule(moduleId)
    if (allModulesCompleted && !isTransitioning) setShowFinalScreen(true)
  }, [moduleId, moduleState, allModulesCompleted, isTransitioning])

  const handleModuleFinished = async () => {
    setIsTransitioning(true)
    await completeModule(moduleId)
    
    // Celebration logic (animation could be added here later)
    console.log('Modulo completado: ', moduleId)

    setTimeout(() => {
      if (moduleId < MODULES.length) {
        setIsTransitioning(false)
        navigate(`/curso/leccion/${moduleId + 1}`)
        setProgressKey(prev => prev + 1)
      } else {
        setIsTransitioning(false)
        setShowFinalScreen(true)
      }
    }, 2500)
  }

  if (loading) return null

  if (showFinalScreen) {
    return (
      <CourseLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full bg-gris-900 border border-verde-500/30 rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-verde-500" />
            <motion.div animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 bg-verde-500/20 border-2 border-verde-500/40 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-verde-500/20">
              <Trophy size={48} className="text-verde-400" />
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-4">¡CURSO COMPLETADO! 🏆</h1>
            <p className="text-white/60 mb-8 text-lg">Has demostrado una excelente comprensión de las normas viales. Estás a un solo paso de tu certificación.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
               <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-white">5/5</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase">Módulos</div>
               </div>
               <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-verde-400">100%</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase">Progreso</div>
               </div>
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/curso/examen')}
              className="w-full py-5 rounded-[1.75rem] font-black text-lg bg-verde-600 text-white shadow-xl shadow-verde-900/40 flex items-center justify-center gap-3">
              Iniciar Examen Final <ArrowRight size={24} />
            </motion.button>
          </motion.div>
        </div>
      </CourseLayout>
    )
  }

  return (
    <CourseLayout>
      <AntiCheatGuard>
        {/* Global Progress Header */}
        <div className="sticky top-0 z-40 bg-gris-900/80 backdrop-blur-xl border-b border-white/10 py-4 shadow-xl">
           <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 shrink-0">
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <BookOpen size={18} className="text-white/40" />
                 </div>
                 <div className="hidden sm:block">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Curso en Vivo</div>
                    <div className="text-sm font-bold text-white leading-none">Módulo {moduleId} de 5</div>
                 </div>
              </div>

              <div className="flex-1 max-w-md hidden md:block">
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div animate={{ width: `${progressPercent}%` }} className="h-full bg-verde-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-black text-verde-400 uppercase tracking-widest leading-none mb-1">Completado</div>
                    <div className="text-sm font-black text-white leading-none">{progressPercent}%</div>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-verde-500/10 border border-verde-500/30 flex items-center justify-center">
                    <CheckCircle size={18} className="text-verde-400" />
                 </div>
              </div>
           </div>
        </div>

        {/* Transition Overlay */}
        <AnimatePresence>
           {isTransitioning && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex items-center justify-center bg-gris-950/95 backdrop-blur-xl text-center px-4">
                <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="space-y-8">
                   <div className="w-32 h-32 bg-verde-500/20 border-2 border-verde-500/40 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-verde-500/20">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <Brain size={64} className="text-verde-400" />
                      </motion.div>
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-4xl font-black text-white">¡IMPRESIONANTE! 🤩</h2>
                      <p className="text-white/50 text-lg uppercase tracking-widest font-bold">Módulo {moduleId} Superado</p>
                      {moduleId < MODULES.length && (
                        <div className="pt-4 border-t border-white/10">
                           <div className="text-[10px] font-black text-verde-400 uppercase tracking-[0.3em] mb-2">Siguiente reto:</div>
                           <div className="text-2xl font-black text-white">{MODULES[moduleId].title}</div>
                        </div>
                      )}
                   </div>
                   <div className="flex items-center justify-center gap-3 text-verde-400 font-bold uppercase tracking-widest text-sm bg-verde-500/10 py-3 px-8 rounded-full border border-verde-500/20 max-w-xs mx-auto">
                      Siguiente módulo <ArrowRight size={16} />
                   </div>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>

        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-8">
           <div className="grid lg:grid-cols-5 gap-8 items-start">
             {/* Content Panel */}
             <div className="lg:col-span-3 space-y-6">
                <motion.div key={`m-${moduleId}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/[0.03] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-md shadow-2xl relative">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <History size={120} />
                   </div>
                   
                   <div className="px-10 py-10 border-b border-white/10 bg-white/[0.02] flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[1.75rem] flex items-center justify-center text-4xl shadow-2xl text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}>
                        {mod.icon}
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.2em] mb-1" style={{ color: grad.to }}>Módulo Actual</div>
                        <h1 className="text-3xl font-black text-white leading-tight">{mod.title}</h1>
                      </div>
                   </div>

                   <div className="px-10 py-12 space-y-10">
                      <div>
                        <h3 className="text-xl font-bold text-white/90 mb-2">{lessonData.subtitle}</h3>
                        <p className="text-white/40 text-sm leading-relaxed">Analiza los conceptos técnicos que habilitarán tu certificación ciudadana.</p>
                      </div>
                      <div className="grid gap-6">
                        {lessonData.content.map((block, i) => <ContentBlock key={i} block={block} index={i} />)}
                      </div>
                   </div>

                   <div className="px-10 py-8 bg-white/[0.02] border-t border-white/10 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs font-bold text-white/20 uppercase tracking-widest">
                         <ShieldCheck size={14} className="text-verde-500" /> Contenido Verificado
                      </div>
                      <Link to="/curso" className="text-xs font-black text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest">
                         Menu Principal
                      </Link>
                   </div>
                </motion.div>
             </div>

             {/* AI/QA Panel */}
             <div className="lg:col-span-2 sticky top-28 h-[calc(100vh-140px)]">
                <AIChatPanel key={`ai-${moduleId}-${progressKey}`} lessonId={moduleId} aiQuestions={lessonData.aiQuestions}
                  onModuleFinished={handleModuleFinished}
                />
             </div>
           </div>
        </div>
      </AntiCheatGuard>
    </CourseLayout>
  )
}
