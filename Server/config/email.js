// Server/config/email.js
const { Resend } = require('resend');

// Inicializar Resend con tu API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Bambina Petshop <${process.env.EMAIL_USER || 'onboarding@resend.dev'}>`,
      to: [to],
      subject: subject,
      html: html
    });

    if (error) {
      console.error('Error al enviar email con Resend:', error);
      return false;
    }

    console.log('Email enviado exitosamente:', data);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
};

module.exports = { sendEmail };