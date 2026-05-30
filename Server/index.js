
const express = require('express');
const cookieParser = require('cookie-parser');
const DB = require('./config/database');
const productRoutes = require('./routes/routerProducts');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

// Importar middlewares de seguridad
const {
    securityHeaders,
    generalLimiter,
    apiLimiter,
    sanitizeInput,
    preventXSS,
    preventHPP,
    enableCompression,
    detectAttack,
    checkOrigin
} = require('./middleware/security');

const corsOptions = require('./config/cors');

const app = express();

// Conectar a DB
DB();

// 1. Compresión (primero)
app.use(enableCompression);

// 2. Security Headers
app.use(securityHeaders);

// 3. CORS
app.use(corsOptions);

// 4. Parsers ANTES de los sanitizers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Sanitización y seguridad (DESPUÉS de los parsers)
app.use(sanitizeInput);
app.use(preventXSS);
app.use(preventHPP);
app.use(detectAttack);
app.use(checkOrigin);

// 6. Rate limiting (después de sanitizar)
app.use('/api', generalLimiter);
app.use('/api/auth', apiLimiter);

// 7. Logging (solo desarrollo)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`📡 ${req.method} ${req.url} - ${req.ip}`);
        next();
    });
}

// 8. Rutas
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);


// 9. Ruta de health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// 10. Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Ruta no encontrada' 
    });
});

// 11. Manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    
    const errorMessage = process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message;
    
    res.status(500).json({ 
        success: false, 
        error: errorMessage 
    });
});

const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en el puerto ${port}`);
    console.log(`🔒 Modo: ${process.env.NODE_ENV || 'development'}`);
});