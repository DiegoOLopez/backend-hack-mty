// Importación del módulo nodemailer para el envío de correos electrónicos
const nodemailer = require('nodemailer');

// Carga de variables de entorno desde un archivo .env
require('dotenv').config();

// Función para enviar un correo electrónico de verificación
const sendVerificationEmail = async (email, token) => {
  try {
    // Configuración del transportador de nodemailer utilizando el servicio de Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // Usuario de Gmail (correo electrónico)
        pass: process.env.EMAIL_PASSWORD // Contraseña de Gmail
      }
    });

    // Construcción del enlace de verificación utilizando el token proporcionado
    const verificationLink = `https://cdj-edutech-eac.up.railway.app/${token}`;

    // Configuración de las opciones del correo electrónico
    const mailOptions = {
      from: `"Soporte - CDJ EduTech" <${process.env.EMAIL_USER}>`, // Remitente del correo
      to: email, // Destinatario del correo
      subject: 'Confirmación de cuenta - Verificación requerida', // Asunto del correo
      html: `
      <p>Estimado usuario,</p>

      <p>Gracias por registrarte en <strong> CDJ EduTech</strong>. Para completar tu registro y activar tu cuenta, es necesario verificar tu dirección de correo electrónico.</p>

      <p>Por favor, haz clic en el siguiente enlace para confirmar tu cuenta:</p>

      <p style="text-align: center;">
      <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Verificar mi cuenta
      </a>
      </p>
      <br>
      <p>Si no solicitaste esta verificación, puedes ignorar este mensaje.</p>

      <p>Atentamente,<br>
      El equipo de <strong>CDJ EduTech</strong></p>
      ` // Contenido HTML del correo
    };

    // Envío del correo electrónico utilizando el transportador configurado
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de verificación enviado:', info.response); // Registro del resultado del envío
  } catch (error) {
    console.error('Error al enviar email de verificación:', error); // Manejo de errores en caso de fallo en el envío
  }
};

// Exportación de la función sendVerificationEmail para su uso en otros módulos
module.exports = { sendVerificationEmail };