// Server/controllers/contactController.js
const { sendEmail } = require('../config/email');

exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message, reason } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    let subject = '';
    let emoji = '';
    
    switch (reason) {
      case 'sugerencia':
        subject = 'Sugerencia';
        emoji = '💡';
        break;
      case 'queja':
        subject = 'Queja / Reclamo';
        emoji = '⚠️';
        break;
      default:
        subject = 'Consulta';
        emoji = '📝';
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
        <div style="background: #722b8f; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">${emoji} Nuevo mensaje</h2>
        </div>
        <div style="padding: 20px;">
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Tipo:</strong> ${subject}</p>
          <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <p style="margin: 0; font-weight: bold;">💬 Mensaje:</p>
            <p style="margin: 10px 0 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #6b7280; text-align: center; margin-top: 20px;">
            Enviado desde el formulario de contacto
          </p>
        </div>
      </div>
    `;

    await sendEmail('bambinapetshop86@gmail.com', `${emoji} Nuevo mensaje de ${name}`, emailHtml);

    res.status(200).json({ message: 'Mensaje enviado con éxito' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
};