
// Logo.tsx
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import '../../assets/styles/logo.css';
import logo from "../../assets/images/logo.png"

export const Logo = () => {
    return (
        <Link to="/" className="logo-link">
            <Box className="logo-container">
                <Box className="logo-icon-wrapper">
                    <img src={logo} alt="Bambina Petshop Logo" />
                </Box>
            </Box>
        </Link>
    );
};