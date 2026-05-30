// Server/middleware/security.js (corregido)
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const compression = require('compression');

// Configuración de Helmet
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.googleapis.com", "https://*.gstatic.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://*.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:", "http:", "https://*.supabase.co"],
            connectSrc: ["'self'", "https://*.supabase.co", "https://*.render.com"],
            fontSrc: ["'self'", "https://*.gstatic.com"],
            frameSrc: ["'self'", "https://www.google.com"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Rate limiting general
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

// Rate limiting específico para login/register
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Demasiados intentos de autenticación, por favor intenta más tarde',
    skipSuccessfulRequests: true,
});

// Rate limiting para API
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 500,
    message: 'Límite de peticiones alcanzado',
});

// Sanitización manual
const sanitizeInput = (req, res, next) => {
    // Sanitizar body (solo si existe)
    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].replace(/[$]/g, '_');
            }
        }
    }
    
    // Sanitizar query (solo si existe)
    if (req.query && typeof req.query === 'object') {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].replace(/[$]/g, '_');
            }
        }
    }
    
    // Sanitizar params (solo si existe)
    if (req.params && typeof req.params === 'object') {
        for (const key in req.params) {
            if (typeof req.params[key] === 'string') {
                req.params[key] = req.params[key].replace(/[$]/g, '_');
            }
        }
    }
    
    next();
};

// Prevención XSS manual
const preventXSS = (req, res, next) => {
    const sanitize = (str) => {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    };
    
    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitize(req.body[key]);
            }
        }
    }
    
    if (req.query && typeof req.query === 'object') {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitize(req.query[key]);
            }
        }
    }
    
    next();
};

// Prevención de Parameter Pollution
const preventHPP = hpp();

// Compresión
const enableCompression = compression();

// Validación de email
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Sanitizar input de usuario
const sanitizeUserInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .trim()
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
};

// Filtro de SQL Injection
const hasSQLInjection = (str) => {
    if (typeof str !== 'string') return false;
    const sqlPatterns = [
        /(\bSELECT\b.*\bFROM\b)/i,
        /(\bINSERT\b.*\bINTO\b)/i,
        /(\bUPDATE\b.*\bSET\b)/i,
        /(\bDELETE\b.*\bFROM\b)/i,
        /(\bDROP\b.*\bTABLE\b)/i,
        /(\bUNION\b.*\bSELECT\b)/i,
        /(--)/,
        /(;)/,
        /('.*OR.*'.*=.*')/i
    ];
    return sqlPatterns.some(pattern => pattern.test(str));
};

// 🔥 Middleware para detectar ataques (corregido)
const detectAttack = (req, res, next) => {
    const suspiciousFields = ['username', 'user', 'login', 'password', 'email', 'search'];
    
    // Verificar que req.body existe antes de usarlo
    if (req.body && typeof req.body === 'object') {
        for (const field of suspiciousFields) {
            const value = req.body[field];
            if (value && typeof value === 'string' && hasSQLInjection(value)) {
                console.log(`⚠️ Posible ataque detectado en body.${field}: ${value}`);
                return res.status(400).json({ 
                    success: false, 
                    error: 'Solicitud inválida' 
                });
            }
        }
    }
    
    // Verificar que req.query existe antes de usarlo
    if (req.query && typeof req.query === 'object') {
        for (const field of suspiciousFields) {
            const value = req.query[field];
            if (value && typeof value === 'string' && hasSQLInjection(value)) {
                console.log(`⚠️ Posible ataque detectado en query.${field}: ${value}`);
                return res.status(400).json({ 
                    success: false, 
                    error: 'Solicitud inválida' 
                });
            }
        }
    }
    
    next();
};

// Verificar origen de la petición
const checkOrigin = (req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://ecommers-petshop.vercel.app'
    ];
    
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
        console.log(`⚠️ Origen no autorizado: ${origin}`);
        return res.status(403).json({ success: false, error: 'Acceso no autorizado' });
    }
    next();
};

module.exports = {
    securityHeaders,
    generalLimiter,
    authLimiter,
    apiLimiter,
    sanitizeInput,
    preventXSS,
    preventHPP,
    enableCompression,
    validateEmail,
    sanitizeUserInput,
    detectAttack,
    checkOrigin,
    hasSQLInjection
};