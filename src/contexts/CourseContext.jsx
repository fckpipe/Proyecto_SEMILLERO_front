import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { MODULES } from '../utils/courseData'
import { useAuth } from './AuthContext'
import api from '../services/api'

const CourseContext = createContext()

export function useCourse() {
  const ctx = useContext(CourseContext)
  if (!ctx) throw new Error('useCourse must be used within CourseProvider')
  return ctx
}

export function CourseProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [moduleState, setModuleState] = useState({})
  const [focusViolations, setFocusViolations] = useState(0)
  const [examBlocked, setExamBlocked] = useState(false)
  const [examResult, setExamResult] = useState(null)
  const [certificateUnlocked, setCertificateUnlocked] = useState(false)
  
  // Specific tracking for linear flow
  const [moduloActual, setModuloActual] = useState(1)
  const [modulosCompletados, setModulosCompletados] = useState([])
  const [multas, setMultas] = useState([])
  const [ahorroTotal, setAhorroTotal] = useState(0)
  const [showSavingCelebration, setShowSavingCelebration] = useState(false)

  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    try {
      console.log('CourseContext: Recargando progreso del servidor...')
      const progRes = await api.get('/curso/progreso')
      const { progreso, examenes, certificadoDesbloqueado } = progRes.data.data
      
      const compIds = progreso?.modulos_completados || []
      setModulosCompletados(compIds)
      
      // Determine current module: first non-completed one
      // If 0, 1, 2 are completed, next is 3.
      // If all (5) are done, next is 5 (or logic for exam)
      const nextModId = compIds.length >= MODULES.length ? MODULES.length : compIds.length + 1
      setModuloActual(nextModId)
      
      const stateObj = {}
      MODULES.forEach((mod) => {
        let status = 'locked'
        // If it's in the completed list, it's completed
        if (compIds.includes(mod.id)) {
          status = 'completed'
        } 
        // If it's the next one to do (nextModId) OR it's module 1 and nothing is done
        else if (mod.id === nextModId || (mod.id === 1 && compIds.length === 0)) {
          status = 'in-progress'
        }
        // If the previous one is completed, it's available
        else if (compIds.includes(mod.id - 1)) {
          status = 'available'
        }
        
        stateObj[mod.id] = { status }
      })
      setModuleState(stateObj)
      
      setFocusViolations(progreso?.trampas_detectadas || 0)
      setExamBlocked((progreso?.trampas_detectadas || 0) >= 3)
      setExamResult(examenes && examenes.length > 0 ? {
        passed: examenes[0].aprobado,
        score: examenes[0].puntaje,
        correct: examenes[0].respuestas?.filter(r=>r.correcta).length || 0,
        total: examenes[0].respuestas?.length || 20,
        submittedAt: examenes[0].updatedAt
      } : null)
      setCertificateUnlocked(certificadoDesbloqueado || false)
      console.log('CourseContext: Progreso sincronizado. Módulos completados:', compIds.length)
    } catch (e) {
      console.error('CourseContext: Error al sincronizar progreso', e)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => { 
    if (isAuthenticated) {
      fetchProgress()
    } else {
      setLoading(false)
      // Reset state on logout
      setModulosCompletados([])
      setModuleState({})
    }
  }, [isAuthenticated, fetchProgress])

  const startModule = useCallback(async (id) => {
    try {
      await api.post('/curso/iniciar')
      setModuloActual(id)
      setModuleState(prev => ({ ...prev, [id]: { ...prev[id], status: 'in-progress' } }))
    } catch (e) {
      console.error('CourseContext: Error al iniciar módulo', e)
    }
  }, [])

  const completeModule = useCallback(async (id) => {
    try {
      console.log(`CourseContext: Marcando módulo ${id} como completado...`)
      const res = await api.post(`/curso/modulo/${id}/completar`)
      console.log('CourseContext: Respuesta servidor:', res.data)
      // Actualizamos localmente y luego sincronizamos
      await fetchProgress()
    } catch (e) {
      console.error('CourseContext: Error al completar módulo', e)
    }
  }, [fetchProgress])

  const recordFocusViolation = useCallback(async () => {
    try {
      const res = await api.post('/curso/trampa')
      setFocusViolations(res.data.data.trampas)
      setExamBlocked(res.data.data.bloqueado)
    } catch (e) {
      console.error('CourseContext: Error al registrar trampa', e)
    }
  }, [])

  const startExam = useCallback(async () => {
    try {
      const res = await api.post('/curso/examen/iniciar')
      return res.data.data
    } catch (e) { 
      console.error('CourseContext: Error al iniciar examen', e)
      throw e 
    }
  }, [])

  const submitExam = useCallback(async (examen_id, answersMap) => {
    try {
      const res = await api.post('/curso/examen/entregar', { examen_id, respuestasData: answersMap })
      await fetchProgress()
      if (res.data.data.aprobado) {
        setShowSavingCelebration(true)
      }
      return {
        passed: res.data.data.aprobado,
        score: res.data.data.puntaje,
        correct: res.data.data.correctas,
        total: res.data.data.total
      }
    } catch (e) { 
      console.error('CourseContext: Error al entregar examen', e)
      throw e 
    }
  }, [fetchProgress])

  const [multasFetched, setMultasFetched] = useState(false);

  const fetchMultas = useCallback(async (tipo = 'cedula', valor = user?.cedula) => {
    if (!valor) return
    try {
      const res = await api.get(`/multas/${tipo}/${valor}`)
      const { comparendos } = res.data
      setMultas(comparendos || [])
      const total = (comparendos || []).reduce((acc, m) => acc + (m.valor_original * 0.5), 0)
      setAhorroTotal(total)
    } catch (e) {
      console.error('CourseContext: Error al consultar multas', e)
    } finally {
      setMultasFetched(true)
    }
  }, [user])

  const aplicarDescuento = useCallback(async (comparendoId) => {
    try {
      const res = await api.post('/multas/aplicar-descuento', { comparendoId })
      // Recargar multas después de aplicar
      await fetchMultas('cedula', user?.cedula)
      return res.data
    } catch (e) {
      console.error('CourseContext: Error al aplicar descuento', e)
      throw e
    }
  }, [user, fetchMultas])

  const completedCount = modulosCompletados.length
  const progressPercent = Math.round((completedCount / MODULES.length) * 100) || 0
  const allModulesCompleted = completedCount === MODULES.length

  const value = {
    loading,
    moduleState,
    moduloActual,
    modulosCompletados,
    focusViolations,
    examBlocked,
    examResult,
    certificateUnlocked,
    startModule,
    completeModule,
    recordFocusViolation,
    startExam,
    submitExam,
    completedCount,
    progressPercent,
    allModulesCompleted,
    fetchProgress,
    multas,
    ahorroTotal,
    showSavingCelebration,
    setShowSavingCelebration,
    fetchMultas,
    aplicarDescuento,
    multasFetched
  }

  return (
    <CourseContext.Provider value={value}>
      {!loading && children}
    </CourseContext.Provider>
  )
}
