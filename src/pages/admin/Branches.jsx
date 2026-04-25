import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  MapPin, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Building2,
  X,
  Save,
  Phone,
  Clock,
  ArrowRight
} from 'lucide-react'
import { CardSkeleton, Toast } from '../../components/UIUtilities'
import api from '../../services/api'

export default function Branches() {
  const [loading, setLoading] = useState(true)
  const [branches, setBranches] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)
  const [toast, setToast] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    schedule: 'Lun - Vie: 8:00 AM - 5:00 PM'
  })

  const fetchBranches = async () => {
    try {
      const res = await api.get('/sedes')
      const mapped = res.data.data.map(s => ({
        id: s._id,
        name: s.nombre,
        address: s.direccion,
        phone: '(602) 000 0000',
        schedule: 'Lun - Vie: 8:00 AM - 5:00 PM',
        status: s.activa ? 'active' : 'inactive',
        original: s
      }))
      setBranches(mapped)
    } catch (error) {
      console.error(error)
      setToast({ message: 'Error cargando sedes', type: 'error' })
    } finally { setLoading(false) }
  }

  useEffect(() => {
    fetchBranches()
  }, [])

  const openModal = (branch = null) => {
    if (branch) {
      setEditingBranch(branch)
      setFormData({ ...branch })
    } else {
      setEditingBranch(null)
      setFormData({ name: '', address: '', phone: '', schedule: 'Lun - Vie: 8:00 AM - 5:00 PM' })
    }
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (branch) => {
    try {
      await api.put(`/sedes/${branch.id}`, { activa: branch.status !== 'active' })
      setToast({ message: 'Estado de la sede actualizado', type: 'info' })
      fetchBranches() // Reload from DB
    } catch (error) {
      console.error(error)
      setToast({ message: 'Error al cambiar estado', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        nombre: formData.name,
        direccion: formData.address,
        activa: true
      }
      if (editingBranch) {
        await api.put(`/sedes/${editingBranch.id}`, payload)
        setToast({ message: 'Sede actualizada correctamente', type: 'success' })
      } else {
        await api.post('/sedes', payload)
        setToast({ message: 'Nueva sede registrada con éxito', type: 'success' })
      }
      fetchBranches()
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      setToast({ message: 'Error al procesar la sede', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gris-900 tracking-tight">Gestión de Sedes</h2>
          <p className="text-gris-500 font-medium mt-1">Administra los puntos de atención física de la Secretaría.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary shadow-lg shadow-verde-500/20">
          <Plus size={20} /> Nueva Sede
        </button>
      </div>

      {/* Grid of Branches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            {branches.map((branch, i) => (
              <motion.div 
                key={branch.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="card-glass bg-white border border-gris-200 overflow-hidden group hover-elevate transition-all duration-500 relative flex flex-col h-full"
              >
                {/* Status Strip */}
                <div className={`h-2 w-full ${branch.status === 'active' ? 'bg-verde-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-gris-300'}`} />
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 rounded-[2rem] bg-gris-50 text-gris-600 group-hover:bg-cali-gradient group-hover:text-white transition-all duration-500 shadow-inner ring-1 ring-gris-100">
                      <Building2 size={32} />
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 border shadow-sm ${
                      branch.status === 'active' 
                      ? 'bg-verde-50 text-verde-700 border-verde-200' 
                      : 'bg-gris-50 text-gris-500 border-gris-200'
                    }`}>
                      {branch.status === 'active' ? (
                        <><div className="w-1.5 h-1.5 rounded-full bg-verde-500 animate-pulse" /> Operacional</>
                      ) : (
                        <><XCircle size={12} /> Fuera de Servicio</>
                      )}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-extrabold text-gris-900 mb-3 group-hover:text-verde-700 transition-colors uppercase tracking-tight">{branch.name}</h3>
                  
                  <div className="space-y-4 font-sans flex-1">
                    <div className="flex items-start gap-3 text-gris-600">
                      <div className="mt-1 p-1 bg-verde-50 rounded-lg text-verde-600"><MapPin size={16} /></div>
                      <span className="text-sm font-bold leading-tight">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gris-500">
                       <div className="p-1 bg-gris-100 rounded-lg text-gris-500"><Phone size={16} /></div>
                      <span className="text-sm font-medium">{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gris-500">
                       <div className="p-1 bg-gris-100 rounded-lg text-gris-500"><Clock size={16} /></div>
                      <span className="text-sm italic font-medium">{branch.schedule}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gris-100 flex gap-3">
                    <button 
                      onClick={() => openModal(branch)}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gris-50 text-xs font-extrabold text-gris-700 hover:bg-white border border-gris-200 hover:border-gris-300 shadow-sm transition-all"
                    >
                      <Edit3 size={16} /> Configurar
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(branch)}
                      className={`px-4 py-3.5 rounded-2xl border font-extrabold text-xs transition-all duration-300 shadow-sm ${
                        branch.status === 'active'
                        ? 'border-red-100 text-red-500 bg-red-50/20 hover:bg-red-50'
                        : 'border-verde-200 text-verde-600 bg-verde-50/20 hover:bg-verde-50'
                      }`}
                    >
                      {branch.status === 'active' ? 'Off' : 'On'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Quick Add Card */}
            <motion.button 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: branches.length * 0.05 }}
              onClick={() => openModal()}
              className="border-[3px] border-dashed border-gris-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 text-gris-300 hover:border-verde-400 hover:text-verde-600 hover:bg-verde-50/20 transition-all group min-h-[300px]"
            >
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-gris-200 flex items-center justify-center group-hover:border-verde-400 group-hover:scale-110 transition-all duration-500 group-hover:rotate-90">
                 <Plus size={40} />
              </div>
              <span className="font-extrabold text-xl font-display tracking-tight">Nueva Sede</span>
            </motion.button>
          </>
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gris-900/40 backdrop-blur-md" 
               onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-3xl overflow-hidden border border-white/20"
            >
              <div className="bg-cali-gradient p-8 text-white">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-all">
                  <X size={28} />
                </button>
                <h3 className="text-3xl font-display font-bold">
                  {editingBranch ? 'Actualizar Sede' : 'Abrir Nueva Sede'}
                </h3>
                <p className="text-white/70 font-medium mt-1">Define los parámetros de atención al público.</p>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Nombre Comercial</label>
                  <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-600" size={20} />
                      <input 
                        type="text" 
                        className="input-premium pl-12 h-14 bg-gris-50 border-gris-200"
                        placeholder="Ej: Sede Valle del Lili"
                        value={formData.name}
                        required
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Ubicación Física</label>
                  <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-600" size={20} />
                      <input 
                        type="text" 
                        className="input-premium pl-12 h-14 bg-gris-50 border-gris-200"
                        placeholder="Calle 00 # 00 - 00"
                        value={formData.address}
                        required
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Contacto</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" size={18} />
                        <input 
                          type="text" 
                          className="input-premium pl-12 h-14 bg-gris-50 border-gris-200 text-sm"
                          placeholder="(602) 000 0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Horario</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" size={18} />
                        <input 
                          type="text" 
                          className="input-premium pl-12 h-14 bg-gris-50 border-gris-200 text-sm"
                          placeholder="Lun - Vie 8-5"
                          value={formData.schedule}
                          onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                        />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl border border-gris-200 font-extrabold text-gris-600 hover:bg-gris-50 transition-all text-sm"
                  >
                    Cerrar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary py-4 text-sm shadow-xl shadow-verde-500/30"
                  >
                    <Save size={18} /> {editingBranch ? 'Guardar Cambios' : 'Registrar Sede'}
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
