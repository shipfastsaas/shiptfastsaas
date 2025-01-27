import sgMail from '@sendgrid/mail'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

const createEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShipFast Email</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .content {
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(to right, #FF4B81, #FF8B8B);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      margin: 20px 0;
    }
  </style>
</head>
<body style="background-color: #f4f4f5;">
  <div class="container">
    <div class="header">
      <h1 style="color: #FF4B81;">ShipFast</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p> ${new Date().getFullYear()} ShipFast. All rights reserved.</p>
      <p>This email was sent by ShipFast. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.EMAIL_SERVER_PASSWORD) {
    throw new Error('Missing SendGrid API key')
  }

  // Initialiser SendGrid avec la clé API
  sgMail.setApiKey(process.env.EMAIL_SERVER_PASSWORD)

  try {
    console.log('Configuration email :', {
      to,
      from: process.env.EMAIL_FROM,
      subject,
    })

    const msg = {
      to,
      from: process.env.EMAIL_FROM || 'noreply@shipfastsaas.com',
      subject,
      html: createEmailTemplate(html),
    }

    console.log('Envoi de l\'email...')
    const info = await sgMail.send(msg)
    console.log('Email envoyé avec succès :', {
      statusCode: info[0].statusCode,
      headers: info[0].headers,
    })
    return info
  } catch (error: any) {
    console.error('Erreur détaillée :', {
      message: error.message,
      response: error.response?.body,
      code: error.code,
      stack: error.stack,
    })
    throw new Error(`Failed to send email: ${error.message}`)
  }
}
