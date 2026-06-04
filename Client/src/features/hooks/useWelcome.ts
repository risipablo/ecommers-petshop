// hooks/useWelcomeModal.ts
import { useState, useEffect } from 'react'

const WELCOME_MODAL_KEY = 'bambina_welcome_modal_shown'

export const useWelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya vio el modal
    const hasSeenModal = localStorage.getItem(WELCOME_MODAL_KEY) === 'true'
    
    if (!hasSeenModal) {
      // Mostrar modal después de un pequeño delay (1 segundo)
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleDontShowAgain = () => {
    localStorage.setItem(WELCOME_MODAL_KEY, 'true')
  }

  return {
    isOpen,
    handleClose,
    handleDontShowAgain
  }
}