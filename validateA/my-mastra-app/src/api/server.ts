import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createMcpAgent } from '../mastra/agents/mcpAgents';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Agent'ı global olarak sakla
let mcpAgent: any = null;

// Agent'ı başlat
async function initializeAgent() {
  try {
    mcpAgent = await createMcpAgent();
    console.log('✅ MCP Agent hazır:', mcpAgent.name);
  } catch (error) {
    console.error('❌ Agent başlatılamadı:', error);
  }
}

// Adres doğrulama ve detay endpoint'i
app.post('/address', async (req:any, res:any) => {
  try {
    if (!mcpAgent) {
      return res.status(503).json({ error: 'Agent henüz hazır değil' });
    }

    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Adres gerekli' });
    }

    // Agent'tan adres bilgisini iste
    const response = await mcpAgent.generate([
      { role: "user", content: `Lütfen bu adresi kontrol et ve geçerli mi, enlem/boylamı ve ayrıntılı  olarak ver: ${address}` }
    ]);

    // Agent'ın döndürdüğü JSON'u parse et
    let data;
    try {
      data = typeof response.text === 'string' ? JSON.parse(response.text) : response.text;
    } catch (e) {
      return res.status(200).json({
        success: false,
        raw: response.text,
        warning: "Agent yanıtı JSON formatında değil, ham metin döndürüldü."
      });
    }

    res.json({
      success: true,
      is_valid: data.is_valid,
      coordinates: data.coordinates,
      input_address: data.input_address,
      raw: response.text,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    res.status(500).json({ 
      error: 'Adres sorgusunda hata oluştu',
      message: error.message 
    });
  }
});



// Server'ı başlat
app.listen(port, async () => {
  console.log(`🌐 API Server çalışıyor: http://localhost:${port}`);
  console.log(`📱 Mobil uygulama için endpoints:`);
  console.log(`   GET  /health - Server durumu`);
  console.log(`   POST /chat - Genel sohbet`);
  console.log(`   POST /temperature - Sıcaklık sorgusu`);
  
  await initializeAgent();
});

export default app; 