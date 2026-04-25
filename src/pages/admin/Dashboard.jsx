import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarCheck, Users as UsersIcon, Ban, CheckCircle, ArrowRight, ShieldAlert, Unlock, MonitorPlay, Award, MessageSquareWarning, Laptop, FileWarning, Clock, Building2, TrendingUp, MoreVertical, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import { TableSkeleton } from '../../components/UIUtilities'
import { useCourse } from '../../contexts/CourseContext'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const { user } = useAuth()
  const { examBlocked, unblockExam } = useCourse()

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard')
        setData(res.data.data)
      } catch (err) {
        console.error('Error fetching dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-6"><TableSkeleton rows={1} /></div>
      <TableSkeleton rows={10} />
    </div>
  )

  if (!data) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShieldAlert size={48} className="text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-gris-900">Error de Conexión</h3>
      <p className="text-gris-500">No se pudieron cargar los datos del panel. Verifica el servidor.</p>
    </div>
  )

  const { metricas, citasPorCanal, citasPorSede, comparativaSemanal, proximasCitasHoy, actividadReciente } = data;

  // --- STATS CONFIG ---
  const stats = [
    { 
      label: 'Matrículas del Mes', 
      value: metricas.totalCitasMes, 
      icon: CalendarCheck, 
      color: 'bg-verde-500', 
      trend: user?.rol === 'super_admin' ? 'Global' : 'Tu Sede' 
    },
    { 
      label: 'Cursos Completados', 
      value: metricas?.cursosCompletados || 0, 
      icon: Award, 
      color: 'bg-blue-500', 
      trend: `${metricas?.tasaAprobacion || 0}% Éxito` 
    },
    { 
      label: 'PQR Recibidas', 
      value: metricas?.pqrRecibidas || 0, 
      icon: MessageSquareWarning, 
      color: 'bg-orange-500', 
      trend: `${metricas?.pqrResueltas || 0} Resueltas` 
    },
    { 
      label: 'Cursos en Curso', 
      value: metricas?.cursosEnProgreso || 0, 
      icon: MonitorPlay, 
      color: 'bg-teal-500', 
      trend: 'Activos hoy' 
    },
  ]

  // --- CHART DATA ---
  const channelsData = [
    { name: 'Chatbot (IA)', value: citasPorCanal.chatbot || 0, color: '#22c55e' },
    { name: 'Email / Web', value: citasPorCanal.email || 0, color: '#3b82f6' },
  ]

  const statusData = [
    { name: 'Confirmadas', value: metricas.citasConfirmadas, color: '#22c55e' },
    { name: 'Completadas', value: metricas.citasCompletadas, color: '#3b82f6' },
    { name: 'Inactivas', value: metricas.citasNoAsistio, color: '#f59e0b' },
    { name: 'Canceladas', value: metricas.citasCanceladas, color: '#ef4444' }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Informativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-gris-900 tracking-tight">
            Hola, {user?.nombre?.split(' ')[0]} 👋
          </h2>
          <p className="text-gris-500 font-medium mt-1">
            {user?.rol === 'super_admin' 
              ? 'Vista global de todas las sedes y estadísticas del sistema.' 
              : `Gestionando la sede ${user?.sede?.nombre || 'asignada'}.`}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gris-200">
           <div className="bg-verde-50 text-verde-600 p-2 rounded-xl">
             <Clock size={18} />
           </div>
           <div className="pr-4">
             <p className="text-[10px] font-bold text-gris-400 uppercase tracking-widest">Último Cierre</p>
             <p className="text-sm font-black text-gris-800">Hoy, 8:00 AM</p>
           </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-glass p-6 group hover-elevate relative overflow-hidden bg-white border border-gris-200"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 rounded-bl-[4rem] -mr-6 -mt-6 transition-transform group-hover:scale-125`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg shadow-current/20`}>
                <stat.icon size={22} />
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-gris-100 text-gris-600 uppercase tracking-widest">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gris-500 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-display font-black text-gris-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* --- GRÁFICOS --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 card-glass p-8 bg-white border border-gris-200 flex flex-col min-h-[450px]">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-display font-black text-gris-900 flex items-center gap-3">
                 <TrendingUp size={24} className="text-verde-500"/> Estado de Trámites Digitales
               </h3>
               <div className="text-[10px] font-black text-gris-400 uppercase tracking-widest bg-gris-50 px-4 py-2 rounded-xl border border-gris-200">
                  Distribución Real
               </div>
            </div>
            
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} />
                  <RechartsTooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" name="Total Citas" radius={[10, 10, 0, 0]} maxBarSize={60}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Canales de Atención (Donut) */}
         <div className="card-glass p-8 bg-white border border-gris-200 flex flex-col h-full items-center justify-center">
            <h3 className="text-xl font-display font-black text-gris-900 mb-2 self-start">Canales de Origen</h3>
            <p className="text-xs text-gris-500 font-medium mb-8 self-start">¿Desde dónde agendan los ciudadanos?</p>
            
            <div className="relative w-full aspect-square max-w-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelsData}
                    innerRadius="70%"
                    outerRadius="90%"
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {channelsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-10px]">
                 <span className="text-5xl font-display font-black text-gris-900">{metricas?.totalCitasMes || 0}</span>
                 <span className="text-[10px] font-black text-gris-400 uppercase tracking-widest">Total Trámites</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-4 w-full">
              {channelsData.map(ch => (
                <div key={ch.name} className="flex items-center justify-between p-3 rounded-2xl bg-gris-50 border border-gris-100">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: ch.color}} />
                      <span className="font-bold text-gris-700 text-sm">{ch.name}</span>
                   </div>
                   <span className="font-black text-gris-900">{ch.value}</span>
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* --- TABLA Y LOGS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-glass bg-white border border-gris-200 overflow-hidden min-h-[450px] flex flex-col">
          <div className="p-8 border-b border-gris-100 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-lg font-display font-black text-gris-900">Gestión de Turnos Virtuales</h3>
              <p className="text-xs text-gris-400 font-bold uppercase tracking-wider mt-1">Trámites digitales en {user?.sede?.nombre || 'Cali'}</p>
            </div>
            <Link to="/citas" className="btn-primary py-3 px-6 text-xs shadow-lg shadow-verde-500/10">
              Gestión de Turnos <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gris-50/50 text-gris-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gris-100">
                  <th className="p-6">Ciudadano</th>
                  <th className="p-6 text-center">Horario Programado</th>
                  <th className="p-6">Prioridad / Canal</th>
                  <th className="p-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gris-100">
                {proximasCitasHoy.length > 0 ? proximasCitasHoy.map((cita) => (
                  <tr key={cita.codigo} className="hover:bg-gris-50 transition-colors group">
                    <td className="p-6">
                      <div className="font-black text-gris-900 text-sm">{cita.ciudadano}</div>
                      <div className="text-[10px] text-gris-400 font-bold mt-1">CC: {cita.cedula}</div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex flex-col bg-gris-50 p-2 rounded-xl group-hover:bg-white border border-transparent group-hover:border-gris-200 transition-all">
                        <span className="text-xs font-black text-gris-800">Pronto</span>
                        <span className="text-[10px] font-bold text-verde-600">{cita.hora} AM</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        cita.canal === 'chatbot' ? 'bg-verde-50 text-verde-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                         {cita.canal === 'chatbot' ? '🤖 IA Chatbot' : '💻 Web Portal'}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                       <button className="p-2.5 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gris-200 transition-all text-gris-400 hover:text-verde-600">
                          <MoreVertical size={18} />
                       </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-gris-400 font-bold">
                       No hay citas programadas recientemente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Logs (Simplificado) */}
        <div className="card-glass bg-gris-900 p-8 border border-white/5 flex flex-col">
            <h3 className="text-lg font-display font-black text-white flex items-center gap-3 mb-8">
              <Activity size={20} className="text-verde-400" /> Registro de Actividad
            </h3>
            
            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {actividadReciente.map((log, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-verde-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover:scale-125 transition-transform" />
                    {idx !== actividadReciente.length - 1 && <div className="w-[1px] h-full bg-white/10 my-1" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-xs text-white font-bold leading-tight uppercase tracking-wide">{log.tipo.replace('_', ' ')}</p>
                    <p className="text-[11px] text-white/50 mt-1 font-medium italic">"{log.descripcion}"</p>
                    <p className="text-[9px] text-verde-500/70 font-black mt-2 uppercase tracking-[0.1em]">
                      {new Date(log.fecha).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/logs" className="mt-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] hover:text-verde-400 text-center transition-colors">
               Ver historial completo
            </Link>
        </div>
      </div>
    </div>
  )
}
