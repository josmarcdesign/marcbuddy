import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do transporte SMTP - Atualizado para testes no celular
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true para 465, false para outras portas
  auth: {
    user: 'naoresponda@marcbuddy.com.br',
    pass: 'k2J$$:;@+wEk'
  },
  // Configurações adicionais para Hostinger
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Verifica conexão com servidor SMTP
 */
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Servidor de email conectado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com servidor de email:', error);
    return false;
  }
};

/**
 * Envia email de confirmação de conta
 */
export const sendConfirmationEmail = async (email, userName, confirmationToken) => {
  try {
    const confirmationUrl = `https://10.0.0.104:3000/confirm-email?token=${confirmationToken}`;

    // Caminho para a logo PNG
    const logoPath = path.join(__dirname, 'logo.png');
    const logoBuffer = fs.readFileSync(logoPath);

    const mailOptions = {
      from: {
        name: 'MarcBuddy',
        address: 'naoresponda@marcbuddy.com.br'
      },
      to: email,
      subject: 'Bem-vindo ao MarcBuddy - Confirme sua conta',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bem-vindo ao MarcBuddy</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Poppins', Arial, sans-serif;
              line-height: 1.6;
              color: #011526;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }

            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(1, 21, 38, 0.1);
            }

            .header {
              background: linear-gradient(135deg, #011526 0%, #87c508 100%);
              padding: 50px 40px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }

            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(135, 197, 8, 0.1) 0%, transparent 70%);
              animation: pulse 4s ease-in-out infinite;
            }

            @keyframes pulse {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }

            .logo-text {
              position: relative;
              z-index: 2;
              color: #ffffff;
              font-family: 'Nunito', sans-serif;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
              margin-bottom: 8px;
              text-align: center;
            }

            .tagline {
              position: relative;
              z-index: 2;
              color: rgba(255, 255, 255, 0.9);
              font-family: 'Poppins', sans-serif;
              font-size: 16px;
              font-weight: 400;
            }

            .content {
              padding: 50px 40px;
            }

            .greeting {
              font-family: 'Nunito', sans-serif;
              font-size: 24px;
              font-weight: 600;
              color: #011526;
              margin-bottom: 20px;
            }

            .message {
              font-size: 16px;
              color: #4B5563;
              margin-bottom: 30px;
              line-height: 1.7;
            }

            .highlight {
              color: #87c508;
              font-weight: 600;
            }

            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #87c508 0%, #011526 100%);
              color: #ffffff;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-family: 'Nunito', sans-serif;
              font-weight: 600;
              font-size: 16px;
              text-align: center;
              margin: 30px 0;
              box-shadow: 0 4px 15px rgba(135, 197, 8, 0.3);
              transition: all 0.3s ease;
            }

            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(135, 197, 8, 0.4);
            }

            .warning-box {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 20px;
              margin: 30px 0;
            }

            .warning-title {
              font-weight: 600;
              color: #92400e;
              margin-bottom: 8px;
            }

            .warning-text {
              color: #78350f;
              font-size: 14px;
            }

            .features {
              background-color: #f8fafc;
              border-radius: 8px;
              padding: 25px;
              margin: 30px 0;
            }

            .features-title {
              font-family: 'Nunito', sans-serif;
              font-size: 18px;
              font-weight: 600;
              color: #011526;
              margin-bottom: 20px;
            }

            .features-list {
              list-style: none;
              padding: 0;
            }

            .features-list li {
              display: flex;
              align-items: center;
              margin-bottom: 12px;
              font-size: 15px;
              color: #4B5563;
            }

            .features-list li::before {
              content: '✓';
              color: #87c508;
              font-weight: bold;
              font-size: 18px;
              margin-right: 12px;
              flex-shrink: 0;
            }

            .link-box {
              background-color: #f1f5f9;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 15px;
              margin: 25px 0;
              word-break: break-all;
            }

            .link-text {
              font-family: 'Courier New', monospace;
              font-size: 13px;
              color: #475569;
              line-height: 1.4;
            }

            .footer {
              background-color: #011526;
              padding: 30px 40px;
              text-align: center;
            }

            .footer-text {
              color: #94a3b8;
              font-size: 14px;
              margin-bottom: 10px;
            }

            .footer-brand {
              color: #87c508;
              font-family: 'Nunito', sans-serif;
              font-weight: 700;
              font-size: 16px;
              margin-bottom: 5px;
            }

            .footer-note {
              color: #64748b;
              font-size: 12px;
            }

            @media (max-width: 640px) {
              .container { margin: 10px; border-radius: 8px; }
              .header { padding: 40px 30px; }
              .content { padding: 30px 25px; }
              .greeting { font-size: 20px; }
              .footer { padding: 25px 30px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="cid:marcbuddy-logo" alt="MarcBuddy" class="logo-image">PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4gPHN2ZyBpZD0iQ2FtYWRhXzIiIGRhdGEtbmFtZT0iQ2FtYWRhIDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDY2MS4yOCAxMTYuMjEiPiA8ZGVmcz4gPHN0eWxlPiAuY2xzLTEgeyBmaWxsOiAjRjVGNUY1OyB9IDwvc3R5bGU+IDwvZGVmcz4gPGcgaWQ9IkNhbWFkYV8xLTIiIGRhdGEtbmFtZT0iQ2FtYWRhIDEiPiA8Zz4gPGc+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI1Ny41NSw4NS40NmMtMy42LDAtNi44My0uNy05LjctMi4xLTIuODctMS40LTUuMS0zLjMtNi43LTUuNy0xLjYtMi40LTIuNC01LjEtMi40LTguMSwwLTMuNi45My02LjQ1LDIuOC04LjU1LDEuODctMi4xLDQuOS0zLjYsOS4xLTQuNXM5Ljc3LTEuMzUsMTYuNy0xLjM1aDUuM3Y3LjhoLTUuMmMtMy40LDAtNi4xNS4xOC04LjI1LjU1LTIuMS4zNy0zLjYuOTgtNC41LDEuODUtLjkuODctMS4zNSwyLjA3LTEuMzUsMy42LDAsMS44Ny42NSwzLjQsMS45NSw0LjYsMS4zLDEuMiwzLjE4LDEuOCw1LjY1LDEuOCwxLjkzLDAsMy42NS0uNDUsNS4xNS0xLjM1LDEuNS0uOSwyLjY4LTIuMTMsMy41NS0zLjcuODctMS41NywxLjMtMy4zNSwxLjMtNS4zNXYtMTEuNWMwLTIuOTMtLjY3LTUuMDItMi02LjI1LTEuMzMtMS4yMy0zLjYtMS44NS02LjgtMS44NS0xLjgsMC0zLjc1LjIyLTUuODUuNjUtMi4xLjQzLTQuNDIsMS4xNS02Ljk1LDIuMTUtMS40Ny42Ny0yLjc3LjgyLTMuOS40NS0xLjEzLS4zNy0yLTEuMDMtMi42LTItLjYtLjk3LS45LTIuMDMtLjktMy4ycy4zMy0yLjMsMS0zLjRjLjY3LTEuMSwxLjc3LTEuOTIsMy4zLTIuNDUsMy4xMy0xLjI3LDYuMDgtMi4xMyw4Ljg1LTIuNiwyLjc3LS40Nyw1LjMyLS43LDcuNjUtLjcsNS4xMywwLDkuMzUuNzUsMTIuNjUsMi4yNXM1Ljc4LDMuOCw3LjQ1LDYuOWMxLjY3LDMuMSwyLjUsNy4wOCwyLjUsMTEuOTV2MjIuMmMwLDIuNDctLjYsNC4zNy0xLjgsNS43LTEuMiwxLjMzLTIuOTMsMi01LjIsMnMtNC4wMi0uNjctNS4yNS0yYy0xLjIzLTEuMzMtMS44NS0zLjIzLTEuODUtNS43di0zLjdsLjcuNmMtLjQsMi4yNy0xLjI1LDQuMjItMi41NSw1Ljg1LTEuMywxLjYzLTIuOTUsMi45LTQuOTUsMy44LTIsLjktNC4zLDEuMzUtNi45LDEuMzVaIi8+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMwMS45NSw4NS4yNmMtMi41MywwLTQuNDctLjY3LTUuOC0yLTEuMzMtMS4zMy0yLTMuMjMtMi01Ljd2LTM1LjVjMC0yLjQ3LjY1LTQuMzUsMS45NS01LjY1LDEuMy0xLjMsMy4xMi0xLjk1LDUuNDUtMS45NXM0LjIzLjY1LDUuNSwxLjk1YzEuMjcsMS4zLDEuOSwzLjE4LDEuOSw1LjY1djUuMmgtMWMuOC00LDIuNTctNy4xLDUuMy05LjMsMi43My0yLjIsNi4yNy0zLjQzLDEwLjYtMy43LDEuNjctLjEzLDIuOTUuMjgsMy44NSwxLjI1LjkuOTcsMS4zOCwyLjU1LDEuNDUsNC43NS4xMywyLjA3LS4yOCwzLjctMS4yNSw0LjktLjk3LDEuMi0yLjU4LDEuOTMtNC44NSwyLjJsLTIuMy4yYy0zLjguMzMtNi42MiwxLjQzLTguNDUsMy4zLTEuODMsMS44Ny0yLjc1LDQuNTctMi43NSw4LjF2MTguNmMwLDIuNDctLjY1LDQuMzctMS45NSw1LjdzLTMuMTgsMi01LjY1LDJaIi8+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM1NS44NSw4NS40NmMtNS4zMywwLTkuOTgtMS4wNS0xMy45NS0zLjE1LTMuOTctMi4xLTcuMDItNS4wOC05LjE1LTguOTUtMi4xMy0zLjg3LTMuMi04LjQzLTMuMi0xMy43LDAtMy45My42LTcuNDcsMS44LTEwLjYsMS4yLTMuMTMsMi45NS01LjgsNS4yNS04LDIuMy0yLjIsNS4wOC0zLjg4LDguMzUtNS4wNSwzLjI3LTEuMTcsNi45LTEuNzUsMTAuOS0xLjc1LDIuMDcsMCw0LjI3LjI1LDYuNi43NSwyLjMzLjUsNC42MywxLjM1LDYuOSwyLjU1LDEuMzMuNiwyLjI1LDEuNDUsMi43NSwyLjU1cy42OCwyLjIzLjU1LDMuNGMtLjEzLDEuMTctLjU1LDIuMi0xLjI1LDMuMXMtMS41OCwxLjUtMi42NSwxLjhjLTEuMDcuMy0yLjI3LjEyLTMuNi0uNTUtMS4yNy0uNzMtMi41OC0xLjI3LTMuOTUtMS42LTEuMzctLjMzLTIuNjUtLjUtMy44NS0uNS0yLDAtMy43Ny4zMi01LjMuOTUtMS41NC42My0yLjgyLDEuNTMtMy44NSwyLjctMS4wMywxLjE3LTEuODMsMi42Mi0yLjQsNC4zNS0uNTcsMS43My0uODUsMy43My0uODUsNiwwLDQuNCwxLjA4LDcuODUsMy4yNSwxMC4zNSwyLjE3LDIuNSw1LjIyLDMuNzUsOS4xNSwzLjc1LDEuMiwwLDIuNDctLjE1LDMuOC0uNDUsMS4zMy0uMywyLjY3LS44Miw0LTEuNTUsMS4zMy0uNjcsMi41My0uODMsMy42LS41LDEuMDcuMzMsMS45Mi45NSwyLjU1LDEuODUuNjMuOSwxLDEuOTMsMS4xLDMuMS4xLDEuMTctLjEsMi4zLS42LDMuNC0uNSwxLjEtMS4zOCwxLjk1LTIuNjUsMi41NS0yLjI3LDEuMTMtNC41MywxLjk1LTYuOCwyLjQ1LTIuMjcuNS00LjQzLjc1LTYuNS43NVoiLz4gPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjIxLjE1LDI3LjQ4Yy0yLjUxLDAtNC43MSwxLjMyLTUuOTYsMy4zaDBzLTE5LjQ2LDMwLjg5LTE5LjQ2LDMwLjg5bC0yNy41NS00NC45N2gwYy0xLjI0LTIuMDItMy40Ni0zLjM3LTYuMDEtMy4zNy0zLjg5LDAtNy4wNSwzLjE2LTcuMDUsNy4wNXY1OC45NWMwLDMuODksMy4xNiw3LjA1LDcuMDUsNy4wNXM3LjA1LTMuMTYsNy4wNS03LjA1di0zMy45NGwyMC40MiwzMy4zM2gwYzEuMjQsMi4wMiwzLjQ2LDMuMzcsNi4wMSwzLjM3czQuNzEtMS4zMiw1Ljk2LTMuM2gwczEyLjUtMTkuODMsMTIuNS0xOS44M3YyNy40MmMwLDMuODksMy4xNiw3LjA1LDcuMDUsNy4wNXM3LjA1LTMuMTYsNy4wNS03LjA1di01MS44NGMwLTMuODktMy4xNi03LjA1LTcuMDUtNy4wNVoiLz4gPC9nPiA8Zz4gPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTIxLjkxLDgxLjQ2YzAsLjMzLDAsLjY2LS4wMS45OS0uMTksNi42Ny0yLjI1LDEyLjg3LTUuNjksMTguMDgtLjk0LDEuNDMtMS45OCwyLjc5LTMuMTIsNC4wNi0yLjQ0LDIuNzQtNS4zMSw1LjA5LTguNSw2Ljk0LTMuNTMsMi4wNS03LjQ1LDMuNS0xMS42Miw0LjItMS44OS4zMi0zLjgzLjQ5LTUuODEuNDloLTUyLjQxYy0zLjk2LDAtNy44NS0uNjctMTEuNTEtMS45Ni00LjI2LTEuNDktOC4yMS0zLjgxLTExLjYyLTYuODUtLjQ5LS40NC0uOTgtLjg5LTEuNDUtMS4zNi0uNDctLjQ3LS45My0uOTUtMS4zNi0xLjQ1LTUuNjYtNi4zNS04LjgxLTE0LjU4LTguODEtMjMuMTNWNS44MUMwLDIuNiwyLjYsMCw1LjgxLDBjMS42MSwwLDMuMDYuNjYsNC4xMSwxLjcxbC4xOS4xOSwxLjUxLDEuNTEsOC4xOSw4LjIxLDMuNDQsMy40NCwxMS42MiwxMS42NiwxMS42MiwxMS42NS4yNi4yNiwxMS4zNy0xMi41LDEuNTEtMS42NmMxLjA2LTEuMTcsMi41OS0xLjksNC4zLTEuOSwzLjIxLDAsNS44MSwyLjYsNS44MSw1LjgxdjQxLjU3YzAsMS4zMS0uNDMsMi41MS0xLjE2LDMuNDgtLjksMS4yLTIuMjUsMi4wNC0zLjgxLDIuMjctLjI3LjA0LS41NS4wNi0uODMuMDYtMy4yLDAtNS44Mi0yLjY5LTUuODItNS44OXYtMjYuNDZzLTMsMy4zLTMsMy4zbC0zLjgxLDQuMThoMHMtLjA2LjA3LS4wNi4wN2MtLjA3LjA4LS4xNS4xNi0uMjMuMjQtMS4yNSwxLjIzLTIuOTEsMS43OC00LjUyLDEuNjUtMS4zNC0uMS0yLjY1LS42Ni0zLjY2LTEuNjlsLS4wMy0uMDMtNC4xOS00LjIxLS4yMS0uMjEtMy41Mi0zLjUzLTExLjYyLTExLjY1LTExLjYyLTExLjY2djYxLjU5YzAsNi4xNCwyLjQ0LDEyLjAyLDYuNzcsMTYuMzYsMS40NSwxLjQ2LDMuMDksMi43LDQuODUsMy43MSwzLjQ3LDEuOTksNy40NCwzLjA2LDExLjUxLDMuMDZoNTIuNDFjMi4wMSwwLDMuOTUtLjI2LDUuODEtLjc0LDQuNTctMS4xOCw4LjYtMy43MywxMS42Mi03LjE5LDMuNTUtNC4wNiw1LjctOS4zOSw1LjctMTUuMjFzLTIuMTUtMTEuMTQtNS43LTE1LjIxYy0zLjAyLTMuNDYtNy4wNS02LjAxLTExLjYyLTcuMTktMS44MS0uNDctMy42OS0uNzMtNS42NC0uNzQsMCwwLS4wMiwwLS4wMywwdDAsMGgwczAsMCwwLDBoLS4xMXMtLjA5LDAtLjEzLDBoLS4xMWMtLjQxLS4wMi0uODEtLjA4LTEuMjEtLjE4LTItLjUyLTMuNjYtMi4wOC00LjE5LTQuMjMtLjA5LS4zNC0uMTQtLjY4LS4xNi0xLjAydi0uODFjLjE3LTIuNDUsMS44OS00LjYxLDQuMzktNS4yNC4xMS0uMDQuMjEtLjA4LjMyLS4xMy4wMSwwLC4wMywwLC4wNS0uMDIsMi43MS0xLjEyLDUuMDQtMi44NCw2Ljg3LTQuOTcsMi44MS0zLjI3LDQuNDMtNy40OSw0LjQzLTExLjkzLDAtLjc1LS4wNS0xLjUyLS4xNC0yLjI4LS40Ni0zLjY4LTItNy4wMS00LjI5LTkuNjctMi44OS0zLjM2LTYuOTgtNS42NS0xMS42Mi02LjIzaC00NC41NmMtMS4yMywwLTIuNDItLjQ5LTMuMjktMS4zNkwyMy4yNCwwaDU4LjExYzQuMTkuMzYsOC4xMiwxLjU2LDExLjYyLDMuNDEsMy44NiwyLjAzLDcuMjEsNC44NSw5LjgzLDguMjEuNjQuODIsMS4yNCwxLjY4LDEuNzksMi41NiwyLjY5LDQuMjksNC4yOCw5LjI2LDQuNDIsMTQuNDcsMCwuMjQsMCwuNDgsMCwuNzN2LjAyYzAsLjQxLDAsLjgyLS4wMywxLjIzLS4yMyw1LjE4LTEuODksOS44LTQuNCwxMy43Mi0uNTIuODEtMS4wOCwxLjYtMS42NiwyLjM2LS43NC45NC0xLjUzLDEuODQtMi4zNiwyLjY5LDEuMzkuNTgsMi43MywxLjI1LDQuMDIsMiw0LjY4LDIuNzEsOC42NiwyLjQ5LDExLjYyLDExLDMuNDQsNS4yMiw1LjUsMTEuNDIsNS42OSwxOC4wOCwwLC4zMy4wMS42Ni4wMS45OVoiLz4gPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODcuMTYsODEuOTdjMCwxLjY1LS42OSwzLjE0LTEuNzksNC4yLS4xMy4xMi0uMjYuMjMtLjM5LjM0LTEuMTcsMS4wMy0yLjM4LDEuOTctMy42MywyLjg0LTMuNjIsMi41Mi03LjU0LDQuMzgtMTEuNjIsNS41OC0uMzguMTItLjc2LjIyLTEuMTQuMzItLjcyLjE5LTEuNDMuMzYtMi4xNi41MWgwYy0yLjY1LjU1LTUuMzQuODQtOC4wMy44NS0uMDMsMC0uMDYsMC0uMDksMC0uMDcsMC0uMTMsMC0uMiwwaC0uMTJzLS4wNywwLS4xMiwwYy0uMDIsMC0uMDQsMC0uMDcsMC0uNjUsMC0xLjMtLjAyLTEuOTUtLjA2LTEuMS0uMDYtMi4yMS0uMTctMy4zMS0uMzItMi4wNS0uMjgtNC4wNy0uNzItNi4wNy0xLjMyLTQuMDgtMS4yMS04LjAxLTMuMDgtMTEuNjItNS42MS0xLjExLS43Ny0yLjE4LTEuNi0zLjIzLTIuNS0uNC0uMzQtLjc5LS42OS0xLjE4LTEuMDUtMS4wMy0xLjItMS41OS0yLjgyLTEuMzYtNC41Ny4zNC0yLjU4LDIuNDItNC42NSw1LTQuOTgsMS44Ny0uMjQsMy41OS40MSw0LjgsMS41OSwyLjMyLDIuMDMsNC44OCwzLjYyLDcuNTgsNC43OSwxLjk2Ljg1LDMuOTksMS40Nyw2LjA2LDEuODcsMS42OC4zMywzLjM3LjUsNS4wOC41MywwLDAsMCwuMDIsMCwuMDMuMTYtLjAxLjMzLS4wMi40OS0uMDIsMi4wNSwwLDQuMS0uMjEsNi4xLS42NCwxLjc5LS4zOCwzLjU2LS45Myw1LjI3LTEuNjYuMDgtLjAzLjE3LS4wNy4yNS0uMTEsMi43Mi0xLjE4LDUuMy0yLjc5LDcuNjMtNC44My4wMi0uMDIuMDQtLjA0LjA3LS4wNiwxLjAzLS45NSwyLjQxLTEuNTMsMy45Mi0xLjUzLDMuMjEsMCw1LjgxLDIuNiw1LjgxLDUuODFaIi8+IDwvZz4gPGc+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ5Mi41Miw0Mi4wNXYzNS41YzAsNS4wNy0yLjQzLDcuNi03LjMsNy42LTIuMzMsMC00LjE3LS42NS01LjUtMS45NS0xLjI5LTEuMjYtMS45Ni0zLjA2LTEuOTktNS40Mi0xLjI3LDIuMDEtMi44NCwzLjY0LTQuNzEsNC44Ny0yLjc0LDEuOC01Ljk3LDIuNy05LjcsMi43LTQuMTMsMC03LjU3LS43Ny0xMC4zLTIuMy0yLjc0LTEuNTMtNC43NS0zLjgyLTYuMDUtNi44NS0xLjMtMy4wMy0xLjk1LTYuODUtMS45NS0xMS40NXYtMzIuNmMwLTMuNywzLTYuNyw2LjctNi43aDEuN2MzLjcsMCw2LjcsMyw2LjcsNi43djMyLjljMCwyLjg3LjYsNS4wMywxLjgsNi41LDEuMiwxLjQ3LDMuMDcsMi4yLDUuNiwyLjIsMi45MywwLDUuMzItMS4wMiw3LjE1LTMuMDUsMS44My0yLjAzLDIuNzUtNC43MiwyLjc1LTguMDV2LTIwLjZjMC0yLjUzLjY3LTQuNDMsMi01LjcsMS4zMy0xLjI3LDMuMTctMS45LDUuNS0xLjksMi40NywwLDQuMzUuNjMsNS42NSwxLjksMS4zLDEuMjcsMS45NSwzLjE3LDEuOTUsNS43WiIvPiA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01NDkuMTIsMTQuOTVjLTEuMzQtMS4yNy0zLjItMS45LTUuNi0xLjlzLTQuMzMuNjMtNS42LDEuOWMtMS4yNywxLjI3LTEuOSwzLjE3LTEuOSw1Ljd2MjEuMjhjLTEuMTItMS45Mi0yLjc1LTMuNTQtNC45LTQuODgtMy0xLjg3LTYuNDMtMi44LTEwLjMtMi44LTQuMjcsMC04LjAyLDEuMDMtMTEuMjUsMy4xcy01Ljc1LDUtNy41NSw4LjhjLTEuOCwzLjgtMi43LDguMzMtMi43LDEzLjZzLjksOS44MywyLjcsMTMuN2MxLjgsMy44Nyw0LjMyLDYuODIsNy41NSw4Ljg1LDMuMjMsMi4wMyw2Ljk4LDMuMDUsMTEuMjUsMy4wNSwzLjkzLDAsNy40Mi0uOTcsMTAuNDUtMi45LDIuMTQtMS4zNiwzLjc2LTMuMDYsNC44NS01LjF2LjJjMCwyLjQ3LjY1LDQuMzUsMS45NSw1LjY1czMuMTgsMS45NSw1LjY1LDEuOTVjMi4zMywwLDQuMTUtLjY1LDUuNDUtMS45NSwxLjMtMS4zLDEuOTUtMy4xOCwxLjk1LTUuNjVWMjAuNjVjMC0yLjUzLS42Ny00LjQzLTItNS43Wk01MzQuODIsNjcuODVjLS45MywyLjEzLTIuMiwzLjcyLTMuOCw0Ljc1LTEuNiwxLjAzLTMuNSwxLjU1LTUuNywxLjU1LTMuMiwwLTUuOC0xLjE3LTcuOC0zLjVzLTMtNS45Ny0zLTEwLjljMC0zLjIuNDUtNS44NywxLjM1LTgsLjktMi4xMywyLjE2LTMuNywzLjgtNC43LDEuNjMtMSwzLjUyLTEuNSw1LjY1LTEuNSwzLjI3LDAsNS45LDEuMTUsNy45LDMuNDVzMyw1Ljg4LDMsMTAuNzVjMCwzLjI3LS40Nyw1Ljk3LTEuNCw4LjFaIi8+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTYwMi45MiwyMy4xNWgtMS43Yy0zLjcsMC02LjcsMy02LjcsNi43djEyLjA4Yy0xLjEyLTEuOTItMi43NS0zLjU0LTQuOS00Ljg4LTMtMS44Ny02LjQ0LTIuOC0xMC4zLTIuOC00LjI3LDAtOC4wMiwxLjAzLTExLjI1LDMuMS0zLjI0LTIuMDctNS43NSw1LTcuNTUsOC44LTEuOCwzLjgtMi43LDguMzMtMi43LDEzLjZzLjksOS44MywyLjcsMTMuN2MxLjgsMy44Nyw0LjMxLDYuODIsNy41NSw4Ljg1LDMuMjMsMi4wMyw2Ljk4LDMuMDUsMTEuMjUsMy4wNSwzLjkzLDAsNy40MS0uOTcsMTAuNDUtMi45LTIuMTQtMS4zNiwzLjc2LTMuMDYsNC44NS01LjF2LjJjMCwyLjQ3LjY1LDQuMzUsMS45NSw1LjY1czMuMTgsMS45NSw1LjY1LDEuOTVjMi4zMywwLDQuMTUtLjY1LDUuNDUtMS45NSwxLjMtMS4zLDEuOTUtMy4xOCwxLjk1LTUuNjVWMjkuODVjMC0zLjctMy02LjctNi43LTYuN1pNNTkzLjMyLDY3Ljg1Yy0uOTQsMi4xMy0yLjIsMy43Mi0zLjgsNC43NS0xLjYsMS4wMy0zLjUsMS41NS01LjcsMS41NS0zLjIsMC01LjgtMS4xNy03LjgtMy41cy0zLTUuOTctMy0xMC45YzAtMy4yLjQ1LTUuODcsMS4zNS04MC45LTIuMTMsMi4xNi0zLjcsMy44LTQuNywxLjYzLTEsMy41MS0xLjUsNS42NS0xLjUsMy4yNiwwLDUuOSwxLjE1LDcuOSwzLjQ1czMsNS44OCwzLDEwLjc1YzAsMy4yNy0uNDcsNS45Ny0xLjQsOC4xWiIvPiA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MzQuMzUsNTQuMzVjLS4zNC0uNTEtLjcyLS45OS0xLjEzLTEuNDUtMi4xMi0yLjQtNC45LTQuMDktOC4zNS01LjA1LDIuODEtMS4xMSw1LjEzLTIuNzgsNi45NS01LC4wMy0uMDMuMDUtLjA3LjA4LS4xLDIuMzUtMi45MSwzLjUyLTYuNDUsMy41Mi0xMC42LDAtMy43My0uOTMtNi45Ny0yLjgtOS43cy00LjUzLTQuODUtOC02LjM1Yy0zLjQ3LTEuNS03LjczLTIuMjUtMTIuOC0yLjI1aC0yNC4yYy0yLjYsMC00LjYuNy02LDIuMS0xLjQsMS40LTIuMSwzLjQzLTIuMSw2LjF2NTQuMWMwLDIuNjcuNyw0LjcsMi4xLDYuMXMzLjQsMi4xLDYsMi4xaDI1LjNjNy42LDAsMTMuNTUtMS43NSwxNy44NS01LjI1LDQuMy0zLjUsNi40NS04LjM1LDYuNDUtMTQuNTUsMC00LjAxLS45NS03LjQxLTIuODctMTAuMlpNNDE5LjYyLDcwLjVjLTEuODcsMS41LTQuNzcsMi4yNS04LjcsMi4yNWgtMTYuNVYyNS40NWgxNC43YzMuODcsMCw2LjczLjcyLDguNiwyLjE1LDEuODcsMS40MywyLjgsMy42MiwyLjgsNi41NXMtLjkzLDUuMDItMi44LDYuNDVjLTEuODcsMS40My00LjczLDIuMTUtOC42LDIuMTVoLjljLTMuNDUsMC02LjIsMy4wMi01Ljc1LDYuNTYuMzcsMi45MiwzLDUuMDQsNS45NSw1LjA0aC43YzMuOTMsMCw2LjgzLjc1LDguNywyLjI1czIuOCwzLjg1LDIuOCw3LjA1LS45Myw1LjM1LTIuOCw2Ljg1WiIvPiA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02NjAuNzMsNTIuMDhsLTEzLjM3LDMxLjAzLTcuNDYsMTcuMzFjLS4zLjY5LS43MSwxLjMxLTEuMTksMS44NC0xLjg3LDIuMDctNC45MiwyLjgzLTcuNjIsMS42NmwtMS41Ni0uNjdjLTMuNC0xLjQ2LTQuOTctNS40LTMuNS04Ljc5bDQuOTgtMTEuNTctMTUuMDMtMzcuODFjLTEuMzctMy40NC4zMS03LjMzLDMuNzUtOC43bDEuNTgtLjYzYzMuNDMtMS4zNyw3LjMzLjMxLDguNywzLjc1bDkuNDUsMjMuNzcsNy40LTE3LjE2YzEuNDYtMy40LDUuNDEtNC45Nyw4LjgtMy41bDEuNTcuNjdjMy4zOSwxLjQ2LDQuOTYsNS40MSwzLjUsOC44WiIvPiA8L2c+IDwvZz4gPC9nPiA8L3N2Zz4=" alt="MarcBuddy" class="logo-image">>
              </div>
              <div class="tagline">Ferramentas profissionais para designers</div>
            </div>

            <div class="content">
              <div class="greeting">Olá ${userName}!</div>

              <div class="message">
                <p>Seja muito bem-vindo ao <span class="highlight">MarcBuddy</span>!</p>
                <p>Estamos empolgados para ter você conosco nesta jornada criativa. Para garantir a segurança da sua conta e começar a usar todas as nossas ferramentas, confirme seu email clicando no botão abaixo:</p>
              </div>

              <a href="${confirmationUrl}" class="cta-button">Confirmar Minha Conta</a>

              <div class="warning-box">
                <div class="warning-title">Importante</div>
                <div class="warning-text">Este link é válido por 24 horas. Se você não solicitou este cadastro, ignore este email.</div>
              </div>

              <div class="features">
                <div class="features-title">Com o MarcBuddy você terá acesso a:</div>
                <ul class="features-list">
                  <li>Extração inteligente de paletas de cores</li>
                  <li>Compressão otimizada de imagens</li>
                  <li>Renomeação em lote de arquivos</li>
                  <li>Interface intuitiva e profissional</li>
                  <li>Suporte técnico especializado</li>
                </ul>
              </div>

              <p style="font-size: 14px; color: #6B7280; margin-bottom: 15px;">
                Se o botão não funcionar, copie e cole este link no seu navegador:
              </p>

              <div class="link-box">
                <div class="link-text">${confirmationUrl}</div>
              </div>
            </div>

            <div class="footer">
              <div class="footer-brand">MarcBuddy</div>
              <div class="footer-text">© 2025 MarcBuddy. Todos os direitos reservados.</div>
              <div class="footer-note">Este é um email automático, por favor não responda.</div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Olá ${userName}!

        Seja bem-vindo ao MarcBuddy!

        Para confirmar sua conta, acesse: ${confirmationUrl}

        Este link é válido por 24 horas.

        Com o MarcBuddy você terá acesso a:
        - Extração inteligente de paletas de cores
        - Compressão otimizada de imagens
        - Renomeação em lote de arquivos
        - Interface intuitiva e profissional
        - Suporte técnico especializado

        Atenciosamente,
        Equipe MarcBuddy
      `,
      attachments: [
        {
          filename: 'logo.png',
          content: logoBuffer,
          cid: 'marcbuddy-logo', // Este será o identificador usado no HTML
          contentType: 'image/png'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmação enviado:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Erro ao enviar email de confirmação:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envia email de recuperação de senha
 */
export const sendPasswordResetEmail = async (email, userName, resetToken) => {
  try {
    const resetUrl = `https://10.0.0.104:3000/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: {
        name: 'MarcBuddy',
        address: 'naoresponda@marcbuddy.com.br'
      },
      to: email,
      subject: 'Redefina sua senha - MarcBuddy',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redefinir senha</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Poppins', Arial, sans-serif;
              line-height: 1.6;
              color: #011526;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }

            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(1, 21, 38, 0.1);
            }

            .header {
              background: linear-gradient(135deg, #011526 0%, #87c508 100%);
              padding: 50px 40px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }

            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
              animation: pulse 4s ease-in-out infinite;
            }

            @keyframes pulse {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }

            .logo-container {
              position: relative;
              z-index: 2;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 8px;
            }

            .logo-image {
              height: 32px;
              width: auto;
              max-width: 200px;
            }

            .tagline {
              position: relative;
              z-index: 2;
              color: rgba(255, 255, 255, 0.9);
              font-family: 'Poppins', sans-serif;
              font-size: 16px;
              font-weight: 400;
            }

            .content {
              padding: 50px 40px;
            }

            .greeting {
              font-family: 'Nunito', sans-serif;
              font-size: 24px;
              font-weight: 600;
              color: #011526;
              margin-bottom: 20px;
            }

            .message {
              font-size: 16px;
              color: #4B5563;
              margin-bottom: 30px;
              line-height: 1.7;
            }

            .highlight {
              color: #87c508;
              font-weight: 600;
            }

            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              color: #ffffff;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-family: 'Nunito', sans-serif;
              font-weight: 600;
              font-size: 16px;
              text-align: center;
              margin: 30px 0;
              box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
              transition: all 0.3s ease;
            }

            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
            }

            .security-box {
              background-color: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 8px;
              padding: 20px;
              margin: 30px 0;
            }

            .security-title {
              font-weight: 600;
              color: #991b1b;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
            }

            .security-title::before {
              content: '🔒';
              margin-right: 8px;
            }

            .security-text {
              color: #7f1d1d;
              font-size: 14px;
              line-height: 1.5;
            }

            .link-box {
              background-color: #f1f5f9;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 15px;
              margin: 25px 0;
              word-break: break-all;
            }

            .link-text {
              font-family: 'Courier New', monospace;
              font-size: 13px;
              color: #475569;
              line-height: 1.4;
            }

            .help-text {
              background-color: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 8px;
              padding: 20px;
              margin: 30px 0;
            }

            .help-title {
              font-weight: 600;
              color: #166534;
              margin-bottom: 8px;
            }

            .help-content {
              color: #14532d;
              font-size: 14px;
              line-height: 1.5;
            }

            .footer {
              background-color: #011526;
              padding: 30px 40px;
              text-align: center;
            }

            .footer-text {
              color: #94a3b8;
              font-size: 14px;
              margin-bottom: 10px;
            }

            .footer-brand {
              color: #87c508;
              font-family: 'Nunito', sans-serif;
              font-weight: 700;
              font-size: 16px;
              margin-bottom: 5px;
            }

            .footer-note {
              color: #64748b;
              font-size: 12px;
            }

            @media (max-width: 640px) {
              .container { margin: 10px; border-radius: 8px; }
              .header { padding: 40px 30px; }
              .content { padding: 30px 25px; }
              .greeting { font-size: 20px; }
              .footer { padding: 25px 30px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="cid:marcbuddy-logo" alt="MarcBuddy" class="logo-image">PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4gPHN2ZyBpZD0iQ2FtYWRhXzIiIGRhdGEtbmFtZT0iQ2FtYWRhIDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDY2MS4yOCAxMTYuMjEiPiA8ZGVmcz4gPHN0eWxlPiAuY2xzLTEgeyBmaWxsOiAjRjVGNUY1OyB9IDwvc3R5bGU+IDwvZGVmcz4gPGcgaWQ9IkNhbWFkYV8xLTIiIGRhdGEtbmFtZT0iQ2FtYWRhIDEiPiA8Zz4gPGc+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI1Ny41NSw4NS40NmMtMy42LDAtNi44My0uNy05LjctMi4xLTIuODctMS40LTUuMS0zLjMtNi43LTUuNy0xLjYtMi40LTIuNC01LjEtMi40LTguMSwwLTMuNi45My02LjQ1LTIuOC04LjU1LDEuODctMi4xLDQuOS0zLjYsOS4xLTQuNXM5Ljc3LTEuMzUsMTYuNy0xLjM1aDUuM3Y3LjhoLTUuMmMtMy40LDAtNi4xNS4xOC04LjI1LjU1LTIuMS4zNy0zLjYuOTgtNC41LDEuODUtLjkuODctMS4zNSwyLjA3LTEuMzUsMy42LDAsMS44Ny42NSwzLjQsMS45NSw0LjYsMS4zLDEuMiwzLjE4LDEuOCw1LjY1LDEuOCwxLjkzLDAsMy42NS0uNDUsNS4xNS0xLjM1LDEuNS0uOSwyLjY4LTIuMTMsMy41NS0zLjcuODctMS41NywxLjMtMy4zNSwxLjMtNS4zNXYtMTEuNWMwLTIuOTMtLjY3LTUuMDItMi02LjI1LTEuMzMtMS4yMy0zLjYtMS44NS02LjgtMS44NS0xLjgsMC0zLjc1LjIyLTUuODUuNjUtMi4xLjQzLTQuNDIsMS4xNS02Ljk1LTIuMTUtMS40Ny42Ny0yLjc3LjgyLTMuOS40NS0xLjEzLS4zNy0yLTEuMDMtMi42LTItLjYtLjk3LS45LTIuMDMtLjktMy4ycy4zMy0yLjMsMS0zLjRjLjY3LTEuMSwxLjc3LTEuOTIsMy4zLTIuNDUsMy4xMy0xLjI3LDYuMDgtMi4xMyw4Ljg1LTIuNiwyLjc3LS40Nyw1LjMyLS43LDcuNjUtLjcsNS4xMywwLDkuMzUuNzUsMTIuNjUsMi4yNXM1Ljc4LDMuOCw3LjQ1LDYuOWMxLjY3LDMuMSwyLjUsNy4wOCwyLjUsMTEuOTV2MjIuMmMwLDIuNDctLjYsNC4zNy0xLjgsNS43LTEuMiwxLjMzLTIuOTMsMi01LjIsMnMtNC4wMi0uNjctNS4yNS0yYy0xLjIzLTEuMzMtMS44NS0zLjIzLTEuODUtNS43di0zLjdsLjcuNmMtLjQsMi4yNy0xLjI1LDQuMjItMi41NSw1Ljg1LTEuMywxLjYzLTIuOTUsMi45LTQuOTUsMy44LTIsLjktNC4zLDEuMzUtNi45LDEuMzVaIi8+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMwMS45NSw4NS4yNmMtMi41MywwLTQuNDctLjY3LTUuOC0yLTEuMzMtMS4zMy0yLTMuMjMtMi01Ljd2LTM1LjVjMC0yLjQ3LjY1LTQuMzUsMS45NS01LjY1LDEuMy0xLjMsMy4xMi0xLjk1LDUuNDUtMS45NXM0LjIzLjY1LDUuNSwxLjk1YzEuMjcsMS4zLDEuOSwzLjE4LDEuOSw1LjY1djUuMmgtMWMuOC00LDIuNTctNy4xLDUuMy05LjMsMi43My0yLjIsNi4yNy0zLjQzLDEwLjYtMy43LDEuNjctLjEzLDIuOTUuMjgsMy44NSwxLjI1LjkuOTcsMS4zOCwyLjU1LDEuNDUsNC43NS4xMywyLjA3LS4yOCwzLjctMS4yNSw0LjktLjk3LDEuMi0yLjU4LDEuOTMtNC44NSwyLjJsLTIuMy4yYy0zLjguMzMtNi42MiwxLjQzLTguNDUsMy4zLTEuODMsMS44Ny0yLjc1LDQuNTctMi43NSw4LjF2MTguNmMwLDIuNDctLjY1LDQuMzctMS45NSw1LjdzLTMuMTgsMi01LjY1LDJaIi8+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM1NS44NSw4NS40NmMtNS4zMywwLTkuOTgtMS4wNS0xMy45NS0zLjE1LTMuOTctMi4xLTcuMDItNS4wOC05LjE1LTguOTUtMi4xMy0zLjg3LTMuMi04LjQzLTMuMi0xMy43LDAtMy45My42LTcuNDcsMS44LTEwLjYsMS4yLTMuMTMsMi45NS01LjgsNS4yNS04LDIuMy0yLjIsNS4wOC0zLjg4LDguMzUtNS4wNSwzLjI3LTEuMTcsNi45LTEuNzUsMTAuOS0xLjc1LDIuMDcsMCw0LjI3LjI1LDYuNi43NSwyLjMzLjUsNC42MywxLjM1LDYuOSwyLjU1LDEuMzMuNiwyLjI1LDEuNDUsMi43NSwyLjU1cy42OCwyLjIzLjU1LDMuNGMtLjEzLDEuMTctLjU1LDIuMi0xLjI1LDMuMXMtMS41OCwxLjUtMi42NSwxLjhjLTEuMDcuMy0yLjI3LjEyLTMuNi0uNTUtMS4yNy0uNzMtMi41OC0xLjI3LTMuOTUtMS42LTEuMzctLjMzLTIuNjUtLjUtMy44NS0uNS0yLDAtMy43Ny4zMi01LjMuOTUtMS41NC42My0yLjgyLDEuNTMtMy44NSwyLjctMS4wMywxLjE3LTEuODMsMi42Mi0yLjQsNC4zNS0uNTcsMS43My0uODUsMy43My0uODUsNiwwLDQuNCwxLjA4LDcuODUsMy4yNSwxMC4zNSwyLjE3LDIuNSw1LjIyLDMuNzUsOS4xNSwzLjc1LDEuMiwwLDIuNDctLjE1LDMuOC0uNDUsMS4zMy0uMywyLjY3LS44Miw0LTEuNTUsMS4zMy0uNjcsMi41My0uODMsMy42LS41LDEuMDcuMzMsMS45Mi45NSwyLjU1LDEuODUuNjMuOSwxLDEuOTMsMS4xLDMuMS4xLDEuMTctLjEsMi4zLS42LDMuNC0uNSwxLjEtMS4zOCwxLjk1LTIuNjUsMi41NS0yLjI3LDEuMTMtNC41MywxLjk1LTYuOCwyLjQ1LTIuMjcuNS00LjQzLjc1LTYuNS43NVoiLz4gPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjIxLjE1LDI3LjQ4Yy0yLjUxLDAtNC43MSwxLjMyLTUuOTYsMy4zaDBzLTE5LjQ2LDMwLjg5LTE5LjQ2LDMwLjg5bC0yNy41NS00NC45N2gwYy0xLjI0LTIuMDItMy40Ni0zLjM3LTYuMDEtMy4zNy0zLjg5LDAtNy4wNSwzLjE2LTcuMDUsNy4wNXY1OC45NWMwLDMuODksMy4xNiw3LjA1LDcuMDUsNy4wNXM3LjA1LTMuMTYsNy4wNS03LjA1di0zMy45NGwyMC40MiwzMy4zM2gwYzEuMjQsMi4wMiwzLjQ2LDMuMzcsNi4wMSwzLjM3czQuNzEtMS4zMiw1Ljk2LTMuM2gwczEyLjUtMTkuODMsMTIuNS0xOS44M3YyNy40MmMwLDMuODksMy4xNiw3LjA1LDcuMDUsNy4wNXM3LjA1LTMuMTYsNy4wNS03LjA1di01MS44NGMwLTMuODktMy4xNi03LjA1LTcuMDUtNy4wNVoiLz4gPC9nPiA8Zz4gPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTIxLjkxLDgxLjQ2YzAsLjMzLDAsLjY2LS4wMS45OS0uMTksNi42Ny0yLjI1LDEyLjg3LTUuNjksMTguMDgtLjk0LDEuNDMtMS45OCwyLjc5LTMuMTIsNC4wNi0yLjQ0LDIuNzQtNS4zMSw1LjA5LTguNSw2Ljk0LTMuNTMsMi4wNS03LjQ1LDMuNS0xMS42Miw0LjItMS44OS4zMi0zLjgzLjQ5LTUuODEuNDloLTUyLjQxYy0zLjk2LDAtNy44NS0uNjctMTEuNTEtMS45Ni00LjI2LTEuNDktOC4yMS0zLjgxLTExLjYyLTYuODUtLjQ5LS40NC0uOTgtLjg5LTEuNDUtMS4zNi0uNDctLjQ3LS45My0uOTUtMS4zNi0xLjQ1LTUuNjYtNi4zNS04LjgxLTE0LjU4LTguODEtMjMuMTNWNS44MUMwLTIuNiwyLjYsMCw1LjgxLDBjMS42MSwwLDMuMDYuNjYsNC4xMSwxLjcxbC4xOS4xOSwxLjUxLDEuNTEsOC4xOSw4LjIxLDMuNDQsMy40NCwxMS42MiwxMS42NiwxMS42MiwxMS42NS4yNi4yNiwxMS4zNy0xMi41LDEuNTEtMS42NmMxLjA2LTEuMTcsMi41OS0xLjksNC4zLTEuOSwzLjIxLDAsNS44MSwyLjYsNS44MSw1LjgxdjQxLjU3YzAsMS4zMS0uNDMsMi41MS0xLjE2LDMuNDgtLjksMS4yLTIuMjUsMi4wNC0zLjgxLDIuMjctLjI3LjA0LS41NS4wNi0uODMuMDYtMy4yLDAtNS44Mi0yLjY5LTUuODItNS44OXYtMjYuNDZzLTMsMy4zLTMsMy4zbC0zLjgxLDQuMThoMHMtLjA2LjA3LS4wNi4wN2MtLjA3LjA4LS4xNS4xNi0uMjMuMjQtMS4yNSwxLjIzLTIuOTEsMS43OC00LjUyLDEuNjUtMS4zNC0uMS0yLjY1LS42Ni0zLjY2LTEuNjlsLS4wMy0uMDMtNC4xOS00LjIxLS4yMS0uMjEtMy41Mi0zLjUzLTExLjYyLTExLjY1LTExLjYyLTExLjY2djYxLjU5YzAsNi4xNCwyLjQ0LDEyLjAyLDYuNzcsMTYuMzYsMS40NSwxLjQ2LDMuMDksMi43LDQuODUsMy43MSwzLjQ3LDEuOTksNy40NCwzLjA2LDExLjUxLDMuMDZoNTIuNDFjMi4wMSwwLDMuOTUtLjI2LDUuODEtLjc0LDQuNTctMS4xOCw4LjYtMy43MywxMS42Mi03LjE5LDMuNTUtNC4wNiw1LjctOS4zOSw1LjctMTUuMjFzLTIuMTUtMTEuMTQtNS43LTE1LjIxYy0zLjAyLTMuNDYtNy4wNS02LjAxLTExLjYyLTcuMTktMS44MS0uNDctMy42OS0uNzMtNS42NC0uNzQsMCwwLS4wMiwwLS4wMywwdDAsMGgwczAsMCwwLDBoLS4xMXMtLjA5LDAtLjEzLDBoLS4xMWMtLjQxLS4wMi0uODEtLjA4LTEuMjEtLjE4LTItLjUyLTMuNjYtMi4wOC00LjE5LTQuMjMtLjA5LS4zNC0uMTQtLjY4LS4xNi0xLjAydi0uODFjLjE3LTIuNDUsMS44OS00LjYxLDQuMzktNS4yNC4xMS0uMDQuMjEtLjA4LjMyLS4xMy4wMSwwLC4wMywwLC4wNS0uMDIsMi43MS0xLjEyLDUuMDQtMi44NCw2Ljg3LTQuOTcsMi44MS0zLjI3LDQuNDMtNy40OSw0LjQzLTExLjkzLDAtLjc1LS4wNS0xLjUyLS4xNC0yLjI4LS40Ni0zLjY4LTItNy4wMS00LjI5LTkuNjctMi44OS0zLjM2LTYuOTgtNS42NS0xMS42Mi02LjIzaC00NC41NmMtMS4yMywwLTIuNDItLjQ5LTMuMjktMS4zNkwyMy4yNCwwaDU4LjExYzQuMTkuMzYsOC4xMiwxLjU2LDExLjYyLDMuNDEsMy44NiwyLjAzLDcuMjEsNC44NSw5LjgzLDguMjEuNjQuODIsMS4yNCwxLjY4LDEuNzksMi41NiwyLjY5LDQuMjksNC4yOCw5LjI2LDQuNDIsMTQuNDcsMCwuMjQsMCwuNDgsMCwuNzN2LjAyYzAsLjQxLDAsLjgyLS4wMywxLjIzLS4yMyw1LjE4LTEuODksOS44LTQuNCwxMy43Mi0uNTIuODEtMS4wOCwxLjYtMS42NiwyLjM2LS43NC45NC0xLjUzLDEuODQtMi4zNiwyLjY5LDEuMzkuNTgsMi43MywxLjI1LDQuMDIsMiw0LjY4LTIuNzEsOC42NiwyLjQ5LDExLjYyLDExLDMuNDQsNS4yMiwxLjUsMTEuNDIsNS42OSwxOC4wOCwwLC4zMy4wMS42Ni4wMS45OVoiLz4gPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODcuMTYsODEuOTdjMCwxLjY1LS42OSwzLjE0LTEuNzksNC4yLS4xMy4xMi0uMjYuMjMtLjM5LjM0LTEuMTcsMS4wMy0yLjM4LDEuOTctMy42MywyLjg0LTMuNjIsMi41Mi03LjU0LDQuMzgtMTEuNjIsNS41OC0uMzguMTItLjc2LjIyLTEuMTQuMzItLjcyLjE5LTEuNDMuMzYtMi4xNi41MWgwYy0yLjY1LjU1LTUuMzQuODQtOC4wMy44NS0uMDMsMC0uMDYsMC0uMDksMC0uMDcsMC0uMTMsMC0uMiwwaC0uMTJzLS4wNywwLS4xMiwwYy0uMDIsMC0uMDQsMC0uMDcsMC0uNjUsMC0xLjMtLjAyLTEuOTUtLjA2LTEuMS0uMDYtMi4yMS0uMTctMy4zMS0uMzItMi4wNS0uMjgtNC4wNy0uNzItNi4wNy0xLjMyLTQuMDgtMS4yMS04LjAxLTMuMDgtMTEuNjItNS42MS0xLjExLS43Ny0yLjE4LTEuNi0zLjIzLTIuNS0uNC0uMzQtLjc5LS42OS0xLjE4LTEuMDUtMS4wMy0xLjItMS41OS0yLjgyLTEuMzYtNC41Ny4zNC0yLjU4LTIuNDItNC42NSw1LTQuOTgsMS44Ny0uMjQsMy41OS40MSw0LjgsMS41OSwyLjMyLDIuMDMsNC44OCwzLjYyLDcuNTgsNC43OSwxLjk2Ljg1LDMuOTksMS40Nyw2LjA2LDEuODcsMS42OC4zMywzLjM3LjUsNS4wOC41MywwLDAsMCwuMDIsMCwuMDMuMTYtLjAxLjMzLS4wMi40OS0uMDIsMi4wNSwwLDQuMS0uMjEsNi4xLS42NCwxLjc5LS4zOCwzLjU2LS45Myw1LjI3LTEuNjYuMDgtLjAzLjE3LS4wNy4yNS0uMTEsMi43Mi0xLjE4LDUuMy0yLjc5LDcuNjMtNC44My4wMi0uMDIuMDQtLjA0LjA3LS4wNiwxLjAzLS45NSwyMjQxLTEuNTMsMy45Mi0xLjUzLDMuMjEsMCw1LjgxLDIuNiw1LjgxLDUuODFaIi8+IDwvZz4gPGc+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ5Mi41Miw0Mi4wNXYzNS41YzAsNS4wNy0yLjQzLDcuNi03LjMsNy42LTIuMzMsMC00LjE3LS42NS01LjUtMS45NS0xLjI5LTEuMjYtMS45Ni0zLjA2LTEuOTktNS40Mi0xLjI3LDIuMDEtMi44NCwzLjY0LTQuNzEsNC44Ny0yLjc0LDEuOC01Ljk3LDIuNy05LjcsMi43LTQuMTMsMC03LjU3LS43Ny0xMC4zLTIuMy0yLjc0LTEuNTMtNC43NS0zLjgyLTYuMDUtNi44NS0xLjMtMy4wMy0xLjk1LTYuODUtMS45NS0xMS40NXYtMzIuNmMwLTMuNywzLTYuNyw2LjctNi43aDEuN2MzLjcsMCw2LjcsMyw2LjcsNi43djMyLjljMCwyLjg3LjYsNS4wMywxLjgsNi41LDEuMiwxLjQ3LDMuMDcsMi4yLDUuNiwyLjIsMi45MywwLDUuMzItMS4wMiw3LjE1LTMuMDUsMS44My0yLjAzLTIuNzUtNC43MiwyLjc1LTguMDV2LTIwLjZjMC0yLjUzLjY3LTQuNDMsMi01LjcsMS4zMy0xLjI3LDMuMTctMS45LDUuNS0xLjksMi40NywwLDQuMzUuNjMsNS42NSwxLjksMS4zLDEuMjcsMS45NSwzLjE3LDEuOTUsNS43WiIvPiA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01NDkuMTIsMTQuOTVjLTEuMzQtMS4yNy0zLjItMS45LTUuNi0xLjlzLTQuMzMuNjMtNS42LDEuOWMtMS4yNywxLjI3LTEuOSwzLjE3LTEuOSw1Ljd2MjEuMjhjLTEuMTItMS45Mi0yLjc1LTMuNTQtNC45LTQuODgtMy0xLjg3LTYuNDMtMi44LTEwLjMtMi44LTQuMjcsMC04LjAyLDEuMDMtMTEuMjUsMy4xcy01Ljc1LDUtNy41NSw4LjhjLTEuOCwzLjgtMi43LDguMzMtMi43LDEzLjZzLjksOS44MywyLjcsMTMuN2MxLjgsMy44Nyw0LjMyLDYuODIsNy41NSw4Ljg1LDMuMjMsMi4wMyw2Ljk4LDMuMDUsMTEuMjUsMy4wNSwzLjkzLDAsNy40Mi0uOTcsMTAuNDUtMi45LTIuMTQtMS4zNiwzLjc2LTMuMDYsNC44NS01LjF2LjJjMCwyLjQ3LjY1LDQuMzUsMS45NSw1LjY1czMuMTgsMS45NSw1LjY1LDEuOTVjMi4zMywwLDQuMTUtLjY1LDUuNDUtMS45NSwxLjMtMS4zLDEuOTUtMy4xOCwxLjk1LTUuNjVWMjAuNjVjMC0yLjUzLS42Ny00LjQzLTItNS43Wk01MzQuODIsNjcuODVjLS45MywyLjEzLTIuMiwzLjcyLTMuOCw0Ljc1LTEuNiwxLjAzLTMuNSwxLjU1LTUuNywxLjU1LTMuMiwwLTUuOC0xLjE3LTcuOC0zLjVzLTMtNS45Ny0zLTEwLjljMC0zLjIuNDUtNS44NywxLjM1LTgsLjktMi4xMywyLjE2LTMuNywzLjgtNC43LDEuNjMtMSwzLjUyLTEuNSw1LjY1LTEuNSwzLjI3LDAsNS45LDEuMTUsNy45LDMuNDVzMyw1Ljg4LDMsMTAuNzVjMCwzLjI3LS40Nyw1Ljk3LTEuNCw4LjFaIi8+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTYwMi45MiwyMy4xNWgtMS43Yy0zLjcsMC02LjcsMy02LjcsNi43djEyLjA4Yy0xLjEyLTEuOTItMi43NS0zLjU0LTQuOS00Ljg4LTMtMS44Ny02LjQ0LTIuOC0xMC4zLTIuOC00LjI3LDAtOC4wMiwxLjAzLTExLjI1LDMuMS0zLjI0LTIuMDctNS43NSw1LTcuNTUsOC44LTEuOCwzLjgtMi43LDguMzMtMi43LDEzLjZzLjksOS44MywyLjcsMTMuN2MxLjgsMy44Nyw0LjMxLDYuODIsNy41NSw4Ljg1LDMuMjMsMi4wMyw2Ljk4LDMuMDUsMTEuMjUsMy4wNSwzLjkzLDAsNy40MS0uOTcsMTAuNDUtMi45LTIuMTQtMS4zNiwzLjc2LTMuMDYsNC44NS01LjF2LjJjMCwyLjQ3LjY1LDQuMzUsMS45NSw1LjY1czMuMTgsMS45NSw1LjY1LDEuOTVjMi4zMywwLDQuMTUtLjY1LDUuNDUtMS45NSwxLjMtMS4zLDEuOTUtMy4xOCwxLjk1LTUuNjVWMjkuODVjMC0zLjctMy02LjctNi43LTYuN1pNNTkzLjMyLDY3Ljg1Yy0uOTQsMi4xMy0yLjIsMy43Mi0zLjgsNC43NS0xLjYsMS4wMy0zLjUsMS41NS01LjcsMS41NS0zLjIsMC01LjgtMS4xNy03LjgtMy41cy0zLTUuOTctMy0xMC45YzAtMy4yLjQ1LTUuODcsMS4zNS04MC45LTIuMTMsMi4xNi0zLjcsMy44LTQuNywxLjYzLTEsMy41MS0xLjUsNS42NS0xLjUsMy4yNiwwLDUuOSwxLjE1LDcuOSwzLjQ1czMsNS44OCwzLDEwLjc1YzAsMy4yNy0uNDcsNS45Ny0xLjQsOC4xWiIvPiA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MzQuMzUsNTQuMzVjLS4zNC0uNTEtLjcyLS45OS0xLjEzLTEuNDUtMi4xMi0yLjQtNC45LTQuMDktOC4zNS01LjA1LTIuODEtMS4xMSw1LjEzLTIuNzgsNi45NS01LC4wMy0uMDMuMDUtLjA3LjA4LS4xLDIuMzUtMi45MSwzLjUyLTYuNDUsMy41Mi0xMC42LDAtMy43My0uOTMtNi45Ny0yLjgtOS43cy00LjUzLTQuODUtOC02LjM1Yy0zLjQ3LTEuNS03LjczLTIuMjUtMTIuOC0yLjI1aC0yNC4yYy0yLjYsMC00LjYuNy02LDIuMS0xLjQsMS40LTIuMSwzLjQzLTIuMSw2LjF2NTQuMWMwLDIuNjcuNyw0LjcsMi4xLDYuMXMzLjQsMi4xLDYsMi4xaDI1LjNjNy42LDAsMTMuNTUtMS43NSwxNy44NS01LjI1LDQuMy0zLjUsNi40NS04LjM1LDYuNDUtMTQuNTUsMC00LjAxLS45NS03LjQxLTIuODctMTAuMlpNNDE5LjYyLDcwLjVjLTEuODcsMS41LTQuNzcsMi4yNS04LjcsMi4yNWgtMTYuNVYyNS40NWgxNC43YzMuODcsMCw2LjczLjcyLDguNiwyLjE1LDEuODcsMS40MywyLjgsMy42MiwyLjgsNi41NXMtLjkzLDUuMDItMi44LDYuNDVjLTEuODcsMS40My00LjczLTIuMTUtOC42LTIuMTVoLjljLTMuNDUsMC02LjIsMy4wMi01Ljc1LDYuNTYuMzcsMi45MiwzLDUuMDQsNS45NSw1LjA0aC43YzMuOTMsMCw2LjgzLjc1LDguNywyLjI1czIuOCwzLjg1LTIuOCw3LjA1LS45Myw1LjM1LTIuOCw2Ljg1WiIvPiA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02NjAuNzMsNTIuMDhsLTEzLjM3LDMxLjAzLTcuNDYsMTcuMzFjLS4zLjY5LS43MSwxLjMxLTEuMTksMS44NC0xLjg3LDIuMDctNC45MiwyLjgzLTcuNjIsMS42NmwtMS41Ni0uNjdjLTMuNC0xLjQ2LTQuOTctNS40LTMuNS04Ljc5bDQuOTgtMTEuNTctMTUuMDMtMzcuODFjLTEuMzctMy40NC4zMS03LjMzLDMuNzUtOC43bDEuNTgtLjYzYzMuNDMtMS4zNyw3LjMzLjMxLDguNywzLjc1bDkuNDUsMjMuNzcsNy40LTE3LjE2YzEuNDYtMy40LDUuNDEtNC45Nyw4LjgtMy41bDEuNTcuNjdjMy4zOSwxLjQ2LDQuOTYsNS40MSwzLjUsOC44WiIvPiA8L2c+IDwvZz4gPC9nPiA8L3N2Zz4=" alt="MarcBuddy" class="logo-image">>
              </div>
              <div class="tagline">Recuperação de conta segura</div>
            </div>

            <div class="content">
              <div class="greeting">Olá ${userName}!</div>

              <div class="message">
                <p>Recebemos uma solicitação para redefinir a senha da sua conta no <span class="highlight">MarcBuddy</span>.</p>
                <p>Para criar uma nova senha segura, clique no botão abaixo:</p>
              </div>

              <a href="${resetUrl}" class="cta-button">Redefinir Minha Senha</a>

              <div class="security-box">
                <div class="security-title">Informações de Segurança</div>
                <div class="security-text">
                  • Este link é válido por apenas 15 minutos<br>
                  • Pode ser usado apenas uma vez<br>
                  • Não compartilhe este email com ninguém
                </div>
              </div>

              <div class="help-text">
                <div class="help-title">Não solicitou esta alteração?</div>
                <div class="help-content">
                  Se você não pediu para redefinir sua senha, ignore este email.
                  Sua senha permanecerá a mesma e sua conta está segura.
                </div>
              </div>

              <p style="font-size: 14px; color: #6B7280; margin-bottom: 15px;">
                Se o botão não funcionar, copie e cole este link no seu navegador:
              </p>

              <div class="link-box">
                <div class="link-text">${resetUrl}</div>
              </div>

              <p style="font-size: 14px; color: #6B7280; text-align: center; margin-top: 30px;">
                Precisa de ajuda? Entre em contato com nosso suporte.
              </p>
            </div>

            <div class="footer">
              <div class="footer-brand">MarcBuddy</div>
              <div class="footer-text">© 2025 MarcBuddy. Todos os direitos reservados.</div>
              <div class="footer-note">Este é um email automático, por favor não responda.</div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Olá ${userName}!

        Recebemos uma solicitação para redefinir sua senha no MarcBuddy.

        Para criar uma nova senha, acesse: ${resetUrl}

        Este link é válido por 15 minutos.

        Se não solicitou esta alteração, ignore este email.

        Atenciosamente,
        Equipe MarcBuddy
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de recuperação enviado:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Erro ao enviar email de recuperação:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envia email genérico (para notificações futuras)
 */
export const sendEmail = async (to, subject, htmlContent, textContent = null) => {
  try {
    const mailOptions = {
      from: {
        name: 'MarcBuddy',
        address: 'naoresponda@marcbuddy.com.br'
      },
      to: to,
      subject: subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
};

export default {
  verifyEmailConnection,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendEmail
};