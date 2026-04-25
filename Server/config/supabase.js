// config/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Verificar que las variables de entorno existan
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_KEY');
  console.error('Asegúrate de tener un archivo .env con ambas variables');
  process.exit(1); 
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Función para probar la conexión
async function testSupabaseConnection() {
  try {
    console.log('🔄 Probando conexión a Supabase...');
    console.log(`📡 URL: ${supabaseUrl}`);
    
    // Intenta hacer una consulta simple a la tabla 'products'
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      
      if (error.code === '42P01') {
        console.log('Conexión exitosa, pero la tabla "products" no existe aún');
        console.log(' Ejecuta el SQL para crear la tabla primero');
      } else {
        console.error('Error al conectar con Supabase:', error.message);
      }
    } else {
      console.log('Conexión exitosa a Supabase');
      console.log('Tabla "products" encontrada y accesible');
    }
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  }
}

// Ejecutar prueba de conexión
testSupabaseConnection();

module.exports = supabase;