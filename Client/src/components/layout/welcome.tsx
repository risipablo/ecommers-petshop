// components/common/WelcomeModal.tsx
import { X, MapPin, ShoppingBag, BookOpen, MessageCircle, } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import "../../assets/styles/welcomeModal.css"

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  onDontShowAgain?: () => void
}

export const WelcomeModal = ({ isOpen, onClose, onDontShowAgain }: WelcomeModalProps) => {
  const navigate = useNavigate()
  const [dontShowChecked, setDontShowChecked] = useState(false)

  if (!isOpen) return null

  const handleNavigate = (path: string) => {
    navigate(path)
    onClose()
  }

  const handleClose = () => {
    if (dontShowChecked && onDontShowAgain) {
      onDontShowAgain()
    }
    onClose()
  }

  return (
    <div className="welcome-overlay" onClick={handleClose}>
      <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>

        {/* Botón cerrar */}
        <button className="welcome-close" onClick={handleClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        {/* Header del modal */}
        <div className="welcome-header">
          <div className="welcome-paw">🐾</div>
          <h2 className="welcome-title">¡Hola! Te damos la bienvenida a <span>Bambina Petshop</span></h2>
        </div>

        {/* Cuerpo */}
        <div className="welcome-body">

          {/* Ubicación */}
          <div className="welcome-item">
            <div className="welcome-item-icon">
              <MapPin size={18} />
            </div>
            <p>
              Estamos ubicados en <strong>Cipolletti, Río Negro</strong>, y somos tu punto de encuentro
              favorito para el bienestar de tus compañeros. En nuestro sitio encontrarás alimentos,
              accesorios, juguetes e indumentaria, además de nuestras promociones destacadas.
            </p>
          </div>

          {/* Artículos */}
          <div className="welcome-item">
            <div className="welcome-item-icon">
              <BookOpen size={18} />
            </div>
            <p>
              Contamos con una sección de <strong>artículos informativos</strong> con consejos y datos
              útiles sobre el cuidado de tus animales.{" "}
              <button
                className="welcome-link"
                onClick={() => handleNavigate("/articulos")}
              >
                Ir a artículos →
              </button>
            </p>
          </div>

          {/* Compras online */}
          <div className="welcome-item">
            <div className="welcome-item-icon">
              <ShoppingBag size={18} />
            </div>
            <p>
              Por el momento <strong>no contamos con compras online</strong>, ¡pero estamos trabajando
              para habilitarlo muy pronto! Si tenés alguna duda, escribinos a través de nuestra sección
              de contacto.{" "}
              <button
                className="welcome-link"
                onClick={() => handleNavigate("/contacto")}
              >
                Ir a contacto →
              </button>
            </p>
          </div>

          {/* Cierre */}
          <div className="welcome-item">
            <div className="welcome-item-icon">
              <MessageCircle size={18} />
            </div>
            <p>
              ¡<strong>Muchas gracias</strong> por visitarnos! Esperamos que disfrutes tu recorrido
              por nuestra web. 🐶🐱
            </p>
          </div>

          {/* Opción "No volver a mostrar" */}
          <div className="welcome-dont-show">
            <label className="welcome-checkbox-label">
              <input
                type="checkbox"
                checked={dontShowChecked}
                onChange={(e) => setDontShowChecked(e.target.checked)}
                className="welcome-checkbox"
              />
              <span className="welcome-checkbox-text">No volver a mostrar este mensaje</span>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="welcome-footer">
          <button className="welcome-btn-secondary" onClick={() => handleNavigate("/contacto")}>
            Contactanos
          </button>
          <button className="welcome-btn-primary" onClick={handleClose}>
            ¡Explorar!
          </button>
        </div>

      </div>
    </div>
  )
}