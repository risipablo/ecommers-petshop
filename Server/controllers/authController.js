// Server/controllers/authController.js
const User = require('../models/user'); // 
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../config/email');
const { validateEmail, sanitizeUserInput, hasSQLInjection } = require('../middleware/security');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;



const validatePassword = (password) => {
  const minLength = 7;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    return { valid: false, error: 'La contraseña debe tener al menos 7 caracteres' };
  }
  if (!hasUpperCase) {
    return { valid: false, error: 'La contraseña debe tener al menos una mayúscula' };
  }
  if (!hasSpecialChar) {
    return { valid: false, error: 'La contraseña debe tener al menos un carácter especial' };
  }
  return { valid: true };
};

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
    let { name, email, password, confirmPassword } = req.body;
    
        name = sanitizeUserInput(name);
        email = sanitizeUserInput(email);
        
          // Validar email
        if (!validateEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email inválido' 
            });
        }  

      if (hasSQLInjection(name) || hasSQLInjection(email)) {
        console.log(`⚠️ Posible ataque detectado: ${name} | ${email}`);
        return res.status(400).json({ 
          success: false, 
          error: 'Datos inválidos' 
        });
      }    

    // Validar campos
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos los campos son obligatorios' 
      });
    }
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Las contraseñas no coinciden' 
      });
    }
    
    // Validar contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: passwordValidation.error 
      });
    }
    
    // Validar email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email inválido' 
      });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'El email ya está registrado' 
      });
    }
    
    // Determinar rol
    const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';
    
    // Crear usuario
    const user = new User({ name, email, password, role });
    await user.save();
    
    // Generar token
    const token = generateToken(user);
    
    // Configurar cookie
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

// Login
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



// Cambiar nombre de usuario
exports.changeName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    
    console.log('📝 Cambiando nombre:', { userId, name });
    
    if (!name || name.length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'El nombre debe tener al menos 2 caracteres' 
      });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }
    
    console.log('✅ Nombre actualizado:', user.name);
    
    res.json({ 
      success: true, 
      data: user,
      message: 'Nombre actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al cambiar nombre:', error);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id;
    
    console.log('🔐 Cambiando contraseña para usuario:', userId);
    
    // Validar campos
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos los campos son obligatorios' 
      });
    }
    
    // Validar que las nuevas contraseñas coincidan
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Las nuevas contraseñas no coinciden' 
      });
    }
    
    // Validar nueva contraseña
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: passwordValidation.error 
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Verificar contraseña actual
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Contraseña actual incorrecta' 
      });
    }
    
    // Verificar que la nueva contraseña sea diferente
    const isSamePassword = await user.isSamePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'La nueva contraseña debe ser diferente a la actual' 
      });
    }
    
    // Actualizar contraseña
    user.password = newPassword;
    await user.save();
    
    console.log('✅ Contraseña actualizada para usuario:', user.email);
    
    res.json({ 
      success: true, 
      message: 'Contraseña actualizada exitosamente' 
    });
    
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
};



// En forgotPassword, usar sendEmail correctamente:
// Server/controllers/authController.js (forgotPassword)
exports.forgotPassword = async (req, res) => {
  try {
    console.log('📩 Recibida solicitud de recuperación:', req.body);
    
    const { email } = req.body;
    
    if (!email) {
      console.log('❌ Email no proporcionado');
      return res.status(400).json({ 
        success: false, 
        error: 'El email es obligatorio' 
      });
    }
    
    console.log('🔍 Buscando usuario con email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(404).json({ 
        success: false, 
        error: 'No existe una cuenta con este email' 
      });
    }
    
    console.log('✅ Usuario encontrado:', user.email);
    
    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000;
    
    console.log('🔑 Token generado:', resetToken);
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();
    
    console.log('✅ Token guardado en la base de datos');
    
    // Construir URL de recuperación
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    console.log('🔗 URL de recuperación:', resetUrl);
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6d4ba3;">Restablecer Contraseña</h2>
        <p>Hola ${user.name},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #f97316; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Restablecer Contraseña
        </a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
      </div>
    `;
    
    console.log('📧 Enviando email a:', email);
    
    // Verificar que sendEmail existe
    if (typeof sendEmail !== 'function') {
      console.error('❌ sendEmail no es una función');
      return res.status(500).json({ 
        success: false, 
        error: 'Error en la configuración del email' 
      });
    }
    
    const emailSent = await sendEmail(email, 'Restablecer Contraseña - Bambina Petshop', emailHtml);
    
    if (!emailSent) {
      console.error('❌ Error al enviar el email');
      return res.status(500).json({ 
        success: false, 
        error: 'Error al enviar el email de recuperación' 
      });
    }
    
    console.log('✅ Email enviado exitosamente');
    res.json({ 
      success: true, 
      message: 'Se ha enviado un email con las instrucciones' 
    });
    
  } catch (error) {
    console.error('❌ Error en forgotPassword:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Error en el servidor' 
    });
  }
};


// Reset password - crear nueva contraseña con token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmNewPassword } = req.body;
    
    if (!token || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos los campos son obligatorios' 
      });
    }
    
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Las contraseñas no coinciden' 
      });
    }
    
    // Validar nueva contraseña
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: passwordValidation.error 
      });
    }
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token inválido o expirado' 
      });
    }
    
    // Verificar que la nueva contraseña sea diferente a la actual
    const isSamePassword = await user.isSamePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'La nueva contraseña debe ser diferente a la anterior' 
      });
    }
    
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Contraseña actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.' 
    });
    
  } catch (error) {
    console.error('Error en reset password:', error);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/'
    });
    res.json({ success: true, message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al cerrar sesión' });
  }
};

// Obtener perfil del usuario actual
exports.getMe = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'No autenticado' });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password -resetPasswordToken -resetPasswordExpires');
      
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


