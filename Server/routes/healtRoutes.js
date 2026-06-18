// Server/routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const { keepSupabaseAlive } = require('../script/keepSupabaseAlive');

// Endpoint para verificar estado del servidor
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Endpoint para mantener Supabase activo (llamada manual)
router.post('/supabase-keepalive', async (req, res) => {
    try {
        const result = await keepSupabaseAlive();
        res.json({
            success: result,
            message: result ? 'Supabase mantenido exitosamente' : 'Error al mantener Supabase',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint para verificar estado de Supabase
router.get('/supabase-status', async (req, res) => {
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );
        
        const { data, error } = await supabase
            .from('products')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
        
        res.json({
            success: true,
            status: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;