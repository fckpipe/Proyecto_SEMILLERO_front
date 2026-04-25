import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot } from 'lucide-react'

// --- Mocked AI Logic ---
const INITIAL_MSG = {
  id: 'msg-init',
  role: 'ai',
  text: '👋 ¡Hola! Soy el asistente con Inteligencia Artificial de la Secretaría de Movilidad. \n\nEstoy aquí para guiarte paso a paso. ¿Tienes alguna duda sobre tu comparendo, el curso pedagógico o necesitas radicar una solicitud?'
}

const SUGGESTIONS = [
  "No sé cómo empezar",
  "¿Cómo tomo el curso?",
  "Estado de mi comparendo",
  "Descargar certificado"
]

const getMockResponse = (query) => {
  const q = query.toLowerCase()
  
  // 1. Cómo empezar / Guía paso a paso
  if (q.match(/empezar|iniciar|pasos|como funciona|guia|perdido|no se/)) {
    return `¡No te preocupes! Aquí te explico el paso a paso exacto para realizar tu trámite virtual:

1️⃣ **Registro:** Si es tu primera vez, ingresa a la sección de "Registro" con tu cédula y correo.
2️⃣ **Validación:** El sistema validará automáticamente si tienes comparendos pendientes.
3️⃣ **Curso Virtual:** Selecciona el botón verde "Iniciar curso virtual". Son 5 módulos guiados por IA.
4️⃣ **Examen:** Al final de los módulos, realizarás una prueba de 20 preguntas (debes obtener mínimo 70%).
5️⃣ **Certificación:** Obtendrás tu certificado oficial de cumplimiento inmediatamente en PDF.

¿Deseas que te ayude con el primer paso?`
  }

  // 2. Sobre el curso específicamente
  if (q.match(/curso|clases|modulos/)) {
    return `Nuestro nuevo **Curso Pedagógico Virtual** te permite obtener tu descuento de ley sin salir de casa.
    
• Está disponible 24/7.
• Cuenta con 5 módulos interactivos.
• Un tutor de IA te acompañará en cada lección.
• Cuenta con un sistema de verificación para asegurar que estés atento.

Para acceder, solo debes hacer clic en "Curso Virtual" en el menú superior o en el botón verde de "Iniciar curso virtual".`
  }

  // 3. Sobre comparendos y multas
  if (q.match(/comparendo|multa|pagar|pago|deuda/)) {
    return `Para radicar un pago o consultar el estado actual de tu comparendo:

1. Inicia sesión en tu cuenta.
2. Dirígete a tu **Panel Administrativo** (Dashboard).
3. Selecciona la opción **"Estado de Cuenta / Comparendos"**.
4. Allí podrás generar tu recibo oficial para pagar vía PSE o en bancos autorizados.

*Recuerda que si haces el curso pedagógico dentro de los primeros días, tienes derecho al porcentaje de descuento de ley.*`
  }

  // 4. Sobre certificados
  if (q.match(/certificado|diploma|aprobacion|descargar/)) {
    return `El certificado de asistencia al curso pedagógico se genera de forma **inmediata y automática** una vez apruebas el examen final (puntaje mayor al 70%).

Podrás descargarlo en formato PDF, el cual cuenta con un código QR de verificación institucional para confirmar su validez legal. Si ya lo aprobaste, ve a la sección "Mi Certificado".`
  }

  // 5. Quejas, reclamos o PQR
  if (q.match(/queja|Reclamo|pqr|solicitud|problema/)) {
    return `Comprendo tu situación. Toda petición, queja o reclamo (PQR) debe quedar debidamente radicada en nuestro sistema.

Puedes hacerlo de dos formas:
• **Digital:** Ingresando al menú "Respuestas" y llenando el formulario de PQR radicado.
• **Asistido:** Chateando con un asesor humano en tiempo real desde este mismo canal.`
  }

  // 6. Hablar con humano
  if (q.match(/asesor|humano|persona|agente/)) {
    return 'Entendido. Estoy conectándote a la línea directa con un agente humano. Por favor, mantén esta ventana abierta y no recargues la página... ⏳'
  }

  // 7. Saludos cordiales
  if (q.match(/hola|buenos dias|buenas|saludos/)) {
    return '¡Hola! Es un gusto saludarte. ¿En qué trámite de movilidad te puedo colaborar hoy? Puedes preguntarme sobre tus comparendos, cursos o PQR.'
  }

  // 8. Default (Intento de ser lo más deductivo posible)
  return `Esa es una excelente pregunta. Para darte la respuesta más precisa según tu caso (ya que cada comparendo o trámite puede variar):

Te sugiero **Iniciar tu trámite virtual** desde el botón superior derecho, o si prefieres, detállame un poco más tu consulta (ej. usa palabras como "comparendo", "curso", o "certificado").`
}

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MSG])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (text) => {
    if (!text.trim() || isTyping) return

    const newMsg = { id: `msg-${Date.now()}`, role: 'user', text: text.trim() }
    setMessages(prev => [...prev, newMsg])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const respText = getMockResponse(text)
      setMessages(prev => [...prev, { id: `ai-${Date.now()}`, role: 'ai', text: respText }])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  // Helper to standard text with \n into multiple paragraphs
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i} className="block min-h-[14px]">
        {line}
      </span>
    ))
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed bottom-24 right-5 sm:right-8 w-[380px] max-w-[calc(100vw-40px)] h-[540px] max-h-[calc(100vh-120px)] bg-gris-900 border border-white/10 shadow-2xl shadow-verde-500/10 rounded-[2rem] flex flex-col z-[200] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gris-800 p-4 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-verde-500 flex items-center justify-center shadow-lg shadow-verde-500/20">
                    <Bot size={22} className="text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gris-800 rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-white font-display font-bold text-sm leading-tight">Asistente IA</h3>
                  <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">Secretaría de Movilidad</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-gris-900 to-gris-800">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-verde-600 text-white rounded-br-sm shadow-verde-500/20' 
                      : 'bg-white/5 border border-white/5 text-white/90 rounded-bl-sm'
                  }`}>
                    {renderFormattedText(msg.text)}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-verde-500 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-verde-500 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-verde-500 rounded-full" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gris-800 border-t border-white/5 shrink-0">
              {/* Sugerencias si el chat está vacío aparte del saludo */}
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug)}
                      className="text-xs bg-verde-500/10 hover:bg-verde-500/20 text-verde-300 border border-verde-500/20 rounded-full px-3 py-1.5 transition-colors whitespace-nowrap"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                className="flex items-center gap-2 relative mt-2"
              >
                <input
                  type="text"
                  placeholder="Escribe tu consulta..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-gris-900 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-verde-500/50 transition-colors placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 top-1.5 bottom-1.5 w-9 rounded-full bg-verde-500 hover:bg-verde-400 disabled:bg-white/10 disabled:text-white/30 flex items-center justify-center text-gris-900 font-bold transition-all"
                >
                  <Send size={15} className={inputValue.trim() && !isTyping ? 'translate-x-[1px]' : ''} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flotante Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-5 sm:right-8 z-[200] flex flex-col items-end gap-3"
          >
            {/* Promo tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-white text-gris-900 text-xs font-bold py-2 px-4 rounded-xl shadow-xl shadow-black/20 relative"
            >
              ¡Hola! ¿Necesitas ayuda? 👋
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45" />
            </motion.div>

            <button
              onClick={() => setIsOpen(true)}
              className="relative group flex items-center justify-center w-14 h-14 bg-verde-500 text-white rounded-full shadow-2xl hover:scale-105 hover:bg-verde-400 transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-verde-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <MessageSquare size={26} className="relative z-10" />
              
              {/* Online badge */}
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] font-bold flex items-center justify-center shadow-sm">
                1
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
