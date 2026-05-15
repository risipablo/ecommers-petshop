
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret_key';

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    req.user = null;
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Middleware para requerir autenticación
const requireAuth = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
  console.log('requireAuth - Token recibido:', !!token);
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'No autorizado. Inicia sesión primero.' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('Usuario autenticado:', req.user.email);
    next();
  } catch (error) {
    console.error(' Token inválido:', error.message);
    return res.status(401).json({ 
      success: false, 
      error: 'Token inválido o expirado' 
    });
  }
};
// Middleware para requerir rol de admin
const requireAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, error: 'No autorizado. Token no proporcionado.' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            console.log(`🔒 Acceso denegado: ${decoded.email} intentó acceder a ruta admin`);
            return res.status(403).json({ success: false, error: 'Acceso denegado. Se requieren permisos de administrador.' });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error en requireAdmin:', error);
        return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
    }
};
// Middleware opcional para obtener usuario si existe
const optionalAuth = (req, res, next) => {
  const token = req.cookies?.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

module.exports = { verifyToken, requireAuth, requireAdmin, optionalAuth };