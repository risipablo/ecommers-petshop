// components/layout/header.tsx
import { SearchWrapper } from "../common/searchwrapper"
import Navbar from "./navbar"
import "../../assets/styles/header.css"
import { Logo } from "./logo"
import { Box } from "@mui/material"
import { Facebook, Instagram, HelpCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { UserIcon } from "../common/userIcon"
import { WelcomeModal } from "./welcome"


export const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Box className={`container-header ${scrolled ? 'scrolled' : ''}`}>
      {!scrolled && (
        <Box className="promo-bar">
          <div className="promo-bar-content">
            <div className="promo-social">
              <a href="https://www.facebook.com/Bambina.alimentosyaccesorios?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={15} />
              </a>
              <a href="https://www.instagram.com/bambinapetshop?igsh=YWY5cWZucnYzamc0" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
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

            {/* User + Help */}
            <Box className="user-help-wrapper">
              <span className="user-icon-mobile-hide"><UserIcon /></span>
              <div
                className="help-icon-container"
                onClick={() => setIsHelpOpen(true)}
                aria-label="Abrir ayuda"
              >
                <HelpCircle size={24} />
  
              </div>
            </Box>

            <div className="navbar-wrapper-main">
              <Navbar />
            </div>
          </Box>
        </Box>
      </Box>

      {/* Modal de bienvenida / ayuda */}
      <WelcomeModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </Box>
  )
}