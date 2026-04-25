import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react'
import api from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatbotWidget() {
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState([])
  const [quickReplies, setQuickReplies] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const bottomRef = useRef(null)

  // Initialize session and trigger first greeting
  useEffect(() => {
    let currentSession = localStorage.getItem('tramites_session_id')
    if (!currentSession) {
      currentSession = uuidv4()
      localStorage.setItem('tramites_session_id', currentSession)
    }
    setSessionId(currentSession)
    sendMessage('', currentSession, true)
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, quickReplies])

  const sendMessage = async (text, id = sessionId, isInit = false) => {
    if (!isInit && !text.trim()) return

    if (!isInit) {
      setMessages(prev => [...prev, { role: 'user', content: text }])
      setInput('')
    }
    
    setLoading(true)
    setError(null)
    setQuickReplies([])

    try {
      const res = await api.post('/chatbot/mensaje', {
        sessionId: id,
        message: text
      })

      const data = res.data.data
      setMessages(prev => [...prev, { role: 'bot', content: data.response }])
      setQuickReplies(data.quickReplies || [])
      
      if (data.action === 'redirect_curso') {
        setTimeout(() => {
          window.location.href = '/curso'
        }, 3000)
      }
      
    } catch (err) {
      console.error(err)
      setError('No pudimos conectar con el servidor. Por favor, intenta de nuevo.')
      if (isInit) {
        setMessages([{ role: 'bot', content: 'Disculpa, el servicio de diagnóstico virtual no está disponible en este momento.' }])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-gris-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shrink-0 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold font-display">Asistente de Trámites</h3>
          <p className="text-blue-100 text-xs text-opacity-80">Agendamiento y Consultas</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0F19]">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-white/10 text-white/90 rounded-tl-sm'
            }`} style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
            <span className="text-[10px] text-white/30 mt-1 mx-1">
              {msg.role === 'user' ? 'Tú' : 'Movilidad Bot'}
            </span>
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center bg-white/5 w-fit p-3 rounded-2xl rounded-tl-sm text-white/50">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span className="text-xs ml-1 font-medium">Escribiendo...</span>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </motion.div>
        )}
        
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies Area */}
      <AnimatePresence>
        {quickReplies.length > 0 && !loading && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 20, opacity: 0 }}
            className="p-3 bg-[#0B0F19] border-t border-white/5 flex flex-wrap gap-2 shrink-0"
          >
            {quickReplies.map((qr, i) => (
              <button
                key={i}
                onClick={() => sendMessage(qr)}
                className="px-4 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold whitespace-nowrap transition-colors"
              >
                {qr}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 bg-gris-900 border-t border-white/10 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Escribe un mensaje..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg disabled:bg-white/10 disabled:text-white/30 transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </form>
    </div>
  )
}
