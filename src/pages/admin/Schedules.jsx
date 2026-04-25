import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit2, 
  Power,
  X,
  Save,
  AlertTriangle,
  Filter
} from 'lucide-react'
import { CardSkeleton, EmptyState, Toast } from '../../components/UIUtilities'
import api from '../../services/api'

export default function Schedules() {
  const [loading, setLoading] = useState(true)
  const [schedules, setSchedules] = useState([])
  const [branches, setBranches] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [toast, setToast] = useState(null)
  
  const [filters, setFilters] = useState({
    branch: 'Todas',
    date: ''
  })

  // Form State
  const [formData, setFormData] = useState({
    branch: 'Sede Salomia',
    date: '',
    startTime: '',
    endTime: '',
    maxCapacity: 20
  })

  const fetchData = async () => {
    try {
      const [horariosRes, sedesRes] = await Promise.all([
        api.get('/horarios'),
        api.get('/sedes')
      ])
      const mappedHorarios = horariosRes.data.data.map(h => ({
        id: h._id,
        branch: h.sede_id?.nombre || 'Desconocida',
        sede_id: h.sede_id?._id,
        date: new Date(h.fecha).toISOString().split('T')[0],
        startTime: h.hora_inicio,
        endTime: h.hora_fin,
        maxCapacity: h.capacidad_maxima,
        booked: h.capacidad_maxima - h.cupos_disponibles,
        status: h.activo ? 'active' : 'inactive'
      }))
      setSchedules(mappedHorarios)
      setBranches(sedesRes.data.data)
    } catch (error) {
      console.error(error)
      setToast({ message: 'Error cargando horarios', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredSchedules = schedules.filter(s => {
    const matchesBranch = filters.branch === 'Todas' || s.branch === filters.branch
    const matchesDate = !filters.date || s.date === filters.date
    return matchesBranch && matchesDate
  })

  const openModal = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule)
      setFormData({ ...schedule })
    } else {
      setEditingSchedule(null)
      const today = new Date().toISOString().split('T')[0]
      setFormData({ branch: 'Sede Salomia', date: today, startTime: '08:00', endTime: '10:00', maxCapacity: 20 })
    }
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (scheduleId) => {
    try {
      await api.delete(`/horarios/${scheduleId}`)
      setToast({ message: 'Horario desactivado', type: 'info' })
      fetchData()
    } catch (error) {
      console.error(error)
      setToast({ message: 'Error al actualizar', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        sede_id: branches.find(b => b.nombre === formData.branch)?._id,
        fecha: formData.date,
        hora_inicio: formData.startTime,
        hora_fin: formData.endTime,
        capacidad_maxima: formData.maxCapacity
      }
      
      if (editingSchedule) {
        await api.put(`/horarios/${editingSchedule.id}`, payload)
        setToast({ message: 'Horario actualizado con éxito', type: 'success' })
      } else {
        await api.post('/horarios', payload)
        setToast({ message: 'Nuevo horario creado correctamente', type: 'success' })
      }
      fetchData()
      setIsModalOpen(false)
    } catch (error) {
       console.error(error)
       setToast({ message: 'Error al procesar el horario', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  const getCapacityBadge = (booked, max) => {
    const percent = (booked / max) * 100
    if (percent === 100) return 'bg-red-100 text-red-700 border-red-200'
    if (percent >= 80) return 'bg-dorado-100 text-dorado-700 border-dorado-200'
    return 'bg-verde-100 text-verde-700 border-verde-200'
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gris-900 tracking-tight">Gestión de Horarios</h2>
          <p className="text-gris-500 font-medium mt-1">Configura disponibilidad diaria para cursos viales.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary shadow-lg shadow-verde-500/20">
          <Plus size={20} /> Nuevo Horario
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card-glass bg-white p-6 border border-gris-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-400" size={18} />
          <select 
            className="input-premium pl-10 h-12 text-sm appearance-none"
            value={filters.branch}
            onChange={(e) => setFilters({...filters, branch: e.target.value})}
          >
            <option>Todas las sedes</option>
            {branches.map(b => <option key={b._id} value={b.nombre}>{b.nombre}</option>)}
          </select>
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-400" size={18} />
          <input 
            type="date" 
            className="input-premium pl-10 h-12 text-sm"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
          />
        </div>
        <button 
           className="btn-outline h-12"
           onClick={() => setFilters({ branch: 'Todas', date: '' })}
        >
            Restablecer Filtros
        </button>
      </div>

      {/* Grid of Schedules */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
        ) : filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule, i) => (
            <motion.div 
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-glass bg-white border border-gris-200 p-6 hover-elevate group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-verde-50 flex items-center justify-center text-verde-600 shadow-inner group-hover:bg-verde-600 group-hover:text-white transition-all duration-500">
                    <Clock size={28} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gris-900 leading-tight">{schedule.branch}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gris-500 font-bold mt-1 uppercase tracking-tight">
                      <Calendar size={12} className="text-verde-500" /> {schedule.date}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-sm ${
                  schedule.status === 'active' ? 'bg-verde-50 text-verde-600 border-verde-100' : 'bg-red-50 text-red-500 border-red-100'
                }`}>
                  {schedule.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="space-y-5 font-sans">
                <div className="flex items-center justify-between p-4 bg-gris-50 rounded-2xl border border-gris-100 shadow-inner">
                  <span className="text-xs font-bold text-gris-500 uppercase tracking-widest">Franja Horaria</span>
                  <span className="text-sm font-extrabold text-gris-900 bg-white px-3 py-1.5 rounded-xl border border-gris-200">{schedule.startTime} - {schedule.endTime}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-extrabold text-gris-600 uppercase tracking-widest">
                    <span>Ocupación Actual</span>
                    <span>{schedule.booked} / {schedule.maxCapacity} cupos</span>
                  </div>
                  <div className="h-3 bg-gris-100 rounded-full overflow-hidden p-0.5 border border-gris-200 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(schedule.booked / schedule.maxCapacity) * 100}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className={`h-full rounded-full shadow-lg ${
                          (schedule.booked / schedule.maxCapacity) >= 1 ? 'bg-red-500 shadow-red-500/20' : 
                          (schedule.booked / schedule.maxCapacity) >= 0.8 ? 'bg-dorado-500 shadow-dorado-500/20' : 'bg-verde-500 shadow-verde-500/20'
                      }`}
                    />
                  </div>
                  <div className={`text-[10px] font-extrabold text-center py-1.5 rounded-xl border shadow-sm uppercase tracking-[0.1em] ${getCapacityBadge(schedule.booked, schedule.maxCapacity)} transition-colors duration-500`}>
                      {schedule.booked === schedule.maxCapacity ? 'Capacidad Agotada' : 
                       schedule.booked >= schedule.maxCapacity * 0.8 ? 'Casi lleno - Pocos cupos' : '✓ Cupos Disponibles'}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => openModal(schedule)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gris-50 text-xs font-extrabold text-gris-700 hover:bg-gris-100 transition-all border border-gris-200 hover:border-gris-300 shadow-sm"
                >
                  <Edit2 size={16} /> Editar Turno
                </button>
                <button 
                  onClick={() => handleToggleStatus(schedule.id)}
                  className={`w-14 flex items-center justify-center rounded-2xl border transition-all shadow-sm ${
                    schedule.status === 'active' 
                    ? 'border-red-100 text-red-500 bg-red-50/50 hover:bg-red-50' 
                    : 'border-verde-200 text-verde-600 bg-verde-50/50 hover:bg-verde-50'
                  }`}
                  title={schedule.status === 'active' ? 'Desactivar' : 'Activar'}
                >
                  <Power size={20} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full"><EmptyState title="No hay horarios disponibles" message="No se encontraron turnos para los filtros seleccionados." /></div>
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gris-900/60 backdrop-blur-md" 
               onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-3xl overflow-hidden border border-white/20"
            >
              <div className="bg-cali-gradient p-8 text-white relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/60 hover:text-white hover:rotate-90 transition-all duration-300">
                  <X size={26} />
                </button>
                <h3 className="text-3xl font-display font-bold tracking-tight">
                  {editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}
                </h3>
                <p className="text-white/70 font-medium mt-1">Configuración técnica del turno para ciudadanos.</p>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Sede de atención</label>
                  <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-600" size={20} />
                      <select 
                        className="input-premium pl-12 h-14 bg-gris-50 border-gris-200"
                        value={formData.branch}
                        onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      >
                        {branches.map(b => <option key={b._id} value={b.nombre}>{b.nombre}</option>)}
                      </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Fecha del turno</label>
                  <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-600" size={20} />
                      <input 
                        type="date" 
                        className="input-premium pl-12 h-14 bg-gris-50 border-gris-200"
                        value={formData.date}
                        required
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Inicio</label>
                      <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" size={18} />
                          <input 
                            type="time" 
                            className="input-premium pl-12 h-14 bg-gris-50 border-gris-200 text-sm font-bold"
                            value={formData.startTime}
                            required
                            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Fin</label>
                      <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" size={18} />
                          <input 
                            type="time" 
                            className="input-premium pl-12 h-14 bg-gris-50 border-gris-200 text-sm font-bold"
                            value={formData.endTime}
                            required
                            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          />
                      </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Capacidad (Cupos)</label>
                  <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-600" size={20} />
                      <input 
                        type="number" 
                        className="input-premium pl-12 h-14 bg-gris-50 border-gris-200 font-bold"
                        min="1"
                        value={formData.maxCapacity}
                        required
                        onChange={(e) => setFormData({...formData, maxCapacity: parseInt(e.target.value)})}
                      />
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-dorado-50 rounded-2xl border border-dorado-100 mt-3">
                      <AlertTriangle size={14} className="text-dorado-600 shrink-0" />
                      <p className="text-[10px] font-bold text-dorado-700 leading-tight">La capacidad afecta directamente la visibilidad en el portal ciudadano.</p>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl border border-gris-200 font-extrabold text-gris-600 hover:bg-gris-50 transition-all text-sm"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary py-4 text-sm shadow-xl shadow-verde-500/20"
                  >
                    <Save size={18} /> {editingSchedule ? 'Guardar Cambios' : 'Activar Horario'}
                  </button>
                </div>
              </form>
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
