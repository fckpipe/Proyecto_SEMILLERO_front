import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock, MonitorPlay, AlertTriangle, MessageSquare, MapPin, CheckCircle, Users } from 'lucide-react'

// --- Mock Data ---
const EVENTS = [
  { id: 1, title: 'Revisión Caso Grupo A', day: 2, time: '08:00 AM', type: 'virtual', desc: 'Auditoría sobre normas en curso con 20 infractores concurrentes.', location: 'Sala Virtual 1' },
  { id: 2, title: 'Revisión Exámenes', day: 2, time: '11:00 AM', type: 'virtual', desc: 'Auditar 15 exámenes completados en la plataforma virtual.', location: 'Plataforma Virtual' },
  { id: 3, title: 'Cierre Descuentos', day: 5, time: '11:59 PM', type: 'vencimiento', desc: 'Vencimiento del 50% de descuento para 120 ciudadanos.', location: 'Sistema Nacional' },
  { id: 4, title: 'PQR: Fallo en login', day: 5, time: '10:00 AM', type: 'pqr', desc: 'Ciudadano reporta error de servidor al intentar iniciar sesión en el curso.', location: 'Módulo PQR' },
  { id: 5, title: 'Reunión Soporte Técnico', day: 12, time: '02:00 PM', type: 'virtual', desc: 'Revisión tickets de soporte (15 cupos).', location: 'Meet Soporte' },
  { id: 6, title: 'Mantenimiento Servidor', day: 15, time: '03:00 AM', type: 'vencimiento', desc: 'Ventana de mantenimiento programada para la base de datos.', location: 'Data Center' },
  { id: 7, title: 'PQR: Error en Certificado', day: 2, time: '04:15 PM', type: 'pqr', desc: 'Ciudadano indica que el PDF descargado aparece en blanco.', location: 'Soporte Nivel 2' },
  { id: 8, title: 'Revisión Anti-trampas', day: 14, time: '09:00 AM', type: 'virtual', desc: 'Evaluar 4 bloqueos generados hoy por salir de pestaña.', location: 'Auditoría' },
  { id: 9, title: 'Soporte Reincidencias', day: 18, time: '08:00 AM', type: 'virtual', desc: 'Revisión de reincidencias graves en portal online.', location: 'Auditoría' },
]

