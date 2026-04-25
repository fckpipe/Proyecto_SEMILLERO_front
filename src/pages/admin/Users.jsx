import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, User, Mail, Shield, ShieldCheck, X, Save, Key, Edit3, MapPin, Building2, Trash2 } from 'lucide-react'
import { CardSkeleton, Toast } from '../../components/UIUtilities'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function Users() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [sedes, setSedes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [toast, setToast] = useState(null)
  const { user: currentUser } = useAuth()
  
  // Form State
  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    email: '',
    rol: 'admin_sede',
    sede_id: '',
    password: ''
  })

  const fetchData = async () => {
    try {
      const [usersRes, sedesRes] = await Promise.all([
        api.get('/admin/usuarios'),
        api.get('/sedes')
      ])
      
      const mappedSedes = sedesRes.data.data.filter(s => s.activa)
      setSedes(mappedSedes)
      
      if(mappedSedes.length > 0 && !formData.sede_id) {
          setFormData(prev => ({...prev, sede_id: mappedSedes[0]._id}))
      }
      
      setUsers(usersRes.data.data)
    } catch (error) {
      console.error(error)
      setToast({ message: 'Error cargando datos', type: 'error' })
    } finally { setLoading(false) }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openModal = (userToEdit = null) => {
    if (userToEdit) {
      setEditingUser(userToEdit)
      setFormData({ 
        username: userToEdit.username,
        nombre: userToEdit.nombre,
        email: userToEdit.email,
        rol: userToEdit.rol,
        sede_id: userToEdit.sede_id?._id || '',
        password: '' // Solo se envía si se quiere cambiar
      })
    } else {
      setEditingUser(null)
      setFormData({ 
        username: '', 
        nombre: '', 
        email: '', 
        rol: 'admin_sede', 
        sede_id: sedes.length > 0 ? sedes[0]._id : '',
        password: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (userToToggle) => {
    // Si intenta desactivarse a sí mismo
    if (userToToggle._id === currentUser.id) {
        setToast({ message: 'No puedes cambiar tu propio estado', type: 'error' })
        return;
    }

    try {
      await api.patch(`/admin/usuarios/${userToToggle._id}/status`)
      setToast({ message: 'Estado del usuario actualizado', type: 'info' })
      fetchData() // Reload from DB
    } catch (error) {
      console.error(error)
      setToast({ message: 'Error al cambiar estado', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData }
      // Si el rol es super_admin, no enviamos sede_id
      if (payload.rol === 'super_admin') {
          delete payload.sede_id;
      }
      // Al editar, si la password está vacía, no la enviamos para no resetearla en el backend
      if (editingUser && !payload.password) {
          delete payload.password;
      }

      if (editingUser) {
        await api.put(`/admin/usuarios/${editingUser._id}`, payload)
        setToast({ message: 'Usuario actualizado correctamente', type: 'success' })
      } else {
        if(!payload.password) {
            setToast({ message: 'La contraseña es obligatoria para nuevos usuarios', type: 'error' })
            setTimeout(() => setToast(null), 3000)
            return;
        }
        await api.post('/admin/usuarios', payload)
        setToast({ message: 'Nuevo usuario registrado con éxito', type: 'success' })
      }
      fetchData()
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      setToast({ message: error.response?.data?.message || 'Error al procesar el usuario', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gris-900 tracking-tight">Gestión de Administradores</h2>
          <p className="text-gris-500 font-medium mt-1">Controla los accesos de los Super Administradores y Administradores de Sede.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary shadow-lg shadow-verde-500/20">
          <Plus size={20} /> Nuevo Admin
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="card-glass border border-gris-200 overflow-hidden bg-white">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gris-50/50 text-gris-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gris-100">
                  <th className="p-6">Usuario & Email</th>
                  <th className="p-6">Rol y Sede</th>
                  <th className="p-6">Estado</th>
                  <th className="p-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gris-100">
                {loading ? (
                    <tr>
                        <td colSpan="4" className="p-6"><CardSkeleton /></td>
                    </tr>
                ) : users.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="p-20 text-center text-gris-400 font-bold">No hay usuarios registrados.</td>
                    </tr>
                ) : (
                    users.map(u => (
                    <tr key={u._id} className="hover:bg-gris-50 transition-colors group">
                        <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-cali-gradient flex items-center justify-center font-display font-bold text-white shadow-inner flex-shrink-0">
                                    {u.nombre.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gris-900">{u.nombre}</p>
                                    <p className="text-[10px] text-gris-500 font-bold mt-1 uppercase tracking-wider">{u.email}</p>
                                    <p className="text-xs text-gris-400 font-medium">@{u.username}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-6">
                            <div className="flex flex-col gap-2">
                                <span className={`inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    u.rol === 'super_admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                    <ShieldCheck size={12} /> {u.rol.replace('_', ' ')}
                                </span>
                                {u.sede_id && (
                                    <span className="text-xs font-bold text-gris-600 flex items-center gap-1.5">
                                        <Building2 size={12} className="text-verde-600" /> {u.sede_id.nombre}
                                    </span>
                                )}
                            </div>
                        </td>
                        <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex w-fit items-center gap-1.5 shadow-sm ${
                                u.activo ? 'bg-verde-50 text-verde-700 border border-verde-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${u.activo ? 'bg-verde-500 animate-pulse' : 'bg-red-500'}`} />
                                {u.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex items-center justify-end gap-2">
                               <button onClick={() => openModal(u)} className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors tooltip" data-tip="Editar">
                                   <Edit3 size={18} />
                               </button>
                               <button 
                                   onClick={() => handleToggleStatus(u)} 
                                   disabled={u._id === currentUser.id}
                                   className={`p-2 rounded-xl transition-colors ${
                                       u._id === currentUser.id ? 'opacity-50 cursor-not-allowed text-gris-400' : 
                                       u.activo ? 'text-red-500 hover:bg-red-50' : 'text-verde-600 hover:bg-verde-50'
                                   }`}
                               >
                                   <Trash2 size={18} />
                               </button>
                           </div>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
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
               className="bg-white rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-3xl overflow-hidden border border-white/20"
            >
              <div className="bg-cali-gradient p-8 text-white relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-all">
                  <X size={28} />
                </button>
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"><Shield size={24} /></div>
                    <h3 className="text-3xl font-display font-bold">
                        {editingUser ? 'Editar Administrador' : 'Nuevo Administrador'}
                    </h3>
                </div>
                <p className="text-white/80 font-medium ml-16 text-sm">Gestiona los permisos y asignaciones del usuario dentro del panel.</p>
              </div>

              <form onSubmit={handleSave} className="p-8 pb-10 h-[60vh] md:h-auto overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-600" size={20} />
                            <input type="text" className="input-premium pl-12 h-14 bg-gris-50 border-gris-200"
                                placeholder="Ej: Juan Pérez" value={formData.nombre} required
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-600" size={20} />
                            <input type="email" className="input-premium pl-12 h-14 bg-gris-50 border-gris-200"
                                placeholder="email@secretaria.gov.co" value={formData.email} required
                                onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Nombre de Usuario</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400 font-bold">@</span>
                            <input type="text" className="input-premium pl-12 h-14 bg-gris-50 border-gris-200"
                                placeholder="Ej: juan.perez" value={formData.username} required disabled={!!editingUser}
                                onChange={(e) => setFormData({...formData, username: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">
                            Contraseña {editingUser && '(Opcional)'}
                        </label>
                        <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-600" size={20} />
                            <input type="password" className="input-premium pl-12 h-14 bg-gris-50 border-gris-200"
                                placeholder={editingUser ? "Solo si desea cambiarla" : "Mínimo 8 caracteres"} 
                                value={formData.password} required={!editingUser}
                                onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="bg-gris-50 p-6 rounded-[2rem] border border-gris-100 mb-8 mt-2 space-y-6">
                     <div className="space-y-2 text-left">
                        <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1">Rol en el Sistema</label>
                        <div className="flex bg-white rounded-2xl p-1.5 border border-gris-200 shadow-sm relative z-0">
                            <div className={`absolute inset-y-1.5 left-1.5 right-1/2 bg-verde-50 rounded-xl transition-all duration-300 z-[-1] border border-verde-200 ${formData.rol === 'super_admin' ? 'translate-x-[calc(100%-12px)] bg-purple-50 border-purple-200' : ''}`} />
                            
                            <button type="button" onClick={() => setFormData({...formData, rol: 'admin_sede'})} 
                               className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-colors ${formData.rol === 'admin_sede' ? 'text-verde-700' : 'text-gris-500 hover:text-gris-800'}`}>
                               Admin Sede
                            </button>
                            <button type="button" onClick={() => setFormData({...formData, rol: 'super_admin'})} 
                               className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-colors ${formData.rol === 'super_admin' ? 'text-purple-700' : 'text-gris-500 hover:text-gris-800'}`}>
                               Super Admin
                            </button>
                        </div>
                    </div>
                    
                    <AnimatePresence>
                        {formData.rol === 'admin_sede' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 text-left overflow-hidden">
                                <label className="text-[10px] font-extrabold text-gris-400 uppercase tracking-widest pl-1 mt-4 block">Sede Asignada</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" size={20} />
                                    <select className="input-premium pl-12 h-14 bg-white border-gris-200 appearance-none font-bold text-gris-700 w-full"
                                        value={formData.sede_id} onChange={(e) => setFormData({...formData, sede_id: e.target.value})}>
                                        {sedes.map(s => <option key={s._id} value={s._id}>{s.nombre} - {s.direccion}</option>)}
                                    </select>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="w-1/3 py-4 rounded-2xl border border-gris-200 font-extrabold text-gris-600 hover:bg-gris-50 transition-all text-sm">
                    Cancelar
                  </button>
                  <button type="submit" className="w-2/3 btn-primary py-4 text-sm shadow-xl shadow-verde-500/30">
                    <Save size={18} /> {editingUser ? 'Guardar Cambios' : 'Registrar Administrador'}
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
