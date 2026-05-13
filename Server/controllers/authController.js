// Server/controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL 

// Generar token JWT
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
            name: user.name, 
            role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Todos los campos son obligatorios' 
            });
        }
        
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email inválido' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                error: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: 'El email ya está registrado' 
            });
        }
        
        const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';
        const user = new User({ name, email, password, role });
        await user.save();
        
        const token = generateToken(user);
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(201).json({ 
            success: true, 
            data: userResponse,
            token,
            message: `Registro exitoso. Rol: ${role}`
        });
        
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, error: 'Error en el servidor' });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email y contraseña son obligatorios' 
            });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                error: 'Credenciales inválidas' 
            });
        }
        
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                error: 'Credenciales inválidas' 
            });
        }
        
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }
        
        user.lastLogin = new Date();
        await user.save();
        
        const token = generateToken(user);
        
        // Configurar cookie segura
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json({ 
            success: true, 
            data: userResponse,
            token,
            message: `Login exitoso. Rol: ${user.role}`
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, error: 'Error en el servidor' });
    }
};

// Logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ success: true, message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al cerrar sesión' });
  }
};

// Obtener perfil del usuario actual
exports.getMe = async (req, res) => {
    try {
        // Obtener token de cookies o headers
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, error: 'No autenticado' });
        }
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
            }
            
            res.json({ success: true, data: user });
        } catch (jwtError) {
            return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
        }
    } catch (error) {
        console.error('Error en getMe:', error);
        res.status(500).json({ success: false, error: 'Error en el servidor' });
    }
};
// Verificar si el usuario es admin
exports.checkAdmin = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    res.json({ success: true, isAdmin, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
};

// Actualizar perfil
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'No autenticado' });
    }
    
    const { name, email } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (email) updates.email = email;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ success: true, data: user, message: 'Perfil actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
};