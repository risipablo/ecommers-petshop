// pages/profilePage.tsx
import { useState } from 'react';
import { useAuth } from '../context/authProvider';
import { User, Mail, Shield, LogOut, Edit2, Key, Save, X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
    const { user, isAdmin, logout, changeName, changePassword } = useAuth();
    const navigate = useNavigate();
    
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (pass: string) => {
        const errors = [];
        if (pass.length < 7) errors.push('Mínimo 7 caracteres');
        if (!/[A-Z]/.test(pass)) errors.push('Al menos una mayúscula');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) errors.push('Al menos un carácter especial');
        return errors;
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
        if (field === 'newPassword') {
            setPasswordErrors(validatePassword(value));
        }
    };

    const handleChangeName = async () => {
        if (!newName.trim()) {
            setError('El nombre no puede estar vacío');
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            await changeName({ name: newName });
            setSuccess('Nombre actualizado exitosamente');
            setIsEditingName(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setError('Las nuevas contraseñas no coinciden');
            return;
        }
        
        if (passwordErrors.length > 0) {
            setError('Por favor, cumple con todos los requisitos de contraseña');
            return;
        }
        
        if (passwordData.email !== user?.email) {
            setError('El email no coincide con tu cuenta');
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            await changePassword(passwordData);
            setSuccess('Contraseña actualizada exitosamente');
            setIsChangingPassword(false);
            setPasswordData({
                email: '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="profile-container">
                <div className="auth-card">
                    <h2>Inicia sesión para ver tu perfil</h2>
                    <button onClick={() => navigate('/')} className="auth-btn">
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <User size={48} />
                    </div>
                    {!isEditingName ? (
                        <div className="profile-name-section">
                            <h1>{user.name}</h1>
                            <button 
                                className="edit-name-btn"
                                onClick={() => {
                                    setNewName(user.name);
                                    setIsEditingName(true);
                                }}
                            >
                                <Edit2 size={16} />
                                Editar
                            </button>
                        </div>
                    ) : (
                        <div className="profile-name-edit">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                autoFocus
                            />
                            <button onClick={handleChangeName} disabled={loading}>
                                <Save size={16} />
                                Guardar
                            </button>
                            <button onClick={() => setIsEditingName(false)}>
                                <X size={16} />
                                Cancelar
                            </button>
                        </div>
                    )}
                    <p className="profile-email">{user.email}</p>
                    <span className={`profile-role ${user.role === 'admin' ? 'admin' : 'user'}`}>
                        {user.role === 'admin' ? '👑 Administrador' : '👤 Usuario'}
                    </span>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

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
                        <button className="profile-btn admin-btn" onClick={() => navigate('/admin/products')}>
                            <Shield size={18} />
                            Panel de Administración
                        </button>
                    )}
                    
                    <button 
                        className="profile-btn password-btn"
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                    >
                        <Key size={18} />
                        Cambiar Contraseña
                    </button>
                    
                    <button className="profile-btn logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>

                {isChangingPassword && (
                    <div className="change-password-modal">
                        <div className="change-password-content">
                            <h3>Cambiar Contraseña</h3>
                            <form onSubmit={handleChangePassword}>
                                <div className="form-group">
                                    <Mail size={18} />
                                    <input
                                        type="email"
                                        placeholder="Confirmar email"
                                        value={passwordData.email}
                                        onChange={(e) => handlePasswordChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <Lock size={18} />
                                    <input
                                        type="password"
                                        placeholder="Contraseña actual"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <Lock size={18} />
                                    <input
                                        type="password"
                                        placeholder="Nueva contraseña"
                                        value={passwordData.newPassword}
                                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                {passwordErrors.length > 0 && (
                                    <div className="password-requirements">
                                        <p>Requisitos:</p>
                                        {passwordErrors.map((err, i) => (
                                            <span key={i}>• {err}</span>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="form-group">
                                    <Lock size={18} />
                                    <input
                                        type="password"
                                        placeholder="Confirmar nueva contraseña"
                                        value={passwordData.confirmNewPassword}
                                        onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="modal-actions">
                                    <button type="submit" disabled={loading}>
                                        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                                    </button>
                                    <button type="button" onClick={() => setIsChangingPassword(false)}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};