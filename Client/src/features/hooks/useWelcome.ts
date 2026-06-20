// hooks/useWelcomeModal.ts
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/authProvider'


const WELCOME_MODAL_KEY = 'bambina_welcome_modal_shown'

export const useWelcomeModal = () => {
  const { isAuthenticated, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (isAuthenticated && user) {
      // Usuario registrado: usar localStorage persistente
      const hasSeenModal = localStorage.getItem(WELCOME_MODAL_KEY) === 'true'
      
      if (!hasSeenModal) {
        const timer = setTimeout(() => {
          setIsOpen(true)
        }, 1000)
        return () => clearTimeout(timer)
      }
    } else {
      // Usuario NO registrado: usar sessionStorage (se borra al cerrar pestaña)
      const hasSeenModalSession = sessionStorage.getItem(WELCOME_MODAL_KEY) === 'true'
      
      if (!hasSeenModalSession) {
        const timer = setTimeout(() => {
          setIsOpen(true)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [isAuthenticated, user])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleDontShowAgain = () => {
    if (isAuthenticated && user) {
      // Usuario registrado: guardar en localStorage (permanente)
      localStorage.setItem(WELCOME_MODAL_KEY, 'true')
    } else {
      // Usuario NO registrado: guardar en sessionStorage (solo dura la sesión)
      sessionStorage.setItem(WELCOME_MODAL_KEY, 'true')
    }
    setIsOpen(false)
  }

  return {
    isOpen,
    handleClose,
    handleDontShowAgain
  }
}