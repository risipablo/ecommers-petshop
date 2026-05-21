// components/layout/header.tsx
import { SearchWrapper } from "../common/searchwrapper"
import Navbar from "./navbar"
import "../../assets/styles/header.css"
import { Logo } from "./logo"
import { Box } from "@mui/material"
import { Facebook, Instagram, HelpCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { UserIcon } from "../common/userIcon"



export const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen)
  }

  return (
    <Box className={`container-header ${scrolled ? 'scrolled' : ''}`}>
      {!scrolled && (
        <Box className="promo-bar">
          <div className="promo-bar-content">
            <div className="promo-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={15} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={15} />
              </a>
            </div>
            <p className="promo-text">Bambina Petshop</p>
          </div>
        </Box>
      )}

      <Box className="header-wrapper">
        <Box className="main-bar">
          <Box className="main-bar-content">
            <Logo />
            <Box className="search-wrapper-main">
              <SearchWrapper />
            </Box>
            
            {/* Sección de Usuario + Ayuda - SOLO VISIBLE EN DESKTOP */}
            <Box className="user-help-wrapper desktop-only">
              <UserIcon />
              
              {/* Ícono de Ayuda */}
              <div className="help-icon-container" onClick={toggleHelp}>
                <HelpCircle size={24} />
                <span className="help-text">Ayuda</span>
                
                {isHelpOpen && (
                  <div className="help-dropdown">
                    <a href="/preguntas-frecuentes" className="help-link">
                      Preguntas frecuentes
                    </a>
                    <a href="/contacto" className="help-link">
                      Contacto
                    </a>
                    <a href="/terminos" className="help-link">
                      Términos y condiciones
                    </a>
                  </div>
                )}
              </div>
            </Box>
            
            <div className="navbar-wrapper-main">
              <Navbar />
            </div>
          </Box>
        </Box>
      </Box>

      
    </Box>
  )
}