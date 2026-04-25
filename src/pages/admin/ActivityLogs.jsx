import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Calendar, 
  Activity, 
  Mail, 
  Bot, 
  Settings, 
  ChevronRight,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Inbox
} from 'lucide-react'
import { TableSkeleton, EmptyState } from '../../components/UIUtilities'
import api from '../../services/api'

export default function ActivityLogs() {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [logs, setLogs] = useState([])
  const [emailLogs, setEmailLogs] = useState([])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        if (activeTab === 'general') {
          const res = await api.get('/logs')
          setLogs(res.data.data.map(l => ({
            id: l._id,
            timestamp: new Date(l.createdAt).toLocaleString(),
            type: l.tipo_evento.replace(/_/g, ' '),
            channel: l.canal || 'Sistema',
            description: l.descripcion,
            ref: l.cita_id?.codigo_cita || 'N/A'
          })))
        } else {
          const res = await api.get('/logs/email')
          setEmailLogs(res.data.data.map(l => ({
            id: l._id,
            timestamp: new Date(l.createdAt).toLocaleString(),
            sender: l.remitente,
            subject: l.asunto,
            intent: l.intencion_detectada || 'N/A',
            result: l.resultado_ia || 'N/A',
            appointment: l.cita_id?.codigo_cita || 'N/A',
            responseSent: l.respuesta_enviada
          })))
        }
      } catch (error) {
         console.error(error)
      } finally { setLoading(false) }
    }
    fetchLogs()
  }, [activeTab])

  const filteredGeneralLogs = logs.filter(log => 
    log.description.toLowerCase().includes(search.toLowerCase()) ||
    log.type.toLowerCase().includes(search.toLowerCase())
  )

  const filteredEmailLogs = emailLogs.filter(log => 
    log.sender?.toLowerCase().includes(search.toLowerCase()) ||
    log.subject?.toLowerCase().includes(search.toLowerCase()) ||
    log.intent?.toLowerCase().includes(search.toLowerCase())
  )

  const getEventBadge = (type) => {
    const types = {
      'Cita agendada': 'bg-verde-100 text-verde-700 border-verde-200',
      'Cita cancelada': 'bg-red-100 text-red-700 border-red-200',
      'Cita completada': 'bg-gris-200 text-gris-700 border-gris-300',
      'Correo procesado': 'bg-blue-100 text-blue-700 border-blue-200',
      'Recordatorio enviado': 'bg-dorado-100 text-dorado-700 border-dorado-200',
    }
    return types[type] || 'bg-gris-100 text-gris-600 border-gris-200'
  }

  const getIntentBadge = (intent) => {
    const intents = {
      'nueva_cita': 'bg-verde-100 text-verde-700 border-verde-200',
      'consulta': 'bg-blue-100 text-blue-700 border-blue-200',
      'cancelacion': 'bg-red-100 text-red-700 border-red-200',
      'no_reconocido': 'bg-gris-100 text-gris-600 border-gris-200',
    }
    return intents[intent] || 'bg-gris-100 text-gris-600 border-gris-200'
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gris-900 tracking-tight">Logs de Actividad</h2>
          <p className="text-gris-500 font-medium mt-1">Auditoría en tiempo real de eventos y procesamiento de IA.</p>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
        <div className="flex p-1.5 bg-gris-100 rounded-[2rem] w-full sm:w-auto shadow-inner border border-gris-200">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex-1 sm:flex-none px-8 py-3.5 rounded-[1.8rem] text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-500 ${
              activeTab === 'general' 
              ? 'bg-white text-gris-900 shadow-xl scale-[1.02]' 
              : 'text-gris-500 hover:text-gris-800'
            }`}
          >
            <Activity size={18} /> Todas las Actividades
          </button>
          <button 
            onClick={() => setActiveTab('email')}
            className={`flex-1 sm:flex-none px-8 py-3.5 rounded-[1.8rem] text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-500 ${
              activeTab === 'email' 
              ? 'bg-white text-gris-900 shadow-xl scale-[1.02]' 
              : 'text-gris-500 hover:text-gris-800'
            }`}
          >
            <Inbox size={18} /> Logs de Correo (PNL)
          </button>
        </div>

        <div className="relative w-full xl:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar en los registros..." 
            className="input-premium pl-12 h-14 bg-white border-gris-200 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="card-glass bg-white border border-gris-200 overflow-hidden shadow-sm">
        <AnimatePresence mode="wait">
          {loading ? (
            <div key="loading" className="p-10"><TableSkeleton rows={8} /></div>
          ) : activeTab === 'general' ? (
            <motion.div 
              key="general"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="overflow-x-auto custom-scrollbar"
            >
              {filteredGeneralLogs.length > 0 ? (
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-gris-50/80 text-gris-500 font-sans text-[10px] uppercase tracking-widest border-b border-gris-200 font-extrabold">
                      <th className="p-6">Fecha y Hora</th>
                      <th className="p-6">Tipo de Evento</th>
                      <th className="p-6">Canal</th>
                      <th className="p-6">Descripción</th>
                      <th className="p-6 text-center">Referencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gris-100 text-sm font-sans font-medium">
                    {filteredGeneralLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gris-50/60 transition-colors group">
                        <td className="p-6">
                            <div className="font-bold text-gris-800">{log.timestamp.split(' ')[0]}</div>
                            <div className="text-[10px] text-gris-400 font-extrabold flex items-center gap-1 uppercase">
                                <Clock size={10} /> {log.timestamp.split(' ')[1]}
                            </div>
                        </td>
                        <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border shadow-sm ${getEventBadge(log.type)}`}>
                                {log.type}
                            </span>
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-2 font-bold text-gris-600">
                                {log.channel === 'Chatbot' ? <Bot size={16} className="text-blue-500" /> : 
                                 log.channel === 'Correo' ? <Mail size={16} className="text-verde-500" /> : 
                                 <Settings size={16} className="text-gris-400" />}
                                {log.channel}
                            </div>
                        </td>
                        <td className="p-6 max-w-md">
                            <p className="text-gris-700 leading-relaxed font-bold">{log.description}</p>
                        </td>
                        <td className="p-6 text-center">
                            <button className="text-verde-600 font-extrabold text-xs flex items-center justify-center gap-1.5 hover:underline uppercase tracking-tighter">
                                {log.ref} <ExternalLink size={12} />
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState title="Sin registros de actividad" />
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="overflow-x-auto custom-scrollbar"
            >
              {filteredEmailLogs.length > 0 ? (
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-gris-50/80 text-gris-500 font-sans text-[10px] uppercase tracking-widest border-b border-gris-200 font-extrabold">
                      <th className="p-6">Timestamp</th>
                      <th className="p-6">Remitente / Asunto</th>
                      <th className="p-6 text-center">Intención Detectada</th>
                      <th className="p-6 text-center">Resultado IA</th>
                      <th className="p-6 text-center">Cita / Ref</th>
                      <th className="p-6 text-center">Respuesta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gris-100 text-sm font-sans font-medium">
                    {filteredEmailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gris-50/60 transition-colors group">
                        <td className="p-6">
                            <div className="font-bold text-gris-800 whitespace-nowrap">{log.timestamp}</div>
                        </td>
                        <td className="p-6">
                            <div className="font-extrabold text-gris-900 mb-1">{log.sender}</div>
                            <div className="text-xs text-gris-500 italic flex items-center gap-1.5">
                                <MessageSquare size={12} /> "{log.subject}"
                            </div>
                        </td>
                        <td className="p-6 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border shadow-sm ${getIntentBadge(log.intent)}`}>
                                {log.intent}
                            </span>
                        </td>
                        <td className="p-6 text-center font-bold text-gris-700">
                             {log.result}
                        </td>
                        <td className="p-6 text-center font-extrabold text-verde-600">
                             {log.appointment}
                        </td>
                        <td className="p-6 text-center">
                            {log.responseSent ? (
                                <span className="inline-flex items-center gap-1.5 text-verde-600 font-extrabold text-[10px] uppercase bg-verde-50 px-3 py-1.5 rounded-xl border border-verde-200">
                                    <CheckCircle size={14} /> Enviada
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-gris-400 font-extrabold text-[10px] uppercase bg-gris-50 px-3 py-1.5 rounded-xl border border-gris-200">
                                    <AlertCircle size={14} /> N/A
                                </span>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState title="Sin logs de procesamiento" message="No hay correos registrados bajo este criterio." />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
