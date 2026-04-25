import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, PhoneCall, AlertCircle, ChevronDown, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import MovIARobot from '../chat/MovIARobot'

// ─── Initial quick replies ────────────────────────────────────────────────────
const INITIAL_QUICK_REPLIES = [
  { icon: '🔍', label: 'Consultar mis multas' },
  { icon: '📚', label: 'Cómo tomar el curso virtual' },
  { icon: '💰', label: 'Descuento del 50%' },
  { icon: '📋', label: 'Estado de mi comparendo' },
  { icon: '🆘', label: 'Hablar con un humano' },
]

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text, active, speed = 22) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!active) { setDisplayed(text); return }
    setDisplayed('')
    let i = 0
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) clearInterval(timer)
    }, speed)
    return () => clearInterval(timer)
  }, [text, active, speed])
  return displayed
}

// ─── Greeting Bubble ──────────────────────────────────────────────────────────
function GreetingBubble({ onOpen }) {
  const greet = '¡Hola! 👋 Soy MOV-IA ¿En qué te puedo ayudar hoy?'
  const text = useTypewriter(greet, true, 30)
  const [showReplies, setShowReplies] = useState(false)
  useEffect(() => {
    if (text.length === greet.length) setTimeout(() => setShowReplies(true), 300)
  }, [text])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="absolute bottom-[calc(100%+12px)] right-0 w-[265px] sm:w-[290px]"
    >
      <div onClick={onOpen} className="relative cursor-pointer rounded-[1.6rem] rounded-br-md p-4 shadow-2xl"
        style={{ background: 'rgba(10,18,35,0.96)', border: '1px solid rgba(0,122,77,0.45)', boxShadow: '0 8px 32px rgba(0,122,77,0.18)', backdropFilter: 'blur(20px)' }}>
        <p className="text-white text-sm leading-snug font-medium mb-3">{text}</p>
        <AnimatePresence>
          {showReplies && (
            <motion.div className="flex flex-col gap-1.5">
              {INITIAL_QUICK_REPLIES.map((qr, i) => (
                <motion.button key={i}
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={(e) => { e.stopPropagation(); onOpen(qr.label) }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(0,122,77,0.12)', border: '1px solid rgba(0,122,77,0.25)', color: 'rgba(255,255,255,0.85)' }}>
                  <span>{qr.icon}</span>{qr.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-[-8px] right-5 w-4 h-4 rotate-45"
          style={{ background: 'rgba(10,18,35,0.96)', borderRight: '1px solid rgba(0,122,77,0.45)', borderBottom: '1px solid rgba(0,122,77,0.45)' }} />
      </div>
    </motion.div>
  )
}

// ─── Thinking Dots ────────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0,1,2].map(i => (
        <motion.div key={i}
          animate={{ y: [0,-5,0] }} transition={{ duration: 0.6, delay: i*0.15, repeat: Infinity }}
          className="w-2 h-2 rounded-full" style={{ background: '#007A4D' }} />
      ))}
    </div>
  )
}

// ─── Multa Card Component ─────────────────────────────────────────────────────
function MultaCard({ multa, index }) {
  const fmt = (n) => `$${Number(n).toLocaleString('es-CO')}`
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 260, damping: 22 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(0,20,50,0.8)', border: '1px solid rgba(0,122,77,0.3)' }}
    >
      {/* Card header */}
      <div className="px-3 py-2 flex items-center justify-between"
        style={{ background: 'rgba(0,51,102,0.5)', borderBottom: '1px solid rgba(0,122,77,0.2)' }}>
        <span className="text-xs font-bold text-white/80">📋 {multa.numero}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
          style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
          {multa.estado}
        </span>
      </div>
      {/* Card body */}
      <div className="p-3">
        <div className="text-[11px] text-white/50 mb-1">📅 {multa.fecha} · {multa.codigo}</div>
        <div className="text-xs text-white/80 mb-3 leading-snug">{multa.descripcion}</div>
        {/* Pricing */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] text-white/40 line-through">{fmt(multa.valor_original)}</div>
            <div className="text-base font-black" style={{ color: '#4ade80' }}>{fmt(multa.valor_descuento)}</div>
            <div className="text-[10px]" style={{ color: '#4ade80' }}>con descuento del 50%</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40">Ahorras</div>
            <div className="text-sm font-bold" style={{ color: '#fbbf24' }}>💰 {fmt(multa.ahorro)}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Multas Summary Block ─────────────────────────────────────────────────────
function MultasSummary({ simitData }) {
  const fmt = (n) => `$${Number(n).toLocaleString('es-CO')}`
  const { comparendos, totales } = simitData
  return (
    <div className="space-y-2 w-full">
      {comparendos.map((m, i) => <MultaCard key={i} multa={m} index={i} />)}
      {/* Totals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: comparendos.length * 0.15 + 0.1 }}
        className="rounded-2xl p-3"
        style={{ background: 'rgba(0,122,77,0.15)', border: '1px solid rgba(0,122,77,0.4)' }}
      >
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-white/60">💰 Total deuda original</span>
            <span className="text-white/80 font-bold">{fmt(totales.original)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: '#4ade80' }}>✅ Pagando con descuento</span>
            <span className="font-bold" style={{ color: '#4ade80' }}>{fmt(totales.descuento)}</span>
          </div>
          <div className="h-px my-1" style={{ background: 'rgba(0,122,77,0.3)' }} />
          <div className="flex justify-between">
            <span className="font-bold" style={{ color: '#fbbf24' }}>🎉 Ahorro total</span>
            <span className="font-black text-sm" style={{ color: '#fbbf24' }}>{fmt(totales.ahorro)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Message Renderer ─────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-[1.2rem] rounded-tr-sm text-white"
          style={{ background: 'linear-gradient(135deg, #003366, #004a99)', boxShadow: '0 4px 16px rgba(0,51,102,0.4)', whiteSpace: 'pre-wrap' }}>
          {msg.content}
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      {msg.content && (
        <div className="max-w-[95%] px-4 py-3 text-sm leading-relaxed rounded-[1.2rem] rounded-tl-sm"
          style={{ background: 'rgba(0,51,102,0.35)', border: '1px solid rgba(0,122,77,0.2)', color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap' }}>
          {msg.content}
        </div>
      )}
      {msg.simitData && <MultasSummary simitData={msg.simitData} />}
    </div>
  )
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
export default function MovIAChatWidget() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [robotState, setRobotState] = useState('idle')
  const [idleBubble, setIdleBubble] = useState(false)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [quickReplies, setQuickReplies] = useState([])
  const [error, setError] = useState(null)

  const bottomRef = useRef(null)
  const idleTimerRef = useRef(null)
  const inputTimerRef = useRef(null)

  // ── Entrance ──
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 2000)
    const t2 = setTimeout(() => setShowBubble(true), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // ── Scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, isStreaming])

  // ── Idle timer ──
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimerRef.current)
    setIdleBubble(false)
    idleTimerRef.current = setTimeout(() => {
      if (!isOpen) {
        setIdleBubble(true)
        setTimeout(() => setIdleBubble(false), 8000)
      }
    }, 30000)
  }, [isOpen])

  useEffect(() => {
    resetIdleTimer()
    window.addEventListener('mousemove', resetIdleTimer)
    window.addEventListener('keydown', resetIdleTimer)
    window.addEventListener('click', resetIdleTimer)
    return () => {
      clearTimeout(idleTimerRef.current)
      window.removeEventListener('mousemove', resetIdleTimer)
      window.removeEventListener('keydown', resetIdleTimer)
      window.removeEventListener('click', resetIdleTimer)
    }
  }, [resetIdleTimer])

  // ── Open / Close ──
  const openPanel = useCallback((preloadMsg = null) => {
    setShowBubble(false)
    setIdleBubble(false)
    setIsOpen(true)
    if (preloadMsg && typeof preloadMsg === 'string') {
      setTimeout(() => sendMessage(null, preloadMsg), 400)
    }
  }, [])

  const closePanel = () => {
    setIsOpen(false)
    setTimeout(() => setShowBubble(true), 600)
  }

  // ── Send message ──
  const sendMessage = async (e, overrideMsg = null) => {
    if (e) e.preventDefault()
    const userMessage = overrideMsg || input.trim()
    if (!userMessage || isStreaming) return

    const sessionId = localStorage.getItem('movia_session_id') || ''
    setInput('')
    setError(null)
    setIsStreaming(true)
    setRobotState('thinking')
    setQuickReplies([])

    setHistory(prev => [...prev, { role: 'user', content: userMessage }])

    const { user } = useAuth()
    
    // ... inside sendMessage ...
    try {
      const res = await api.post('/chatbot/mensaje', { 
        sessionId, 
        message: userMessage,
        user: user ? { 
          id: user.id, 
          nombre: user.nombre, 
          cedula: user.cedula,
          placa_vehiculo: user.placa_vehiculo // Asegurarse de que venga en el user del context
        } : null 
      })
      const { response, quickReplies: qr, sessionId: newId, action, simitData } = res.data.data

      if (newId) localStorage.setItem('movia_session_id', newId)

      // Handle redirect action
      if (action === 'redirect_curso') {
        if (userMessage.toLowerCase().includes('ir al curso') || userMessage.toLowerCase().includes('🚀')) {
          setTimeout(() => navigate('/curso'), 800)
        }
      }

      // Push message (with simitData attached if present)
      setHistory(prev => [...prev, {
        role: 'assistant',
        content: response,
        simitData: simitData || null
      }])
      setQuickReplies(qr || [])

      // Celebration state
      if (response.includes('¡Buenas noticias') || response.includes('Felicidades') || response.includes('aprobado')) {
        setRobotState('celebrating')
        setTimeout(() => setRobotState('idle'), 5000)
      } else {
        setRobotState('idle')
      }
    } catch (err) {
      console.error(err)
      setError('No puedo conectarme con el servidor. Verifica tu conexión e intenta de nuevo.')
      setRobotState('idle')
    } finally {
      setIsStreaming(false)
    }
  }

  const handleQuickReply = (reply) => {
    if (isStreaming) return
    // Redirect shortcuts
    if (reply.includes('Ir al curso') || reply.includes('🚀')) {
      navigate('/curso')
      return
    }
    sendMessage(null, reply)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setRobotState('typing')
    clearTimeout(inputTimerRef.current)
    inputTimerRef.current = setTimeout(() => setRobotState('idle'), 1500)
  }

  const handleEscalar = async () => {
    try {
      const res = await api.post('/pqr/escalar', { history, motivo: 'Solicitud explícita del usuario' })
      setHistory(prev => [...prev, { role: 'assistant', content: res.data.message || '📞 Un asesor se pondrá en contacto contigo pronto.\n\nTambién puedes llamar al **602 445 9000 ext. 1**\nLunes a Viernes 8am–5pm', simitData: null }])
    } catch {
      setError('Error al conectar con soporte humano. Llama al 602 445 9000 ext. 1')
    }
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            id="movia-root"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3"
          >

            {/* ── IDLE NUDGE ── */}
            <AnimatePresence>
              {idleBubble && !isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => openPanel()}
                  className="absolute bottom-[calc(100%+12px)] right-0 w-[220px] cursor-pointer rounded-[1.4rem] rounded-br-md px-4 py-3 shadow-2xl"
                  style={{ background: 'rgba(0,51,102,0.97)', border: '1px solid rgba(0,122,77,0.5)', backdropFilter: 'blur(16px)' }}
                >
                  <p className="text-white text-xs font-semibold">
                    💡 ¿Sabías que puedes obtener <span style={{ color: '#4ade80' }}>50% de descuento</span> en tu multa?
                  </p>
                  <div className="absolute bottom-[-7px] right-5 w-3.5 h-3.5 rotate-45"
                    style={{ background: 'rgba(0,51,102,0.97)', borderRight: '1px solid rgba(0,122,77,0.5)', borderBottom: '1px solid rgba(0,122,77,0.5)' }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── GREETING BUBBLE ── */}
            <AnimatePresence>
              {showBubble && !isOpen && (
                <div className="relative">
                  <GreetingBubble onOpen={openPanel} />
                </div>
              )}
            </AnimatePresence>

            {/* ── ROBOT + PANEL ── */}
            <div className="relative flex items-end gap-0">

              {/* Robot */}
              <motion.div layout
                animate={isOpen ? { scale: 0.65, opacity: 0.9 } : { scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                onClick={() => { if (!isOpen) openPanel() }}
                className={`shrink-0 ${isOpen ? 'cursor-default' : 'cursor-pointer'}`}
                style={{ transformOrigin: 'bottom right' }}
              >
                <MovIARobot state={robotState} size={isOpen ? 60 : 82} />
              </motion.div>

              {/* ── CHAT PANEL ── */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.3, x: 50, y: 60 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.3, x: 50, y: 60 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 26 }}
                    className="absolute bottom-0 right-20 flex flex-col overflow-hidden shadow-2xl"
                    style={{
                      width: 'min(390px, calc(100vw - 110px))',
                      height: 'min(600px, 84vh)',
                      borderRadius: '2rem',
                      background: 'rgba(6,11,20,0.97)',
                      border: '1px solid rgba(0,122,77,0.35)',
                      boxShadow: '0 0 0 1px rgba(0,51,102,0.4), 0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(0,122,77,0.12)',
                      backdropFilter: 'blur(32px)'
                    }}
                  >
                    {/* Neon top accent */}
                    <div className="h-[2px] w-full shrink-0"
                      style={{ background: 'linear-gradient(90deg, #003366, #007A4D, #003366)' }} />

                    {/* ── HEADER ── */}
                    <div className="flex items-center gap-3 px-4 py-3 shrink-0 border-b"
                      style={{ borderColor: 'rgba(0,122,77,0.2)', background: 'rgba(0,30,60,0.6)' }}>
                      <div className="shrink-0">
                        <img src="/logo.transito.png" alt="Logo" className="w-10 h-10 object-contain brightness-0 invert" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-black text-sm">MOV-IA</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-[10px] font-semibold" style={{ color: '#4ade80' }}>
                            {isStreaming ? 'Procesando...' : 'En línea · Secretaría de Movilidad'}
                          </span>
                        </div>
                      </div>
                      <button onClick={closePanel}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                        <ChevronDown size={18} />
                      </button>
                    </div>

                    {/* ── MESSAGES ── */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3"
                      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,122,77,0.2) transparent' }}>

                      {/* Initial greeting */}
                      {history.length === 0 && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                          <div className="max-w-[95%] mr-auto mb-3">
                            <div className="p-3.5 rounded-[1.2rem] rounded-tl-sm text-sm leading-relaxed"
                              style={{ background: 'rgba(0,51,102,0.4)', border: '1px solid rgba(0,122,77,0.25)', color: 'rgba(255,255,255,0.9)' }}>
                              ¡Hola! 👋 Soy <strong>MOV-IA</strong>, el asistente virtual de la Secretaría de Movilidad de Cali. Puedo ayudarte con multas, cursos y más. ¿En qué te puedo ayudar?
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {INITIAL_QUICK_REPLIES.map((qr, i) => (
                              <motion.button key={i}
                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.07 }}
                                onClick={() => handleQuickReply(qr.label)}
                                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all hover:scale-[1.02]"
                                style={{ background: 'rgba(0,122,77,0.1)', border: '1px solid rgba(0,122,77,0.25)', color: 'rgba(255,255,255,0.8)' }}>
                                <span>{qr.icon}</span>{qr.label}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Chat history */}
                      {history.map((msg, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                        >
                          <MessageBubble msg={msg} />
                        </motion.div>
                      ))}

                      {/* Thinking */}
                      {isStreaming && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex">
                          <div className="rounded-[1.2rem] rounded-tl-sm"
                            style={{ background: 'rgba(0,51,102,0.35)', border: '1px solid rgba(0,122,77,0.2)' }}>
                            <ThinkingDots />
                          </div>
                        </motion.div>
                      )}

                      {/* Quick replies */}
                      {quickReplies.length > 0 && !isStreaming && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {quickReplies.map((qr, i) => (
                            <motion.button key={i}
                              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.06 }}
                              onClick={() => handleQuickReply(qr)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                              style={{ background: 'rgba(0,122,77,0.15)', border: '1px solid rgba(0,122,77,0.35)', color: '#4ade80' }}>
                              {qr.includes('curso') || qr.includes('🚀') ? <ExternalLink size={10} /> : null}
                              {qr}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Error */}
                      {error && (
                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs"
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />{error}
                        </div>
                      )}

                      <div ref={bottomRef} />
                    </div>

                    {/* ── ESCALAR ── */}
                    <div className="px-4 pt-2 shrink-0">
                      <button onClick={handleEscalar} disabled={isStreaming}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-40"
                        style={{ color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <PhoneCall size={12} />Necesito atención humana
                      </button>
                    </div>

                    {/* ── INPUT ── */}
                    <form onSubmit={sendMessage} className="p-4 pt-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={input}
                          onChange={handleInputChange}
                          disabled={isStreaming}
                          placeholder="Escribe tu consulta..."
                          className="flex-1 py-3 px-4 rounded-2xl text-sm text-white placeholder:text-white/25 focus:outline-none transition-all disabled:opacity-50"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: `1px solid ${input.length > 0 ? 'rgba(0,122,77,0.5)' : 'rgba(255,255,255,0.08)'}`,
                            boxShadow: input.length > 0 ? '0 0 12px rgba(0,122,77,0.15)' : 'none'
                          }}
                        />
                        <button type="submit" disabled={!input.trim() || isStreaming}
                          className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30"
                          style={{ background: 'linear-gradient(135deg, #003366, #007A4D)', boxShadow: '0 4px 14px rgba(0,122,77,0.35)' }}>
                          <Send size={16} className="text-white" />
                        </button>
                      </div>
                    </form>

                    <div className="h-[1px] shrink-0"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(0,122,77,0.3), transparent)' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
