const express = require('express');
const cookieParser = require('cookie-parser');
const DB = require('./config/database');
const productRoutes = require('./routes/routerProducts');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healtRoutes');
require('dotenv').config();


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


const { keepSupabaseAlive } = require('./script/keepSupabaseAlive');

const app = express();


DB();


app.use(enableCompression);


app.use(securityHeaders);


app.use(corsOptions);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


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
app.use('/api', healthRoutes);

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
    console.error(' Error:', err.stack);
    
    const errorMessage = process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message;
    
    res.status(500).json({ 
        success: false, 
        error: errorMessage 
    });
});

const port = process.env.PORT || 3001;

// Iniciar servidor
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
    
    // Iniciar mantenimiento de Supabase automáticamente
    console.log('🔄 Iniciando mantenimiento de Supabase...');
    
    // Ejecutar inmediatamente
    keepSupabaseAlive();
    
    // Programar cada 12 horas 
    const INTERVAL_MS = 12 * 60 * 60 * 1000;
    setInterval(keepSupabaseAlive, INTERVAL_MS);
    console.log(` Mantenimiento de Supabase programado cada 12 horas`);
});

// Manejar cierre graceful
process.on('SIGTERM', () => {
    console.log(' Recibido SIGTERM, cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log(' Recibido SIGINT, cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});