export default function Agenda() {
  const [currentView, setCurrentView] = useState('Mensual')
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Generamos un mes falso de 31 días que empieza en el día 3 (miércoles)
  const blanks = Array(3).fill(null)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const calendarCells = [...blanks, ...days]

  const getEventsForDay = (d) => EVENTS.filter(e => e.day === d)

  const getTypeStyle = (type) => {
    switch(type) {
      case 'asistencia': return { bg: 'bg-dorado-500/10', text: 'text-dorado-700', border: 'border-dorado-500/30', color: '#e6b000', icon: MapPin }
      case 'virtual': return { bg: 'bg-verde-500/10', text: 'text-verde-700', border: 'border-verde-500/30', color: '#22c55e', icon: MonitorPlay }
      case 'vencimiento': return { bg: 'bg-red-500/10', text: 'text-red-700', border: 'border-red-500/30', color: '#ef4444', icon: AlertTriangle }
      case 'pqr': return { bg: 'bg-blue-500/10', text: 'text-blue-700', border: 'border-blue-500/30', color: '#3b82f6', icon: MessageSquare }
      default: return { bg: 'bg-gris-100', text: 'text-gris-600', border: 'border-gris-200', color: '#cbd5e1', icon: Clock }
    }
  }

  // Today is forced to 2 for demonstration
  const today = 2

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full">
      
      {/* --- COLUMNA IZQUIERDA: CALENDARIO (70%) --- */}
      <div className="flex-1 flex flex-col bg-white card-glass shadow-sm border border-gris-200 overflow-hidden min-h-[700px]">
        {/* Header Calendario */}
        <div className="p-6 border-b border-gris-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="p-2 border border-gris-200 text-gris-600 rounded-xl hover:bg-gris-50 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 border border-gris-200 text-gris-600 rounded-xl hover:bg-gris-50 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-gris-900">Noviembre 2026</h2>
          </div>

          <div className="flex bg-gris-100 p-1.5 rounded-2xl">
            {['Diaria', 'Semanal', 'Mensual'].map(view => (
              <button 
                key={view} 
                onClick={() => setCurrentView(view)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentView === view 
                    ? 'bg-white text-verde-700 shadow-sm' 
                    : 'text-gris-500 hover:text-gris-700'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 flex flex-wrap gap-4 border-b border-gris-50 bg-white shrink-0">
          {[
            { tag: 'Soporte Virtual', color: 'bg-dorado-500' },
            { tag: 'Curso Virtual', color: 'bg-verde-500' },
            { tag: 'Pendiente PQR', color: 'bg-blue-500' },
            { tag: 'Vencimientos', color: 'bg-red-500' }
          ].map(l => (
            <div key={l.tag} className="flex items-center gap-2 text-xs font-bold text-gris-600 uppercase tracking-widest">
              <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} /> {l.tag}
            </div>
          ))}
        </div>

        {/* Grid Calendario */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gris-50">
          <div className="grid grid-cols-7 border-b border-gris-200 bg-white shrink-0">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
              <div key={d} className="py-3 text-center text-[10px] font-extrabold text-gris-400 uppercase tracking-widest">{d}</div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto custom-scrollbar">
            {calendarCells.map((day, idx) => (
              <div 
                key={idx} 
                className={`min-h-[120px] p-2 border-r border-b border-gris-200 bg-white hover:bg-gris-50 transition-colors flex flex-col ${
                  day === today ? 'bg-verde-50/30' : ''
                }`}
              >
                {day && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                       <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                          day === today ? 'bg-verde-500 text-white shadow-md shadow-verde-500/20' : 'text-gris-500'
                       }`}>
                         {day}
                       </span>
                    </div>
                    <div className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
                      {getEventsForDay(day).map(ev => {
                        const style = getTypeStyle(ev.type)
                        return (
                          <button
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className={`w-full text-left px-2 py-1.5 rounded-lg border text-xs font-bold truncate transition-transform hover:scale-[1.02] ${style.bg} ${style.border} ${style.text}`}
                          >
                            <span className="opacity-70 mr-1">{ev.time.split(' ')[0]}</span> 
                            {ev.title}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA: INSIGHTS (30%) --- */}
      <div className="w-full xl:w-80 flex flex-col gap-6">
        
        {/* Proximos hoy */}
        <div className="card-glass bg-white p-6 border border-gris-200">
          <h3 className="text-lg font-display font-extrabold text-gris-900 mb-5 flex items-center gap-2">
            <CalendarIcon size={20} className="text-verde-500" /> Agenda de Hoy
          </h3>
          <div className="space-y-4">
            {getEventsForDay(today).length === 0 ? (
              <p className="text-gris-400 text-sm font-medium">No hay eventos para hoy.</p>
            ) : (
              getEventsForDay(today).map(ev => {
                const style = getTypeStyle(ev.type)
                const Icon = style.icon
                return (
                  <div key={ev.id} className="flex gap-4 group cursor-pointer" onClick={() => setSelectedEvent(ev)}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${style.bg} ${style.border} ${style.text} group-hover:bg-white`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gris-900 leading-tight group-hover:text-verde-600 transition-colors">{ev.title}</p>
                      <p className="text-xs text-gris-400 font-bold mt-1 uppercase tracking-widest">{ev.time}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Alertas */}
        <div className="card-glass bg-white p-6 border border-gris-200">
           <h3 className="text-lg font-display font-extrabold text-gris-900 mb-5 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500" /> Alertas Críticas
          </h3>
          <div className="space-y-3">
             <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                   <p className="text-sm font-bold text-red-900">12 PQR sin responder</p>
                   <p className="text-xs text-red-700/70 mt-0.5">Cerca del límite legal de respuesta.</p>
                </div>
             </div>
             <div className="bg-dorado-500/10 border border-dorado-500/20 p-4 rounded-2xl flex items-start gap-3">
                <Users size={18} className="text-dorado-600 shrink-0 mt-0.5" />
                <div>
                   <p className="text-sm font-bold text-dorado-900">Capacidad Cloud al Límite</p>
                   <p className="text-xs text-dorado-700/70 mt-0.5">El servidor de video reporta alta concurrencia para hoy.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Estadisticas rapidas */}
        <div className="card-glass bg-white p-6 border border-gris-200 flex-1 min-h-[200px]">
           <h3 className="text-lg font-display font-extrabold text-gris-900 mb-5 flex items-center gap-2">
            <CheckCircle size={20} className="text-blue-500" /> Avance Diario (Cursos)
          </h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gris-50 border border-gris-100 p-4 rounded-2xl text-center">
                 <p className="text-3xl font-display font-black text-verde-600">45</p>
                 <p className="text-[10px] font-bold text-gris-500 uppercase tracking-widest mt-1">Aprobados</p>
             </div>
             <div className="bg-gris-50 border border-gris-100 p-4 rounded-2xl text-center">
                 <p className="text-3xl font-display font-black text-dorado-500">12</p>
                 <p className="text-[10px] font-bold text-gris-500 uppercase tracking-widest mt-1">En progreso</p>
             </div>
             <div className="col-span-2 bg-gris-50 border border-gris-100 p-4 rounded-2xl text-center">
                 <p className="text-3xl font-display font-black text-red-500">3</p>
                 <p className="text-[10px] font-bold text-gris-500 uppercase tracking-widest mt-1">Bloqueados (Anti-trampa)</p>
             </div>
          </div>
        </div>

      </div>

      {/* --- MODAL DETALLE EVENTO --- */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gris-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden border border-gris-200"
            >
              {/* Modal Header */}
              {(() => {
                const style = getTypeStyle(selectedEvent.type)
                const Icon = style.icon
                return (
                  <div>
                    <div className={`p-6 flex items-start justify-between ${style.bg}`}>
                      <div className="flex gap-4 items-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm ${style.text}`}>
                          <Icon size={28} />
                        </div>
                        <div>
                          <div className={`text-[10px] font-extrabold uppercase tracking-widest ${style.text} mb-1.5`}>
                            {selectedEvent.type === 'vencimiento' ? 'Alerta Sistema' : 'Evento Programado'}
                          </div>
                          <h2 className="text-2xl font-display font-black text-gris-900 leading-tight">
                            {selectedEvent.title}
                          </h2>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedEvent(null)}
                        className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gris-500"
                      >
                         <X size={20} />
                      </button>
                    </div>

                    <div className="p-8">
                      <div className="grid grid-cols-2 gap-6 mb-8">
                         <div>
                            <p className="text-[10px] font-bold text-gris-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Horario</p>
                            <p className="text-base font-bold text-gris-900">{selectedEvent.time}</p>
                            <p className="text-xs text-gris-500 font-medium">Día {selectedEvent.day} de Noviembre</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-gris-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Ubicación / Canal</p>
                            <p className="text-base font-bold text-gris-900 truncate">{selectedEvent.location}</p>
                         </div>
                      </div>
                      
                      <div className="bg-gris-50 border border-gris-200 p-5 rounded-2xl mb-8 text-sm text-gris-700 font-medium leading-relaxed">
                        {selectedEvent.desc}
                      </div>

                      <div className="flex gap-4">
                        <button className="flex-1 btn-primary py-4 text-sm justify-center">
                           Gestionar Evento
                        </button>
                        <button className="flex-1 btn-outline py-4 text-sm justify-center border-gris-300 text-gris-700">
                           Reprogramar
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
