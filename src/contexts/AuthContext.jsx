import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('auth_user')
      const token = localStorage.getItem('token')
      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (identifier, password) => {
    try {
      // Usamos el endpoint unificado que detecta automáticamente si es Ciudadano o Admin
      const response = await api.post('/auth/login', { identifier, password });
      
      const { token, usuario } = response.data.data;
      
      setUser(usuario)
      localStorage.setItem('auth_user', JSON.stringify(usuario))
      localStorage.setItem('token', token)
      
      return usuario
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión')
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrarse')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('token')
    // Redirigir al login después de limpiar estado
    window.location.href = '/login'
  }

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  }

  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
