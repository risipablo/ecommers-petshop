// components/auth/RegisterModal.tsx
import { useState } from 'react';
import { X, Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/authProvider';
import '../../assets/styles/auth.css';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const { register } = useAuth();

    if (!isOpen) return null;

    const validatePassword = (pass: string) => {
        const errors = [];
        if (pass.length < 7) errors.push('• Mínimo 7 caracteres');
        if (!/[A-Z]/.test(pass)) errors.push('• Al menos una mayúscula');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) errors.push('• Al menos un carácter especial');
        return errors;
    };

    const handlePasswordChange = (pass: string) => {
        setPassword(pass);
        setPasswordErrors(validatePassword(pass));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
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
            await register({ name, email, password, confirmPassword });
            onClose();
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
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
                    <UserPlus size={32} />
                    <h2>Crear Cuenta</h2>
                    <p>Regístrate para obtener una mejor experiencia</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}
                    
                    <div className="form-group">
                        <User size={18} />
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    
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
                            onChange={(e) => handlePasswordChange(e.target.value)}
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
                            <p className="requirements-title">La contraseña debe tener:</p>
                            {passwordErrors.map((err, i) => (
                                <span key={i} className="requirement">{err}</span>
                            ))}
                        </div>
                    )}
                    
                    <div className="form-group">
                        <Lock size={18} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
                
                <div className="modal-footer">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <button 
                            className="switch-btn"
                            onClick={() => {
                                onClose();
                                onSwitchToLogin();
                            }}
                        >
                            Inicia sesión aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};