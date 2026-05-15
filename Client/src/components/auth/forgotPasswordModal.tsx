// components/auth/ForgotPasswordModal.tsx
import { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import { useAuth } from '../../context/authProvider';
import '../../assets/styles/auth.css';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }: ForgotPasswordModalProps) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { forgotPassword } = useAuth();

    if (!isOpen) return null;

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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>
                
                <div className="modal-header">
                    <Send size={32} />
                    <h2>Recuperar Contraseña</h2>
                    <p>Te enviaremos un email con las instrucciones</p>
                </div>

                {success ? (
                    <div className="auth-success">
                        <p>✅ Se ha enviado un email a <strong>{email}</strong></p>
                        <p>Revisa tu bandeja de entrada y sigue las instrucciones.</p>
                        <button 
                            className="auth-btn"
                            onClick={() => {
                                onClose();
                                onSwitchToLogin();
                            }}
                        >
                            Volver al inicio de sesión
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error">{error}</div>}
                        
                        <div className="form-group">
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar instrucciones'}
                        </button>
                    </form>
                )}
                
                <div className="modal-footer">
                    <p>
                        <button 
                            className="switch-btn"
                            onClick={() => {
                                onClose();
                                onSwitchToLogin();
                            }}
                        >
                            Volver al inicio de sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};