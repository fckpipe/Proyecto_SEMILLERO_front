import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, Loader2, Search } from 'lucide-react'

/**
 * Toast Notification Component
 */
export const Toast = ({ message, type = 'success', onClose }) => {
  const icons = {
    success: <CheckCircle className="text-verde-500" />,
    error: <AlertCircle className="text-red-500" />,
    info: <Info className="text-blue-500" />
  };

  const bgColors = {
    success: 'border-verde-100 bg-verde-50/90',
    error: 'border-red-100 bg-red-50/90',
    info: 'border-blue-100 bg-blue-50/90'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-md shadow-glass ${bgColors[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-bold text-gris-900">{message}</p>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/50 transition-colors">
        <X size={16} className="text-gris-400" />
      </button>
    </motion.div>
  );
};

/**
 * Loading Skeleton for Tables
 */
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full animate-pulse space-y-4">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border-b border-gris-100">
        <div className="h-4 bg-gris-200 rounded w-1/4"></div>
        <div className="h-4 bg-gris-200 rounded w-1/4"></div>
        <div className="h-4 bg-gris-200 rounded w-1/4"></div>
        <div className="h-4 bg-gris-200 rounded w-1/4"></div>
      </div>
    ))}
  </div>
);

/**
 * Card Skeleton
 */
export const CardSkeleton = () => (
  <div className="card-glass p-6 animate-pulse space-y-4">
    <div className="flex justify-between">
      <div className="w-12 h-12 bg-gris-200 rounded-2xl"></div>
      <div className="w-20 h-6 bg-gris-200 rounded-full"></div>
    </div>
    <div className="h-4 bg-gris-200 rounded w-3/4"></div>
    <div className="h-4 bg-gris-200 rounded w-1/2"></div>
    <div className="pt-4 flex gap-2">
      <div className="h-10 bg-gris-200 rounded-xl flex-1"></div>
      <div className="h-10 bg-gris-200 rounded-xl w-12"></div>
    </div>
  </div>
);

/**
 * Empty State Component
 */
export const EmptyState = ({ title = 'No se encontraron datos', message = 'Intenta ajustar tus filtros de búsqueda.' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center space-y-4"
  >
    <div className="w-24 h-24 bg-gris-100 rounded-full flex items-center justify-center text-gris-300">
      <Search size={48} />
    </div>
    <h3 className="text-xl font-display font-bold text-gris-700">{title}</h3>
    <p className="text-gris-500 max-w-xs">{message}</p>
  </motion.div>
);

/**
 * Page Wrapper for Transitions
 */
export const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="w-full"
  >
    {children}
  </motion.div>
);
