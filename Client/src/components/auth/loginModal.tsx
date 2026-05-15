// components/auth/LoginModal.tsx (actualizar)
import { useState } from 'react';
import { X, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/authProvider';
import { ForgotPasswordModal } from './forgotPasswordModal';
import "../../assets/styles/auth.css"

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

export const LoginModal = ({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { login } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await login({ email, password });
            onClose();
            setEmail('');
            setPassword('');
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                    
                    <div className="modal-header">
                        <LogIn size={32} />
                        <h2>Iniciar Sesión</h2>
                        <p>Accede a tu cuenta para disfrutar de beneficios exclusivos</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error">{error}</div>}
                        
                        <div className="form-group">
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
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
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        
                        <div className="auth-links">
                            <button 
                                type="button"
                                className="forgot-password-link"
                                onClick={() => setShowForgotPassword(true)}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                        
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                    
                    <div className="modal-footer">
                        <p>
                            ¿No tienes cuenta?{' '}
                            <button 
                                className="switch-btn"
                                onClick={() => {
                                    onClose();
                                    onSwitchToRegister();
                                }}
                            >
                                Regístrate aquí
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <ForgotPasswordModal 
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
                onSwitchToLogin={() => {
                    setShowForgotPassword(false);
                    onClose();
                }}
            />
        </>
    );
};