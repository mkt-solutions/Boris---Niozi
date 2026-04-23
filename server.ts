import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to send lead email via SMTP
  app.post("/api/send-lead", async (req, res) => {
    const { name, email, whatsapp, summary, tag, transcription } = req.body;
    
    // SMTP Credentials from Environment Variables
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "465");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.error("[SMTP Error] Credenciais ausentes no .env");
      return res.status(500).json({ error: "Configuração SMTP incompleta." });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"Boris IA" <${user}>`,
      to: "atendimento@niozi.com.br",
      subject: `Novo Lead ESTRATÉGICO - Boris IA (${name || "Sem Nome"})`,
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #6d28d9;">Novo Lead Capturado - Boris Strategist</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Nome do Cliente:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${name || 'Não informado'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>E-mail:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${email || 'Não informado'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>WhatsApp:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${whatsapp || 'Não informado'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Qualificação:</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><strong>Lead ${tag}</strong></td></tr>
          </table>
          
          <h3 style="margin-top: 20px; color: #6d28d9;">Principais Pontos / Resumo:</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">${summary}</div>
          
          <h3 style="margin-top: 20px; color: #6d28d9;">Transcrição Completa da Conversa:</h3>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 13px; white-space: pre-wrap;">${transcription}</div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "Email enviado com sucesso via SMTP" });
    } catch (err) {
      console.error("[SMTP Fatal Error]:", err);
      res.status(500).json({ error: "Falha ao enviar e-mail via SMTP.", details: err });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
