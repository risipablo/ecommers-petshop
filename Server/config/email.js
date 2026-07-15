// Server/config/email.js
const { Resend } = require('resend');

console.log('📧 Configurando Resend...');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  console.log('📧 Enviando email a:', to);
  console.log('📧 Asunto:', subject);
  
  try {
    const { data, error } = await resend.emails.send({
      from: `Bambina Petshop <onboarding@resend.dev>`,
      to: [to],
      subject: subject,
      html: html
    });

    if (error) {
      console.error('❌ Error de Resend:', error);
      return false;
    }

    console.log('✅ Email enviado:', data);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return false;
  }
};

module.exports = { sendEmail };