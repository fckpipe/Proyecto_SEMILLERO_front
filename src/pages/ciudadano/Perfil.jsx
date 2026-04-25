import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, Phone, CreditCard, Edit3, Check, X, Lock, Eye, EyeOff,
  Award, BookOpen, FileText, AlertCircle, CheckCircle, Clock, Download,
  ShieldCheck, TrendingUp, Layers, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

// ─── Estado badge ─────────────────────────────────────────────────────────────
const ESTADO_CURSO = {
  no_iniciado:  { label: 'Sin curso iniciado',  color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)' },
  en_progreso:  { label: 'Curso en progreso',   color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)'  },
  completado:   { label: 'Curso completado ✅',  color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.3)'  },
}
const ESTADO_COMPARENDO = {
  pendiente:        { label: 'Pendiente',           color: '#f87171', bg: 'rgba(248,113,113,0.1)',   border: 'rgba(248,113,113,0.25)' },
  curso_agendado:   { label: 'En progreso',         color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',    border: 'rgba(251,191,36,0.25)'  },
  curso_completado: { label: 'Descuento aplicado ✅', color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)'  },
}

const MODULOS = ['Normas Básicas', 'Señales de Tránsito', 'Seguridad Vial', 'Comportamiento Vial', 'Normativa Avanzada']

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

// ── Input helper ───────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, value, onChange, type = 'text', disabled, error, trailing }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</label>
      <div className="relative flex items-center">
        {Icon && <Icon size={14} className="absolute left-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className="w-full py-3 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none transition-all disabled:opacity-50"
          style={{
            paddingLeft: Icon ? '2.5rem' : '1rem',
            paddingRight: trailing ? '3rem' : '1rem',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'}`,
          }}
        />
        {trailing && <div className="absolute right-3">{trailing}</div>}
      </div>
      {error && <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>}
    </div>
  )
}

