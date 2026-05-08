// components/layout/header.tsx
import { SearchWrapper } from "../common/searchwrapper"
import Navbar from "./navbar"
import "../../assets/styles/header.css"
import { Logo } from "./logo"
import { Box } from "@mui/material"
import { Facebook, Instagram } from "lucide-react"
import { useEffect, useState } from "react"

import { useAuth } from "../../context/authProvider"
import { AuthButtons } from "../auth/authButtons"

export const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user } = useAuth()

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
            {isAuthenticated && (
              <span className="user-greeting">¡Hola, {user?.name?.split(' ')[0]}!</span>
            )}
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
            <Box className="user-wrapper-main">
              <AuthButtons />
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