// pages/ResetPasswordPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Key } from 'lucide-react';
import { useAuth } from '../context/authProvider';
import '../assets/styles/auth.css';

export const ResetPasswordPage = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    const validatePassword = (pass: string) => {
        const errors = [];
        if (pass.length < 7) errors.push('Mínimo 7 caracteres');
        if (!/[A-Z]/.test(pass)) errors.push('Al menos una mayúscula');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) errors.push('Al menos un carácter especial');
        return errors;
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

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
            await resetPassword({ token: token!, newPassword, confirmNewPassword });
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <Key size={48} color="#722b8f" />
                    <h1>Restablecer Contraseña</h1>
                    <p>Ingresa tu nueva contraseña</p>
                </div>

                {success ? (
                    <div className="auth-success">
                        <p>✅ Contraseña actualizada exitosamente</p>
                        <p>Serás redirigido al inicio de sesión...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="reset-password-form">
                        {error && <div className="auth-error">{error}</div>}
                        
                        <div className="form-group">
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
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        
                        {passwordErrors.length > 0 && (
                            <div className="password-requirements">
                                <p>La contraseña debe tener:</p>
                                {passwordErrors.map((err, i) => (
                                    <span key={i}>• {err}</span>
                                ))}
                            </div>
                        )}
                        
                        <div className="form-group">
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
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};