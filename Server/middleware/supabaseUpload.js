// middleware/supabaseUpload.js
const supabase = require('../config/supabase');
const path = require('path');

const uploadToSupabase = async (file, folder = 'products') => {
  try {
    if (!file) return null;
    
    // Generar nombre único para evitar colisiones
    const fileExt = path.extname(file.originalname);
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    
    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-image') 
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('product-image')
      .getPublicUrl(fileName);
    
    return {
      url: publicUrl,
      path: fileName
    };
  } catch (error) {
    console.error('Error subiendo a Supabase:', error);
    throw new Error('Error al subir la imagen');
  }
};

const deleteFromSupabase = async (filePath) => {
  try {
    if (!filePath) return;
    
    const { error } = await supabase.storage
      .from('petshop-images')
      .remove([filePath]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error eliminando de Supabase:', error);
    return false;
  }
};

module.exports = { uploadToSupabase, deleteFromSupabase };