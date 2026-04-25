import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, CheckCircle, AlertCircle, HelpCircle, Lightbulb, Zap, ShieldCheck, Trophy } from 'lucide-react'

export default function AIChatPanel({ lessonId, aiQuestions, onModuleFinished }) {
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [helpsUsed, setHelpsUsed] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  // Reset local state when module changes
  useEffect(() => {
    setMessages([
      { role: 'ai', text: '¡Hola de nuevo! 👋 Soy tu asistente IA de seguridad vial.', _idx: 'hi' },
      { role: 'ai', text: 'Continuemos con la aprobación de este módulo mediante 3 retos rápidos de comprensión.', _idx: 'hi-2' }
    ])
    setCurrentIndex(0)
    setHelpsUsed(0)
    setFailedAttempts(0)
    setIsWaitingForAnswer(false)
  }, [lessonId])

  // Sequencer for asking questions
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < aiQuestions.length) {
      const q = aiQuestions[currentIndex]
      const tStart = setTimeout(() => {
        setIsTyping(true)
        const tEnd = setTimeout(() => {
          setIsTyping(false)
          setMessages(prev => [
            ...prev,
            { 
              role: 'ai', 
              text: `🎯 **Reto ${currentIndex + 1} de ${aiQuestions.length}:**\n\n${q.text}`, 
              _idx: `q-${currentIndex}-${Date.now()}`,
              isQuestion: true,
              type: q.type 
            }
          ])
          setIsWaitingForAnswer(true)
        }, 1500)
        return () => clearTimeout(tEnd)
      }, 800)
      return () => clearTimeout(tStart)
    }
  }, [currentIndex, aiQuestions, lessonId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addAIMessage = (text, type = 'normal') => {
    const isSuccess = type === 'success'
    const isError = type === 'error'
    const isHelp = type === 'help'
    const isFinalSuccess = type === 'final'

    setIsTyping(true)
    setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [
          ...prev,
          { 
            role: 'ai', 
            text, 
            _idx: `ai-${Date.now()}`,
            isSuccess, isError, isHelp, isFinalSuccess
          }
        ])
    }, 1200)
  }

  const handleHelp = () => {
    if (helpsUsed >= 3) return
    const q = aiQuestions[currentIndex]
    const nextCount = helpsUsed + 1
    setHelpsUsed(nextCount)

    if (nextCount === 1) {
      addAIMessage(`💡 **Explicación sencilla:** ${q.helpContent}\n\n🇨🇴 **Ejemplo:** ${q.helpExample}\n\n 🤔 **Pregunta reformulada:** ${q.rephrasedText}`, 'help')
    } else if (nextCount === 2) {
      addAIMessage(`🔍 **Segunda pista:** ${q.explanation.split('.')[0]}. ¿Qué opinas ahora?`, 'help')
    } else {
      // 3rd help: Auto-solve
      const ans = q.type === 'multiple' ? q.options[q.correctOption] : (q.type === 'boolean' ? (q.correctOption ? 'Verdadero' : 'Falso') : q.correctAnswers[0])
      addAIMessage(`✨ **Respuesta correcta:** ${ans}\n\n${q.explanation}\n\nPasemos a lo siguiente para no perder el impulso.`, 'success')
      
      setTimeout(() => {
        if (currentIndex < aiQuestions.length - 1) setCurrentIndex(prev => prev + 1)
        else onModuleFinished?.()
      }, 2000)
    }
  }

  const handleValidation = (answer) => {
    const trimmed = String(answer).trim().toLowerCase()
    const q = aiQuestions[currentIndex]
    let isCorrect = false

    if (q.type === 'open') {
      isCorrect = q.correctAnswers.some(ans => trimmed.includes(ans.toLowerCase()))
    } else if (q.type === 'multiple') {
      const correctText = q.options[q.correctOption].toLowerCase()
      isCorrect = trimmed === correctText || trimmed === String(q.correctOption)
    } else if (q.type === 'boolean') {
      const correctVal = q.correctOption ? 'verdadero' : 'falso'
      isCorrect = trimmed === correctVal || (q.correctOption && trimmed === 'si') || (!q.correctOption && trimmed === 'no')
    }

    setMessages(prev => [...prev, { role: 'user', text: answer, _idx: `u-${Date.now()}` }])
    setIsWaitingForAnswer(false)

    if (isCorrect) {
      setHelpsUsed(0)
      setFailedAttempts(0)
      setTimeout(() => {
        addAIMessage(q.successMsg || '¡Correcto! Excelente comprensión.', 'success')
        
        if (currentIndex < aiQuestions.length - 1) {
          setTimeout(() => setCurrentIndex(prev => prev + 1), 1200)
        } else {
          setTimeout(() => {
            addAIMessage('🏆 ¡Modulo completado con éxito! Validando tu progreso...', 'final')
            onModuleFinished?.()
          }, 1200)
        }
      }, 600)
    } else {
      setFailedAttempts(prev => prev + 1)
      setTimeout(() => {
        addAIMessage(`No es exactamente así. **Te explico:** ${q.explanation}\n\nIntenta de nuevo o solicita una ayuda 💡`, 'error')
        setIsWaitingForAnswer(true)
      }, 600)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gris-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-verde-500/10 border border-verde-500/20 flex items-center justify-center">
            <Bot size={20} className="text-verde-400" />
          </div>
          <div>
            <div className="text-sm font-black text-white uppercase tracking-tight">Validación Pedagógica</div>
            <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest leading-none mt-1">Inteligencia Artificial Activa</div>
          </div>
        </div>
        {currentIndex >= 0 && (
           <div className="flex items-center gap-2">
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-wider">
                <Trophy size={10} className="fill-blue-400" /> Reto {currentIndex + 1}/3
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dorado-500/10 border border-dorado-500/20 text-dorado-400 text-[9px] font-black uppercase tracking-wider">
                <Zap size={10} className="fill-dorado-400" /> Ayudas: {3 - helpsUsed}
             </div>
           </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg._idx || i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] px-5 py-4 rounded-[2rem] text-[13px] leading-relaxed relative ${
                  msg.role === 'user'
                    ? 'bg-verde-600 text-white rounded-br-none'
                    : msg.isQuestion ? 'bg-blue-600/20 border border-blue-500/30 text-white rounded-bl-none shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                    : msg.isSuccess ? 'bg-verde-500/10 border border-verde-500/30 text-verde-300 rounded-bl-none'
                    : msg.isError ? 'bg-red-500/10 border border-red-500/30 text-red-300 rounded-bl-none'
                    : msg.isHelp ? 'bg-dorado-500/10 border border-dorado-500/30 text-dorado-200 italic rounded-bl-none'
                    : msg.isFinalSuccess ? 'bg-verde-600 text-white font-black text-center w-full py-6 text-base'
                    : 'bg-white/5 border border-white/10 text-white/80 rounded-bl-none'
                }`}
              >
                {msg.text.split(/(\*\*[^*]+\*\*)/).map((p, j) => 
                  p.startsWith('**') ? <strong key={j} className="text-white font-black">{p.slice(2,-2)}</strong> : p
                )}
                {msg.isQuestion && (
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-400" />
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start">
               <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-6 py-6 border-t border-white/10 bg-white/[0.02] backdrop-blur-md">
        <AnimatePresence mode="wait">
          {isWaitingForAnswer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
               {/* Help button bar */}
               <div className="flex justify-between items-center px-1">
                 <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < (3 - helpsUsed) ? 'bg-dorado-400' : 'bg-white/10'}`} />
                    ))}
                 </div>
                 {helpsUsed < 3 && (
                    <button onClick={handleHelp} className="text-[10px] font-bold uppercase tracking-widest text-dorado-400 hover:text-dorado-300 transition-colors flex items-center gap-1.5">
                      <Lightbulb size={12} /> Solicitar Ayuda
                    </button>
                 )}
               </div>

               {/* Interaction Logic */}
               {aiQuestions[currentIndex]?.type === 'boolean' && (
                 <div className="grid grid-cols-2 gap-4">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleValidation('Verdadero')}
                      className="py-4 rounded-3xl bg-verde-600/20 border-2 border-verde-500/40 text-verde-400 font-black text-sm uppercase tracking-widest hover:bg-verde-600/30 transition-all shadow-lg shadow-verde-900/20"
                    >
                      Verdadero
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleValidation('Falso')}
                      className="py-4 rounded-3xl bg-red-600/20 border-2 border-red-500/40 text-red-400 font-black text-sm uppercase tracking-widest hover:bg-red-600/30 transition-all shadow-lg shadow-red-900/20"
                    >
                      Falso
                    </motion.button>
                 </div>
               )}

               {aiQuestions[currentIndex]?.type === 'multiple' && (
                 <div className="grid grid-cols-2 gap-3">
                    {aiQuestions[currentIndex].options.map((opt, idx) => (
                      <motion.button key={idx} whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        onClick={() => handleValidation(opt)}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left transition-all"
                      >
                         <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-black text-blue-400 shrink-0">
                            {String.fromCharCode(65 + idx)}
                         </div>
                         <span className="text-[11px] text-white/70 font-semibold line-clamp-2 leading-tight">{opt}</span>
                      </motion.button>
                    ))}
                 </div>
               )}

               {aiQuestions[currentIndex]?.type === 'open' && (
                  <form onSubmit={e => { e.preventDefault(); if(userInput.trim()) handleValidation(userInput); setUserInput('') }} className="flex gap-2">
                    <input autoFocus value={userInput} onChange={e => setUserInput(e.target.value)}
                      placeholder="Escribe tu respuesta aquí..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-verde-500/50 transition-all font-medium"
                    />
                    <button type="submit" disabled={!userInput.trim()} className="w-14 h-14 rounded-2xl bg-verde-600 hover:bg-verde-500 disabled:opacity-30 flex items-center justify-center text-white shadow-xl shadow-verde-900/40">
                      <Send size={20} />
                    </button>
                  </form>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
