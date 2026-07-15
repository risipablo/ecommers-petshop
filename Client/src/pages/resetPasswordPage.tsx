// pages/resetPasswordPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Key, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { config } from '../config/index';
import '../assets/styles/auth.css';

const API_URL = config.Api;

export const ResetPasswordPage = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    const validatePassword = (pass: string) => {
        const errors = [];
        if (pass.length < 7) errors.push('Mínimo 7 caracteres');
        if (!/[A-Z]/.test(pass)) errors.push('Al menos una mayúscula');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) errors.push('Al menos un carácter especial');
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmNewPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        
        if (passwordErrors.length > 0) {
            setError('Por favor, cumple con todos los requisitos de contraseña');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, {
                token,
                newPassword,
                confirmNewPassword
            });
            
            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al restablecer la contraseña');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page-container">
                <div className="auth-page-card success-card">
                    <div className="auth-page-header">
                        <div className="auth-page-icon success-icon">
                            <CheckCircle size={40} />
                        </div>
                        <h1>¡Contraseña actualizada!</h1>
                        <p>Tu contraseña ha sido cambiada exitosamente.</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
                            Serás redirigido al inicio de sesión...
                        </p>
                    </div>
                    <div className="auth-page-footer">
                        <Link to="/login" className="auth-page-btn-link">
                            Ir al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page-container">
            <div className="auth-page-card">
                <Link to="/login" className="auth-back-link">
                    <ArrowLeft size={18} />
                    Volver al inicio de sesión
                </Link>
                
                <div className="auth-page-header">
                    <div className="auth-page-icon">
                        <Key size={40} />
                    </div>
                    <h1>Restablecer Contraseña</h1>
                    <p>Ingresa tu nueva contraseña</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-page-form">
                    {error && <div className="auth-page-error">{error}</div>}
                    
                    <div className="auth-page-input-group">
                        <Lock size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setPasswordErrors(validatePassword(e.target.value));
                            }}
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
                    
                    {passwordErrors.length > 0 && (
                        <div className="auth-page-requirements">
                            <p className="requirements-title">La contraseña debe tener:</p>
                            {passwordErrors.map((err, i) => (
                                <span key={i} className="requirement">{err}</span>
                            ))}
                        </div>
                    )}
                    
                    <div className="auth-page-input-group">
                        <Lock size={18} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar nueva contraseña"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            className="auth-page-password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    
                    <button type="submit" className="auth-page-btn" disabled={loading}>
                        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};