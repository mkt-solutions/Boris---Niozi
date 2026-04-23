import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to send lead email via FormSubmit
  app.post("/api/send-lead", async (req, res) => {
    const { name, email, whatsapp, summary } = req.body;
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/atendimento@niozi.com.br", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `Novo Lead - Boris IA (${name || "Sem Nome"})`,
          Nome: name || "Não informado",
          Email: email || "Não informado",
          WhatsApp: whatsapp || "Não informado",
          Resumo: summary,
          _template: "table",
          _captcha: "false"
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(400).json({ error: "FormSubmit error", details: data });
      }
    } catch (err) {
      console.error("Email Error:", err);
      res.status(500).json({ error: "Falha ao enviar e-mail via FormSubmit." });
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
