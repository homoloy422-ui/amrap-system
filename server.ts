import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Twilio Client
  const getTwilioClient = () => {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) return null;
    return twilio(sid, token);
  };

  // WhatsApp API Endpoint
  app.post('/api/whatsapp/send', async (req, res) => {
    const { to, message } = req.body;
    const client = getTwilioClient();
    const from = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!client || !from) {
      return res.status(500).json({ error: 'Twilio not configured' });
    }

    try {
      const response = await client.messages.create({
        body: message,
        from: from, // e.g., 'whatsapp:+14155238886'
        to: `whatsapp:${to}`
      });
      res.json({ success: true, sid: response.sid });
    } catch (error: any) {
      console.error('WhatsApp error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