// ─── Edit modal ───────────────────────────────────────────────────────────────
function EditModal({ ciudadano, onClose, onSaved }) {
  const { login } = useAuth()
  const [form, setForm] = useState({
    nombre: ciudadano.nombre || '',
    apellido: ciudadano.apellido || '',
    email: ciudadano.email || '',
    telefono: ciudadano.telefono || '',
    placa_vehiculo: ciudadano.placa_vehiculo || '',
  })
  const [pass, setPass] = useState({ actual: '', nueva: '', confirmar: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const setP = (key, val) => setPass(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (pass.nueva && pass.nueva !== pass.confirmar) {
      setError('Las contraseñas nuevas no coinciden.')
      return
    }
    setLoading(true)
    try {
      const payload = { ...form }
      if (pass.nueva) { payload.password_actual = pass.actual; payload.password_nueva = pass.nueva }
      const res = await api.put('/auth/perfil', payload)
      // Actualizar token si cambió
      if (res.data.data?.token) {
        localStorage.setItem('token', res.data.data.token)
      }
      setSuccess(true)
      setTimeout(() => { onSaved(res.data.data?.usuario); onClose() }, 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar los cambios.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6"
        style={{ background: 'rgba(8,14,28,0.98)', border: '1px solid rgba(0,122,77,0.3)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-[2px] absolute top-0 left-0 right-0 rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, #003366, #007A4D)' }} />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white">Editar perfil</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" icon={User} value={form.nombre} onChange={v => set('nombre', v)} />
            <Field label="Apellido" icon={User} value={form.apellido} onChange={v => set('apellido', v)} />
          </div>
          <Field label="Email" icon={Mail} value={form.email} onChange={v => set('email', v)} type="email" />
          <Field label="Teléfono" icon={Phone} value={form.telefono} onChange={v => set('telefono', v)} />
          <Field label="Placa del Vehículo" icon={Layers} value={form.placa_vehiculo} onChange={v => set('placa_vehiculo', v.toUpperCase())} />

          {/* Contraseña */}
          <div className="pt-2">
            <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Cambiar contraseña (opcional)
            </p>
            <div className="space-y-3">
              <Field label="Contraseña actual" icon={Lock} value={pass.actual} onChange={v => setP('actual', v)}
                type={showPass ? 'text' : 'password'}
                trailing={<button type="button" onClick={() => setShowPass(!showPass)} style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>} />
              <Field label="Nueva contraseña" icon={Lock} value={pass.nueva} onChange={v => setP('nueva', v)}
                type={showPass ? 'text' : 'password'} />
              <Field label="Confirmar nueva contraseña" icon={Lock} value={pass.confirmar} onChange={v => setP('confirmar', v)}
                type={showPass ? 'text' : 'password'} />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
              <AlertCircle size={13} />{error}
            </div>
          )}

          <motion.button type="submit" disabled={loading || success}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-2xl text-sm font-black text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: success ? 'linear-gradient(135deg, #007A4D, #4ade80)' : 'linear-gradient(135deg, #003366, #007A4D)', boxShadow: '0 4px 20px rgba(0,122,77,0.3)' }}>
            {success ? <><Check size={16} />¡Guardado!</> : loading ? 'Guardando...' : 'Guardar cambios'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Perfil() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/auth/perfil')
        setData(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full animate-spin"
          style={{ border: '3px solid rgba(0,122,77,0.2)', borderTopColor: '#007A4D' }} />
        <p className="text-white/40 text-sm">Cargando tu perfil...</p>
      </div>
    </div>
  )

  if (!data) return (
    <div className="flex items-center justify-center min-h-[60vh] text-white/40">
      Error al cargar el perfil. Intenta de nuevo.
    </div>
  )

  const { ciudadano, estadisticas, comparendos, progreso, certificados } = data
  const estadoCursoInfo = ESTADO_CURSO[estadisticas.estado_curso] || ESTADO_CURSO.no_iniciado
  const initials = `${ciudadano.nombre?.[0] || ''}${ciudadano.apellido?.[0] || ''}`.toUpperCase()

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <EditModal ciudadano={ciudadano} onClose={() => setShowModal(false)}
            onSaved={(updated) => {
              if (updated) setData(prev => ({ ...prev, ciudadano: { ...prev.ciudadano, ...updated } }))
            }} />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ── SECTION 1: HEADER ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
          style={{ background: 'rgba(8,14,28,0.8)', border: '1px solid rgba(0,122,77,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, #003366, #007A4D, #003366)' }} />
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/3"
            style={{ background: 'radial-gradient(circle, #007A4D, transparent 70%)' }} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative">
            {/* Avatar */}
            <div className="shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-black text-white"
              style={{ background: 'linear-gradient(135deg, #003366, #007A4D)', boxShadow: '0 0 30px rgba(0,122,77,0.4)' }}>
              {initials}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-white leading-tight">
                {ciudadano.nombre} {ciudadano.apellido}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <span className="flex items-center gap-1.5"><CreditCard size={12} />C.C. {ciudadano.cedula}</span>
                {ciudadano.email && <span className="flex items-center gap-1.5"><Mail size={12} />{ciudadano.email}</span>}
                {ciudadano.placa_vehiculo && <span className="flex items-center gap-1.5 font-bold" style={{ color: '#60a5fa' }}><ChevronRight size={12} className="rotate-90"/>🚗 {ciudadano.placa_vehiculo}</span>}
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: estadoCursoInfo.bg, color: estadoCursoInfo.color, border: `1px solid ${estadoCursoInfo.border}` }}>
                  {estadoCursoInfo.label}
                </span>
              </div>
            </div>
            {/* Edit button */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all"
              style={{ background: 'rgba(0,122,77,0.15)', border: '1px solid rgba(0,122,77,0.35)', color: '#4ade80' }}>
              <Edit3 size={14} />Editar perfil
            </motion.button>
          </div>
        </motion.div>

        {/* ── SECTION 2: STATS CARDS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4">
          {[
            { label: 'Comparendos pendientes', value: estadisticas.comparendos_pendientes, icon: FileText, color: '#f87171', glow: 'rgba(248,113,113,0.2)' },
            { label: 'Módulos completados', value: `${estadisticas.modulos_completados} de ${estadisticas.total_modulos}`, icon: Layers, color: '#60a5fa', glow: 'rgba(96,165,250,0.2)' },
            { label: 'Certificados obtenidos', value: estadisticas.certificados_obtenidos, icon: Award, color: '#4ade80', glow: 'rgba(74,222,128,0.2)' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.07 }}
              className="rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden"
              style={{ background: 'rgba(8,14,28,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: stat.glow }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[11px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── SECTION 3: COMPARENDOS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: 'rgba(8,14,28,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <FileText size={16} style={{ color: '#60a5fa' }} />Mis Comparendos
            </h2>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{comparendos.length} registros</span>
          </div>
          {comparendos.length === 0 ? (
            <div className="px-6 py-10 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              No tienes comparendos registrados
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {comparendos.map((c, i) => {
                const est = ESTADO_COMPARENDO[c.estado] || ESTADO_COMPARENDO.pendiente
                return (
                  <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{c.numero}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: est.bg, color: est.color, border: `1px solid ${est.border}` }}>
                          {est.label}
                        </span>
                      </div>
                      <div className="text-xs mt-1 leading-snug flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        <span>{fmtDate(c.fecha)} · {c.tipo_infraccion}</span>
                        {c.fuente === 'simit_placa' && <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20">Vía Placa</span>}
                        {c.fuente === 'simit_id' && <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20">Vía ID</span>}
                        {c.fuente === 'local' && <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Local</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-xs line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>{fmt(c.valor_original)}</div>
                        <div className="text-sm font-black" style={{ color: '#4ade80' }}>{fmt(c.valor_descuento)}</div>
                        <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>con desc. 50%</div>
                      </div>
                      {c.estado === 'pendiente' && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/curso')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                          style={{ background: 'rgba(0,122,77,0.2)', border: '1px solid rgba(0,122,77,0.4)', color: '#4ade80' }}>
                          Iniciar curso<ChevronRight size={12} />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* ── SECTION 4: PROGRESO ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="rounded-3xl p-6"
          style={{ background: 'rgba(8,14,28,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-base font-black text-white flex items-center gap-2 mb-5">
            <TrendingUp size={16} style={{ color: '#fbbf24' }} />Mi Progreso en el Curso
          </h2>

          {!progreso ? (
            <div className="text-center py-6 space-y-4">
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Aún no has iniciado el curso.</p>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate('/curso')}
                className="px-6 py-3 rounded-2xl text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg, #003366, #007A4D)', boxShadow: '0 4px 20px rgba(0,122,77,0.3)' }}>
                🚀 Comenzar el curso ahora
              </motion.button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Big progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Progreso general</span>
                  <span className="font-bold text-white">{progreso.porcentaje}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #003366, #007A4D)', boxShadow: '0 0 10px rgba(0,122,77,0.5)' }}
                    initial={{ width: 0 }} animate={{ width: `${progreso.porcentaje}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} />
                </div>
              </div>

              {/* Modules */}
              <div className="space-y-2">
                {MODULOS.map((mod, i) => {
                  const done = progreso.modulos_completados.includes(i + 1)
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                      style={{ background: done ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${done ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: done ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)' }}>
                        {done ? <CheckCircle size={14} style={{ color: '#4ade80' }} /> : <Lock size={14} style={{ color: 'rgba(255,255,255,0.25)' }} />}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}>
                        Módulo {i + 1}: {mod}
                      </span>
                      {done && <span className="ml-auto text-xs font-bold" style={{ color: '#4ade80' }}>Completado</span>}
                    </motion.div>
                  )
                })}
              </div>

              {/* Exam result */}
              {progreso.estado === 'completado' && (
                <div className="flex items-center gap-3 px-4 py-4 rounded-2xl"
                  style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
                  <Award size={20} style={{ color: '#4ade80' }} />
                  <div>
                    <p className="text-sm font-bold text-white">🎉 ¡Examen aprobado!</p>
                    {progreso.fecha_completado && (
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Aprobado el {fmtDate(progreso.fecha_completado)}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {progreso.bloqueado && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
                  <AlertCircle size={16} style={{ color: '#f87171' }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#f87171' }}>Examen bloqueado por intentos fallidos</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate('/curso/examen')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold"
                    style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
                    Volver a intentar
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ── SECTION 5: CERTIFICADOS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
          className="rounded-3xl p-6"
          style={{ background: 'rgba(8,14,28,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-base font-black text-white flex items-center gap-2 mb-5">
            <ShieldCheck size={16} style={{ color: '#fbbf24' }} />Mis Certificados
          </h2>

          {certificados.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Award size={40} className="mx-auto opacity-20 text-white" />
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Aún no tienes certificados.<br />Completa el curso para obtenerlos.
              </p>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate('/curso')}
                className="px-5 py-2.5 rounded-2xl text-sm font-bold"
                style={{ background: 'rgba(0,122,77,0.15)', border: '1px solid rgba(0,122,77,0.35)', color: '#4ade80' }}>
                Ir al curso
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              {certificados.map((cert, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl"
                  style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(251,191,36,0.15)' }}>
                    <Award size={18} style={{ color: '#fbbf24' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{cert.tipo}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {fmtDate(cert.fecha)} · Código: <span className="font-mono">{cert.codigo}</span>
                    </p>
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/curso/certificado')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0"
                    style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}>
                    <Download size={12} />Descargar PDF
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </>
  )
}
