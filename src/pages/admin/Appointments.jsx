import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Eye, 
  XCircle, 
  CheckCircle2, 
  ChevronRight,
  MoreVertical,
  Download,
  X,
  User,
  CreditCard,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react'
import { TableSkeleton, EmptyState, Toast } from '../../components/UIUtilities'
import api from '../../services/api'

export default function Appointments() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)
  const [toast, setToast] = useState(null)
  
  const [filters, setFilters] = useState({
    search: '',
    branch: 'Todas',
    channel: 'Todos',
    status: 'Todos',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citasRes, sedesRes] = await Promise.all([
          api.get('/citas'),
          api.get('/sedes')
        ])
        const mappedCitas = citasRes.data.data.map(c => ({
          original: c,
          id: c._id,
          code: c.codigo_cita,
          citizen: `${c.ciudadano_id?.nombre || ''} ${c.ciudadano_id?.apellido || ''}`,
          idCard: c.ciudadano_id?.cedula || 'N/A',
          summons: c.comparendo_id?.numero_comparendo || 'N/A',
          branch: c.horario_id?.sede_id?.nombre || 'Virtual',
          date: new Date(c.horario_id?.fecha || c.createdAt).toLocaleDateString(),
          time: c.horario_id ? `${c.horario_id.hora_inicio} - ${c.horario_id.hora_fin}` : 'N/A',
          channel: c.canal || 'Sistema',
          status: c.estado.replace('_', ' ')
        }))
        setAppointments(mappedCitas)
        setBranches(sedesRes.data.data)
      } catch (error) {
        console.error(error)
        setToast({ message: 'Error cargando información', type: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredAppointments = appointments.filter(app => {
    const searchLow = filters.search.toLowerCase()
    const matchesSearch = 
      (app.code || '').toLowerCase().includes(searchLow) ||
      (app.citizen || '').toLowerCase().includes(searchLow) ||
      (app.idCard || '').includes(searchLow) ||
      (app.summons || '').includes(searchLow)
    
    const matchesBranch = filters.branch === 'Todas' || app.branch === filters.branch
    const matchesChannel = filters.channel === 'Todos' || app.channel === filters.channel
    const matchesStatus = filters.status === 'Todos' || app.status === filters.status

    return matchesSearch && matchesBranch && matchesChannel && matchesStatus
  })

  const updateStatus = async (id, nuevoEstado, successMsj) => {
    try {
      await api.patch(`/citas/${id}/estado`, { estado: nuevoEstado })
      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status: nuevoEstado.replace('_', ' ') } : a
      ))
      setSelectedApp(null)
      setToast({ message: successMsj, type: 'success' })
    } catch (error) {
       console.error(error)
       setToast({ message: 'Error al actualizar', type: 'error' })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmada': return 'bg-verde-100 text-verde-700 border-verde-200'
      case 'Pendiente': return 'bg-dorado-100 text-dorado-700 border-dorado-200'
      case 'Cancelada': return 'bg-red-100 text-red-700 border-red-200'
      case 'Completada': return 'bg-gris-200 text-gris-700 border-gris-300'
      default: return 'bg-gris-100 text-gris-600'
    }
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gris-900 tracking-tight">Gestión de Citas</h2>
          <p className="text-gris-500 font-medium mt-1">Control y seguimiento de agendamientos para cursos viales.</p>
        </div>
        <button className="btn-primary" onClick={() => setToast({message: 'Reporte generado con éxito', type: 'success'})}>
          <Download size={20} /> Exportar Reporte
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card-glass bg-white p-6 border border-gris-200 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="relative xl:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por código, nombre, cédula..." 
            className="input-premium pl-10 h-12 text-sm"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-400" size={18} />
          <select 
            className="input-premium pl-10 h-12 text-sm appearance-none"
            value={filters.branch}
            onChange={(e) => setFilters({...filters, branch: e.target.value})}
          >
            <option>Todas</option>
            {branches.map(b => <option key={b._id} value={b.nombre}>{b.nombre}</option>)}
          </select>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-400" size={18} />
          <select 
            className="input-premium pl-10 h-12 text-sm appearance-none"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option>Todos</option>
            <option>Confirmada</option>
            <option>Pendiente</option>
            <option>Cancelada</option>
            <option>Completada</option>
          </select>
        </div>

        <div className="relative">
           <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-400" size={18} />
           <input type="date" className="input-premium pl-10 h-12 text-sm" />
        </div>

        <button className="btn-outline h-12 px-6 text-sm" onClick={() => setFilters({search: '', branch: 'Todas', channel: 'Todos', status: 'Todos', startDate: '', endDate: ''})}>
            Limpiar
        </button>
      </div>

      {/* Table Section */}
      <div className="card-glass bg-white border border-gris-200 overflow-hidden shadow-sm animate-fade-up">
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
             <div className="p-10 text-center"><TableSkeleton rows={8} /></div>
          ) : filteredAppointments.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gris-50/80 text-gris-500 font-sans text-[10px] uppercase tracking-[0.15em] border-b border-gris-200 font-extrabold group">
                  <th className="p-6">Código / Cédula</th>
                  <th className="p-6">Ciudadano</th>
                  <th className="p-6">Fecha y Hora</th>
                  <th className="p-6">Sede</th>
                  <th className="p-6">Canal</th>
                  <th className="p-6">Estado</th>
                  <th className="p-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gris-100 text-sm font-sans font-medium">
                {filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gris-50/60 transition-colors group cursor-pointer" onClick={() => setSelectedApp(app)}>
                    <td className="p-6">
                      <div className="font-bold text-verde-600 mb-1">{app.code}</div>
                      <div className="text-xs text-gris-400 flex items-center gap-1.5"><CreditCard size={12} /> {app.idCard}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-gris-900 group-hover:text-verde-700 transition-colors">{app.citizen}</div>
                      <div className="text-xs text-gris-400 font-medium">Comparendo: {app.summons}</div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="font-bold text-gris-800">{app.date}</div>
                      <div className="text-xs text-gris-500 flex items-center gap-1 mt-1"><Clock size={12}/> {app.time}</div>
                    </td>
                    <td className="p-6">
                       <span className="text-gris-700 font-bold">{app.branch}</span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                        app.channel === 'Chatbot' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                        app.channel === 'Correo' ? 'bg-verde-50 text-verde-600 border border-verde-100' : 'bg-gris-100 text-gris-600'
                      }`}>
                         {app.channel === 'Chatbot' ? '🤖 Chatbot' : '📧 Correo'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-6 text-right opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                       <button className="p-2 rounded-xl text-gris-400 hover:text-gris-900 hover:bg-white border border-transparent hover:border-gris-200 transition-all">
                          <Eye size={20} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[60] flex items-center justify-end">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gris-900/40 backdrop-blur-sm" 
               onClick={() => setSelectedApp(null)} 
            />
            <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 30, stiffness: 300 }}
               className="w-full max-w-xl bg-white h-full relative z-10 shadow-2xl overflow-y-auto"
            >
                {/* Modal Header */}
                <div className="p-8 bg-cali-gradient text-white relative h-60 flex flex-col justify-end">
                    <button onClick={() => setSelectedApp(null)} className="absolute top-8 right-8 p-2 rounded-xl bg-white/20 hover:bg-white/40 transition-all text-white">
                        <X size={24} />
                    </button>
                    <div className="space-y-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border border-white/30 backdrop-blur-md ${getStatusColor(selectedApp.status)} bg-opacity-20`}>
                            {selectedApp.status}
                        </span>
                        <h3 className="text-3xl font-display font-bold">{selectedApp.citizen}</h3>
                        <p className="text-white/80 font-medium">ID de Cita: {selectedApp.code}</p>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-10 space-y-10">
                    <section>
                        <h4 className="text-xs font-bold text-gris-400 uppercase tracking-widest mb-6">Información del Ciudadano</h4>
                        <div className="grid grid-cols-2 gap-8 font-sans">
                            <div className="space-y-1.5">
                                <p className="text-xs font-bold text-gris-500 uppercase tracking-tighter">Nombre Completo</p>
                                <p className="font-bold text-gris-900">{selectedApp.citizen}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-xs font-bold text-gris-500 uppercase tracking-tighter">Cédula de Ciudadanía</p>
                                <p className="font-bold text-gris-900">{selectedApp.idCard}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-xs font-bold text-gris-500 uppercase tracking-tighter">N° Comparendo</p>
                                <p className="font-bold text-gris-900">{selectedApp.summons}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-xs font-bold text-gris-500 uppercase tracking-tighter">Canal de Registro</p>
                                <p className="font-bold text-verde-600">{selectedApp.channel}</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gris-50 p-6 rounded-3xl border border-gris-200">
                        <h4 className="text-xs font-bold text-gris-400 uppercase tracking-widest mb-6">Detalles del Agendamiento</h4>
                        <div className="space-y-6 font-sans">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-gris-200 flex items-center justify-center text-verde-600 shadow-sm">
                                    <Calendar size={20} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-gris-500 uppercase">Fecha Programada</p>
                                    <p className="font-bold text-gris-900">{selectedApp.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-gris-200 flex items-center justify-center text-blue-600 shadow-sm">
                                    <Clock size={20} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-gris-500 uppercase">Hora de Atención</p>
                                    <p className="font-bold text-gris-900">{selectedApp.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-gris-200 flex items-center justify-center text-dorado-600 shadow-sm">
                                    <MapPin size={20} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-gris-500 uppercase">Lugar de Atención</p>
                                    <p className="font-bold text-gris-900">{selectedApp.branch}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 flex flex-col gap-3">
                        <div className="flex gap-3">
                           <button className="flex-1 btn-primary py-4" onClick={() => updateStatus(selectedApp.id, 'completada', 'Asistencia marcada correctamente')}>
                                <CheckCircle2 size={20} /> Marcar Asistencia
                           </button>
                           <button className="flex-1 btn-outline border-red-200 text-red-600 hover:bg-red-50 py-4" onClick={() => updateStatus(selectedApp.id, 'cancelada', 'Cita cancelada')}>
                                <XCircle size={20} /> Cancelar Cita
                           </button>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gris-100 text-gris-600 hover:bg-gris-200 transition-all">
                           <Download size={18} /> Descargar Comprobante PDF
                        </button>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

    </div>
  )
}
