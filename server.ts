import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to send lead email
  app.post("/api/send-lead", async (req, res) => {
    const { name, email, whatsapp, summary } = req.body;
    
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not found. Email not sent.");
      return res.status(500).json({ error: "Configuração de e-mail ausente." });
    }

    const resend = new Resend(RESEND_API_KEY);

    try {
      const { data, error } = await resend.emails.send({
        from: "Boris IA <onboarding@resend.dev>",
        to: ["atendimento@niozi.com.br"],
        subject: `Novo Lead Capturado - Boris IA (${name || "Sem Nome"})`,
        html: `
          <h3>Novo Resumo de Conversa - Boris Strategist</h3>
          <p><strong>Nome:</strong> ${name || "Não informado"}</p>
          <p><strong>E-mail:</strong> ${email || "Não informado"}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp || "Não informado"}</p>
          <hr />
          <p><strong>Resumo da conversa:</strong></p>
          <div style="white-space: pre-wrap;">${summary}</div>
        `,
      });

      if (error) {
        return res.status(400).json(error);
      }

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Falha ao enviar e-mail." });
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
