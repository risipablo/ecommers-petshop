// pages/RegisterPage.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/authProvider';
import '../assets/styles/authpage.css';

export const RegisterPage = () => {
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
    const navigate = useNavigate();

    useEffect(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, [location.pathname]);

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
            <UserPlus size={36} />  
        </div>
        <h1>Crear Cuenta</h1>
    </div>
    <p>Regístrate para obtener una mejor experiencia</p>
</div>

                <form onSubmit={handleSubmit} className="auth-page-form">
                    {error && <div className="auth-page-error">{error}</div>}
                    
                    <div className="auth-page-input-group">
                        <User size={18} />
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    
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
                            onChange={(e) => handlePasswordChange(e.target.value)}
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
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>

                                    
                    <div className="auth-page-footer">
                        <p>
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="auth-page-switch-link">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                    
                </form>

            </div>
        </div>
    );
};