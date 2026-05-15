// Server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../config/email')


const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL 


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
    const { name, email, password, confirmPassword } = req.body;
    
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
// Forgot password - enviar email de recuperación
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'El email es obligatorio' 
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'No existe una cuenta con este email' 
      });
    }
    
    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hora
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();
    
    // Construir URL de recuperación
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // Template HTML del email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Restablecer Contraseña</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #f9fafb;
            border-radius: 12px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background: #722b8f;
            border-radius: 12px 12px 0 0;
            color: white;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            margin-top: 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: #f97316;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 Bambina Petshop</h1>
          </div>
          <div class="content">
            <h2>Hola ${user.name}!</h2>
            <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            </p>
            <p>Este enlace expirará en <strong>1 hora</strong>.</p>
            <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
            <hr />
            <p><strong>Importante:</strong> Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <p style="background: #f3f4f6; padding: 10px; border-radius: 8px; word-break: break-all;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>Bambina Petshop - Tu tienda de mascotas favorita</p>
            <p>© 2024 Bambina Petshop. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Enviar email con Resend
    const emailSent = await sendEmail(email, 'Restablecer Contraseña - Bambina Petshop', emailHtml);
    
    if (!emailSent) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al enviar el email de recuperación' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Se ha enviado un email con las instrucciones para restablecer tu contraseña' 
    });
    
  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
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


