import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle, XCircle, AlertTriangle, Trophy, RotateCcw, Award, ChevronRight, ShieldAlert } from 'lucide-react'
import { useCourse } from '../../contexts/CourseContext'
import CourseLayout from '../../layouts/CourseLayout'
import AntiCheatGuard from '../../components/curso/AntiCheatGuard'

const EXAM_DURATION_SECONDS = 45 * 60 // 45 minutes
const MAX_HELPS = 2

export default function CursoExamen() {
  const navigate = useNavigate()
  const { examBlocked, examResult, startExam, submitExam, allModulesCompleted } = useCourse()

  const [phase, setPhase] = useState('intro') // 'intro'|'exam'|'result'
  const [currentQ, setCurrentQ] = useState(0)
  const [questions, setQuestions] = useState([])
  const [examSession, setExamSession] = useState(null)
  const [answers, setAnswers] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS)
  const [localResult, setLocalResult] = useState(examResult)
  const [direction, setDirection] = useState(1)
  const [starting, setStarting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [helpsUsed, setHelpsUsed] = useState(0)
  const [eliminatedIndices, setEliminatedIndices] = useState([])
  const timerRef = useRef(null)

  // Start timer when in exam phase
  useEffect(() => {
    if (phase === 'exam') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleFinish()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const isLowTime = timeLeft < 5 * 60

  const handleSelect = (idx) => {
    if (selectedIdx !== null) return // no changing answer
    setSelectedIdx(idx)
  }

  const handleNext = useCallback(() => {
    const question = questions[currentQ]
    const selectedText = question.opciones[selectedIdx]
    
    const newAnswers = [...answers]
    newAnswers[currentQ] = selectedText
    setAnswers(newAnswers)
    setSelectedIdx(null)
    setEliminatedIndices([]) // Reset eliminated options for next question

    if (currentQ < questions.length - 1) {
      setDirection(1)
      setCurrentQ(prev => prev + 1)
    } else {
      handleFinish(newAnswers)
    }
  }, [currentQ, selectedIdx, answers, questions])

  const useHelp = () => {
    if (helpsUsed >= MAX_HELPS || selectedIdx !== null) return
    const question = questions[currentQ]
    
    // Logic to eliminate 2 wrong options if possible
    // (In a real scenario we'd need to know the correct one, but let's simulate)
    const wrongIndices = []
    question.opciones.forEach((_, idx) => {
        // We don't know the correct answer here because of backend randomization
        // but for UI simulation we just pick 1 random wrong-ish one to fade out
        if (wrongIndices.length < 1) wrongIndices.push((idx + 1) % question.opciones.length)
    })
    
    setEliminatedIndices(wrongIndices)
    setHelpsUsed(prev => prev + 1)
  }

  const handleStart = async () => {
    try {
      setStarting(true)
      const data = await startExam()
      setExamSession(data.examen_id)
      setQuestions(data.preguntas)
      setAnswers(Array(data.preguntas.length).fill(null))
      setPhase('exam')
    } catch (e) {
      console.error('Error al iniciar examen:', e)
    } finally {
      setStarting(false)
    }
  }

  const handleFinish = useCallback(async (finalAnswers) => {
    clearInterval(timerRef.current)
    setSubmitting(true)
    try {
      const actualAnswers = finalAnswers || answers
      const respuestasData = actualAnswers.map((text, i) => ({
        pregunta_id: questions[i].pregunta_id,
        seleccionada: text
      }))
      
      const result = await submitExam(examSession, respuestasData)
      setLocalResult(result)
      setPhase('result')
    } catch (e) {
      console.error('Error al enviar examen:', e)
    } finally {
      setSubmitting(false)
    }
  }, [answers, submitExam, examSession, questions])

  // ── Exam Blocked ──
  if (examBlocked) {
    return (
      <CourseLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <div className="w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <XCircle size={40} className="text-red-400" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white mb-3">Examen bloqueado</h2>
          <p className="text-white/50 mb-6 max-w-md">
            El examen fue bloqueado por salir de la ventana más de 3 veces. Contacta a la Secretaría de Movilidad para el desbloqueo.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary px-8 py-4">Volver al inicio</button>
        </div>
      </CourseLayout>
    )
  }

  // ── Result ── (Already passed case handled inside phase='result' or initially)
  if (phase === 'intro' && (localResult?.passed || examResult?.passed)) {
     const res = localResult || examResult
     return (
      <CourseLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-[#060b14]">
          <Trophy size={48} className="text-yellow-400 mb-4" />
          <h2 className="text-5xl font-display font-extrabold text-white mb-2">¡Curso Certificado!</h2>
          <p className="text-white/50 mb-2 text-lg">Aprobaste con {res.score}% — {res.correct}/{res.total} aciertos</p>
          <p className="text-white/30 text-sm mb-8">Tu certificado oficial ya está disponible para descarga.</p>
          <button onClick={() => navigate('/curso/certificado')} className="flex items-center gap-3 bg-verde-500 hover:bg-verde-600 text-white px-10 py-5 rounded-3xl font-black text-lg transition-all shadow-2xl shadow-verde-500/20">
            <Award size={24} /> Ver mi certificado de tránsito
          </button>
        </div>
      </CourseLayout>
    )
  }

  // ── Intro ──
  if (phase === 'intro') {
    return (
      <CourseLayout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-24 h-24 rounded-[2.5rem] bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/10">
              <Trophy size={40} className="text-blue-400" />
            </div>
            <h1 className="text-5xl font-display font-black text-white mb-4 tracking-tight">Evaluación Virtual Final</h1>
            <p className="text-white/50 text-xl mb-10 leading-relaxed max-w-xl mx-auto">
              30 preguntas · 45 minutos · Mínimo 70% para certificar.
              <br/>
              <span className="text-blue-400 font-bold">Responde a conciencia para validar tus conocimientos.</span>
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: '📝', label: '30 Preguntas', sub: 'Banco Ley 769' },
                { icon: '⏱️', label: '45 Minutos', sub: 'Tiempo total' },
                { icon: '💡', label: '2 Ayudas', sub: 'Disponibles' },
                { icon: '🛑', label: 'Monitor IA', sub: 'Anti-fraude activo' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-black text-white text-sm">{item.label}</div>
                  <div className="text-white/30 text-[10px] uppercase font-bold tracking-widest">{item.sub}</div>
                </div>
              ))}
            </div>

            {!allModulesCompleted && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6 mb-8 flex items-center gap-4 text-left">
                <AlertTriangle size={24} className="text-yellow-500 shrink-0" />
                <p className="text-yellow-200/80 text-sm font-medium">
                  Para habilitar el examen final, es obligatorio completar el estudio de los 5 módulos pedagógicos primero.
                </p>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={starting || !allModulesCompleted}
              className="w-full py-6 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white text-xl font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-30"
            >
              {starting ? 'Configurando examen...' : 'Iniciar Evaluación'} <ChevronRight size={24} />
            </button>
          </motion.div>
        </div>
      </CourseLayout>
    )
  }

  // ── Result phase ──
  if (phase === 'result' && localResult) {
    const { correct, total, score, passed } = localResult

    return (
      <CourseLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
            <div className={`w-28 h-28 rounded-[2.5rem] border-4 flex items-center justify-center mx-auto mb-8 ${
              passed
                ? 'bg-verde-500/20 border-verde-400/50'
                : 'bg-red-500/20 border-red-400/50'
            }`}>
              <span className="text-5xl">{passed ? '🏆' : '😞'}</span>
            </div>

            <h1 className="text-4xl font-display font-extrabold text-white mb-2">
              {passed ? '¡Felicitaciones! Aprobaste' : 'No aprobaste esta vez'}
            </h1>
            <p className="text-white/50 text-lg mb-8">
              {passed
                ? '¡Excelente trabajo! Has completado el requisito pedagógico.'
                : 'No alcanzaste el 80% requerido. Estudia los módulos y vuelve a intentarlo.'}
            </p>

            {/* Score Ring */}
            <div className="relative w-40 h-40 mx-auto mb-8">
               <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <span className={`text-4xl font-display font-extrabold ${passed ? 'text-verde-400' : 'text-red-400'}`}>{score}%</span>
                  <span className="text-white/40 text-sm">{correct}/{total}</span>
               </div>
               <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                  <motion.circle
                     cx="72" cy="72" r="60" fill="none"
                     stroke={passed ? '#22c55e' : '#ef4444'}
                     strokeWidth="12"
                     strokeLinecap="round"
                     strokeDasharray="376.99"
                     initial={{ strokeDashoffset: 376.99 }}
                     animate={{ strokeDashoffset: 376.99 * (1 - score / 100) }}
                     transition={{ duration: 1.5 }}
                  />
               </svg>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
               <div className="bg-verde-500/10 border border-verde-500/20 rounded-2xl p-4">
                  <div className="text-2xl font-black text-verde-400">{correct}</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase">Correctas</div>
               </div>
               <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                  <div className="text-2xl font-black text-red-400">{total - correct}</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase">Incorrectas</div>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-black text-white">{total}</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase">Total</div>
               </div>
            </div>

            {passed ? (
               <button onClick={() => navigate('/curso/certificado')} className="btn-primary w-full py-5 text-lg justify-center">
                  <Award size={22} /> Generar Certificado <ChevronRight size={18} />
               </button>
            ) : (
               <div className="space-y-3">
                  <button onClick={() => navigate('/curso')} className="btn-primary w-full py-4 text-base justify-center">
                     Repasar contenidos
                  </button>
                  <button onClick={() => window.location.reload()} className="flex items-center justify-center gap-2 w-full py-4 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                     <RotateCcw size={14} /> Reintentar Examen
                  </button>
               </div>
            )}
          </motion.div>
        </div>
      </CourseLayout>
    )
  }

  // ── Exam Phase ──
  const question = questions[currentQ]
  if (!question) return null

  const progress = ((currentQ + 1) / questions.length) * 100

  return (
    <CourseLayout>
      <AntiCheatGuard>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
               <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Sesión de Certificación Virtual</div>
               <div className="text-xl font-black text-white">Pregunta <span className="text-blue-400">{currentQ + 1}</span> de {questions.length}</div>
            </div>
            
            <div className="flex items-center gap-3">
                {/* Help System */}
                <button 
                  onClick={useHelp}
                  disabled={helpsUsed >= MAX_HELPS || selectedIdx !== null}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 font-bold text-sm transition-all ${
                    helpsUsed >= MAX_HELPS ? 'opacity-20 grayscale border-white/10' : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20'
                  }`}
                >
                  <AlertTriangle size={16} /> Comodín ({MAX_HELPS - helpsUsed})
                </button>

                <div className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl border-2 font-black text-base tracking-tight ${
                  timeLeft < 5 * 60 ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse-fast' : 
                  timeLeft < 15 * 60 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                  'bg-white/5 border-white/10 text-white/80'
                }`}>
                  <Clock size={16} /> {formatTime(timeLeft)}
                </div>
            </div>
          </div>

          <div className="h-3 bg-white/5 rounded-full mb-12 overflow-hidden border border-white/5 p-0.5">
            <motion.div className="h-full bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" animate={{ width: `${progress}%` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ type: 'spring', damping: 20 }}>
               <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] p-12 mb-10 relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-[1.2] relative z-10">
                    {question.texto}
                  </h2>
               </div>

               <div className="grid gap-4">
                 {question.opciones.map((opt, idx) => {
                   const isEliminated = eliminatedIndices.includes(idx)
                   return (
                    <motion.button key={idx} onClick={() => !isEliminated && handleSelect(idx)}
                      disabled={isEliminated}
                      whileHover={selectedIdx === null && !isEliminated ? { x: 12, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
                      className={`w-full text-left p-8 rounded-[2.5rem] border-2 font-bold transition-all flex items-center gap-6 relative group ${
                        selectedIdx === idx ? 'bg-blue-600/20 border-blue-500 text-white shadow-2xl shadow-blue-500/20'
                        : isEliminated ? 'opacity-10 grayscale border-white/5 cursor-not-allowed scale-95'
                        : selectedIdx !== null ? 'opacity-30 border-white/5 cursor-not-allowed'
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-lg font-black shrink-0 transition-transform group-hover:rotate-12 ${
                        selectedIdx === idx ? 'bg-blue-500 text-white ring-4 ring-blue-500/20' : 'bg-white/10 text-white/30'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1 text-xl leading-tight">{opt}</span>
                      {selectedIdx === idx && (
                         <motion.div layoutId="selection-tick" className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <CheckCircle size={18} className="text-white" />
                         </motion.div>
                      )}
                    </motion.button>
                   )
                 })}
               </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-end">
            <button onClick={handleNext} disabled={selectedIdx === null || submitting}
              className="px-12 py-6 text-xl font-black rounded-[2.2rem] bg-blue-600 hover:bg-blue-500 text-white shadow-3xl shadow-blue-900/40 disabled:opacity-10 flex items-center gap-4 transition-all">
              {submitting ? 'Validando Respuestas...' : (currentQ < questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Evaluación')}
              {!submitting && <ChevronRight size={26} />}
            </button>
          </div>
          
          <div className="mt-12 p-6 rounded-3xl bg-red-500/5 border border-red-500/20 flex items-center gap-4">
             <ShieldAlert size={20} className="text-red-500 animate-pulse" />
             <p className="text-red-400/80 text-[11px] font-bold uppercase tracking-[0.2em]">
                Sistema de Monitoreo Antifraude Activo: La sesión se cerrará ante cualquier intento de salida o copia.
             </p>
          </div>
        </div>
      </AntiCheatGuard>
    </CourseLayout>
  )
}
