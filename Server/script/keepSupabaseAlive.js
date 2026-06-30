// Server/scripts/keepSupabaseAlive.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para mantener activo Supabase
async function keepSupabaseAlive() {
    try {
        console.log(`🔄 ${new Date().toISOString()} - Manteniendo activo Supabase...`);
        
        // 1. Hacer una consulta ligera a la tabla products
        const { data, error, count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });
        
        if (error) {
            console.error('❌ Error al consultar Supabase:', error.message);
            return false;
        }
        
        console.log(`✅ Conexión exitosa. Productos: ${count || 0}`);
        
        // 2. Listar archivos del bucket (solo para mantener activo)
        const { data: files, error: listError } = await supabase.storage
            .from('petshop-images')
            .list('products', { limit: 1 });
        
        if (listError) {
            console.error('❌ Error al listar archivos:', listError.message);
            return false;
        }
        
        console.log(`✅ Bucket accesible. Archivos: ${files?.length || 0}`);
        
        return true;
    } catch (error) {
        console.error('❌ Error en keepSupabaseAlive:', error.message);
        return false;
    }
}


module.exports = { keepSupabaseAlive };

// Si se ejecuta como script independiente
if (require.main === module) {
    console.log(`🚀 Iniciando mantenimiento de Supabase cada 12 horas`);
    keepSupabaseAlive();
    setInterval(keepSupabaseAlive, 12 * 60 * 60 * 1000);
}