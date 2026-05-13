
import { useState } from 'react';
import { useAuth } from '../context/authProvider';
import { User, Mail, LogIn, UserPlus, LogOut, Shield, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/profile.css';

export const ProfilePage = () => {
    const { isAuthenticated, user, isAdmin, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const navigate = useNavigate();

    // Formulario de login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Formulario de registro
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);

    const { login, register } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        
        try {
            await login({ email: loginEmail, password: loginPassword });
            navigate('/');
        } catch (err: unknown) {
            setLoginError((err as Error).message);
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (registerPassword !== registerConfirmPassword) {
            setRegisterError('Las contraseñas no coinciden');
            return;
        }
        
        if (registerPassword.length < 6) {
            setRegisterError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        setRegisterLoading(true);
        setRegisterError('');
        
        try {
            await register({ name: registerName, email: registerEmail, password: registerPassword });
            navigate('/');
        } catch (err: unknown) {
            setRegisterError((err as Error).message);
        } finally {
            setRegisterLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Si está autenticado, mostrar perfil
    if (isAuthenticated && user) {
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <User size={48} />
                        </div>
                        <h1>{user.name}</h1>
                        <p className="profile-email">{user.email}</p>
                        <span className={`profile-role ${user.role === 'admin' ? 'admin' : 'user'}`}>
                            {user.role === 'admin' ? '👑 Administrador' : '👤 Usuario'}
                        </span>
                    </div>

                    <div className="profile-info">
                        <div className="info-item">
                            <User size={18} />
                            <span>Nombre: {user.name}</span>
                        </div>
                        <div className="info-item">
                            <Mail size={18} />
                            <span>Email: {user.email}</span>
                        </div>
                        <div className="info-item">
                            <Shield size={18} />
                            <span>Rol: {user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        {isAdmin && (
                            <Link to="/crud" className="profile-btn admin-btn">
                                <Package size={18} />
                                Gestionar Productos
                            </Link>
                        )}
                        <button onClick={handleLogout} className="profile-btn logout-btn">
                            <LogOut size={18} />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Si no está autenticado, mostrar formularios de login/registro
    return (
        <div className="profile-container">
            <div className="auth-card">
                <div className="auth-tabs">
                    <button 
                        className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        <LogIn size={18} />
                        Iniciar Sesión
                    </button>
                    <button 
                        className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        <UserPlus size={18} />
                        Registrarse
                    </button>
                </div>

                {/* Formulario de Login */}
                {activeTab === 'login' && (
                    <form onSubmit={handleLogin} className="auth-form">
                        <h2>Bienvenido de vuelta</h2>
                        <p>Ingresa tus datos para continuar</p>
                        
                        {loginError && <div className="auth-error">{loginError}</div>}
                        
                        <div className="form-group">
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <LogIn size={18} />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        <button type="submit" className="auth-submit-btn" disabled={loginLoading}>
                            {loginLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                )}

                {/* Formulario de Registro */}
                {activeTab === 'register' && (
                    <form onSubmit={handleRegister} className="auth-form">
                        <h2>Crear una cuenta</h2>
                        <p>Regístrate para obtener una mejor experiencia</p>
                        
                        {registerError && <div className="auth-error">{registerError}</div>}
                        
                        <div className="form-group">
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                value={registerName}
                                onChange={(e) => setRegisterName(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <LogIn size={18} />
                            <input
                                type="password"
                                placeholder="Contraseña (mínimo 6 caracteres)"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <LogIn size={18} />
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={registerConfirmPassword}
                                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        <button type="submit" className="auth-submit-btn" disabled={registerLoading}>
                            {registerLoading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};