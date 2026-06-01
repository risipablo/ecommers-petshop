// pages/ForgotPasswordPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/authProvider';
import '../assets/styles/auth.css';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { forgotPassword } = useAuth();

    useEffect(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, [location.pathname]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await forgotPassword({ email });
            setSuccess(true);
        } catch (err: unknown) {
            setError((err as Error).message);
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
                            <Send size={40} />
                        </div>
                        <h1>¡Revisa tu email!</h1>
                        <p>Te hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong></p>
                    </div>
                    <div className="auth-page-footer">
                        <Link to="/login" className="auth-page-btn-link">
                            Volver al inicio de sesión
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
                        <Send size={40} />
                    </div>
                    <h1>Recuperar Contraseña</h1>
                    <p>Te enviaremos un email con las instrucciones</p>
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
                    
                    <button type="submit" className="auth-page-btn" disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar instrucciones'}
                    </button>

                    <div className="auth-page-footer">
                        <p>
                            <Link to="/login" className="auth-page-switch-link">
                                Volver al inicio de sesión
                            </Link>
                        </p>
                    </div>
                </form>
                

            </div>
        </div>
    );
};