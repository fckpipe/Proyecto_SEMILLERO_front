import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gris-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center border-b border-gris-100 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gris-900">Panel de Usuario</h1>
            <p className="text-gris-600 mt-1">Bienvenido, {user?.nombre || user?.name || 'Usuario'}</p>
          </div>
          <button onClick={handleLogout} className="btn-outline px-4 py-2 text-sm">
            Cerrar sesión
          </button>
        </div>
        
        <div className="bg-dorado-50 border border-dorado-200 rounded-xl p-6 mb-8 text-dorado-800">
          <h3 className="font-semibold mb-2">Aviso importante</h3>
          <p className="text-sm">Actualmente no tienes citas programadas para el curso pedagógico.</p>
        </div>
        
        <button className="btn-primary">
          Agendar nueva cita
        </button>
      </div>
    </div>
  )
}
