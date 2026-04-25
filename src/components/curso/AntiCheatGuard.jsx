import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, XCircle, ShieldAlert } from 'lucide-react'
import { useCourse } from '../../contexts/CourseContext'

export default function AntiCheatGuard({ children }) {
  const { focusViolations, recordFocusViolation, examBlocked } = useCourse()
  const [showWarning, setShowWarning] = useState(false)
  const [showBlocked, setShowBlocked] = useState(examBlocked)
  const isHandlingViolation = useRef(false)

  useEffect(() => {
    const handleViolation = () => {
      if (!isHandlingViolation.current && !examBlocked) {
        isHandlingViolation.current = true
        recordFocusViolation()
        setShowWarning(true)
        console.warn('AntiCheat: Infracción detectada y registrada.')
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) handleViolation()
    }

    const handleWindowBlur = () => {
      handleViolation()
    }

    const preventDefault = (e) => {
        e.preventDefault()
        handleViolation()
    }

    const handleKeyDown = (e) => {
        // Block F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'u')
        ) {
            preventDefault(e)
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)
    document.addEventListener('copy', preventDefault)
    document.addEventListener('contextmenu', preventDefault)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
      document.removeEventListener('copy', preventDefault)
      document.removeEventListener('contextmenu', preventDefault)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [recordFocusViolation, examBlocked])

  // Watch if exam becomes blocked from context
  useEffect(() => {
    if (examBlocked) {
      setShowWarning(false)
      setShowBlocked(true)
    } else {
      setShowBlocked(false)
    }
  }, [examBlocked, focusViolations])

  const handleDismissWarning = () => {
    setShowWarning(false)
    isHandlingViolation.current = false
  }

  const remaining = Math.max(0, 3 - focusViolations)

  return (
    <div className="relative">
      {children}

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && !showBlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gris-900 border border-dorado-400/30 rounded-[2.5rem] p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-dorado-400/20 border-2 border-dorado-400/40 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={36} className="text-dorado-400" />
              </div>
              <h2 className="text-2xl font-display font-extrabold text-white mb-3">
                ⚠️ Abandono detectado
              </h2>
              <p className="text-white/70 mb-2 leading-relaxed">
                El sistema detectó que saliste de la ventana del curso. Por integridad del proceso, esto queda registrado.
              </p>
              <div className="bg-dorado-400/10 border border-dorado-400/20 rounded-2xl p-4 mb-6">
                <p className="text-dorado-300 font-bold text-sm">
                  Advertencia {focusViolations} de 3
                </p>
                <p className="text-white/50 text-xs mt-1">
                  {remaining > 0
                    ? `Si sales ${remaining} vez${remaining > 1 ? 'es' : ''} más, el examen final quedará bloqueado.`
                    : 'Esta es tu última advertencia.'}
                </p>
              </div>
              <button
                onClick={handleDismissWarning}
                className="btn-primary w-full py-4 text-base"
              >
                Entendido, continúo el curso
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blocked Modal */}
      <AnimatePresence>
        {showBlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="bg-gris-900 border border-red-500/30 rounded-[2.5rem] p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center mx-auto mb-6">
                <XCircle size={36} className="text-red-400" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldAlert size={12} /> Examen Bloqueado
              </div>
              <h2 className="text-2xl font-display font-extrabold text-white mb-3">
                Acceso al examen restringido
              </h2>
              <p className="text-white/60 mb-4 leading-relaxed text-sm">
                Saliste de la ventana del curso en 3 ocasiones durante una sesión activa. Por política de integridad académica, el examen final ha sido bloqueado.
              </p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                <p className="text-red-300 text-sm font-semibold">¿Qué puedo hacer?</p>
                <p className="text-white/50 text-xs mt-1">
                  Contacta a la Secretaría de Movilidad para solicitar el desbloqueo. Este incidente quedó registrado en el sistema para auditoría.
                </p>
              </div>
              <a
                href="/"
                className="block w-full py-4 bg-white/10 hover:bg-white/15 rounded-2xl text-white font-semibold transition-all"
              >
                Volver al inicio
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
