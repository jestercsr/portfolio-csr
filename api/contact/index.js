import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email invalide.' });
  }

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Variables d\'environnement manquantes: EMAIL_USER ou EMAIL_PASS');
      return res.status(500).json({ error: 'Erreur de configuration serveur' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const emailHTML = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8f9fa;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .header {
          background: linear-gradient(135deg, #0e0e98 0%, #06b2e6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.95;
          font-weight: 500;
        }
        .content {
          padding: 40px 30px;
        }
        .message-card {
          background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
          border-left: 4px solid #0e0e98;
          padding: 24px;
          border-radius: 8px;
          margin: 24px 0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }
        .info-item {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .info-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .info-value {
          font-size: 16px;
          font-weight: 500;
          color: #1f2937;
          word-break: break-word;
        }
        .message-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .message-content {
          font-size: 15px;
          line-height: 1.7;
          color: #374151;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .footer {
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          padding: 24px 30px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        .footer p {
          margin: 8px 0;
        }
        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 24px 0;
        }
        .badge {
          display: inline-block;
          background: #0e0e98;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }
        @media (max-width: 600px) {
          .email-wrapper {
            margin: 0;
            border-radius: 0;
          }
          .header {
            padding: 30px 20px;
          }
          .header h1 {
            font-size: 24px;
          }
          .content {
            padding: 30px 20px;
          }
          .info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .footer {
            padding: 20px;
            font-size: 11px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
          <h1>Nouveau Message</h1>
          <p>Vous avez reçu un message via votre formulaire de contact</p>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="badge">Message de Contact</div>

          <!-- Info Grid -->
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Nom</div>
              <div class="info-value">${escapeHtml(name)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">
                <a href="mailto:${escapeHtml(email)}" style="color: #0e0e98; text-decoration: none;">
                  ${escapeHtml(email)}
                </a>
              </div>
            </div>
          </div>

          <!-- Message -->
          <div class="divider"></div>
          <div class="message-label">Message</div>
          <div class="message-card">
            <div class="message-content">${escapeHtml(message)}</div>
          </div>

          <!-- Call to Action -->
          <div class="divider"></div>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; text-align: center; color: #06b2e6;">
            <p style="font-size: 13px; font-weight: 500;">
              Vous pouvez répondre directement à cet email pour contacter l'auteur du message.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="font-weight: 500; color: #1f2937; margin-bottom: 12px;">Portfolio de Jester CESAR</p>
          <p>Message automatique - Ne pas répondre directement à cet email</p>
          <p style="margin-top: 12px; opacity: 0.7;">© ${new Date().getFullYear()} - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      html: emailHTML,
      text: `Nouveau message de contact\n\nNom: ${name}\nEmail: ${email}\n\nMessage:\n${message.replace(/\n/g, '<br>')}`,
    });

    res.status(200).json({ success: true, message: 'Message envoyé avec succès' });
  } catch (err) {
    console.error('Erreur lors de l\'envoi:', err);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du message',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}