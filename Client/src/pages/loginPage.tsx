// pages/LoginPage.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/authProvider';
import '../assets/styles/authpage.css';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, [location.pathname]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await login({ email, password });
            navigate('/');
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-page-card">
                <Link to="/" className="auth-back-link">
                    <ArrowLeft size={18} />
                    Volver al inicio
                </Link>
                
                <div className="auth-page-header">
                    <div className="auth-page-header-title">
                        <div className="auth-page-icon">
                            <LogIn size={36} />  
                        </div>
                        <h1>Iniciar Sesión</h1>
                    </div>
                    <p>Accede a tu cuenta...</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-page-form">
                    {error && <div className="auth-page-error">{error}</div>}
                    
                    <div className="auth-page-input-group">
                        <Mail size={18} />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="auth-page-input-group">
                        <Lock size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            className="auth-page-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    
                    <div className="auth-page-links">
                        <Link to="/forgot-password" className="forgot-password-link">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    
                    <button type="submit" className="auth-page-btn" disabled={loading}>
                        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>

                        <div className="auth-page-footer">
                            <p>
                                ¿No tienes cuenta?{' '}
                                <Link to="/register" className="auth-page-switch-link">
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                        
                </form>
                

            </div>
        </div>
    );
};