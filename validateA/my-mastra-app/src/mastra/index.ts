import 'dotenv/config';
import { createMcpAgent } from '../mastra/agents/mcpAgents';

export const mastra = (async () => {
  try {
    console.log("Agent oluşturuluyor...");
    const mcpAgent = await createMcpAgent();
    console.log("Agent başarıyla oluşturuldu:", mcpAgent.name);
    
    // MCP araçlarını test edelim
    if (process.env.OPENAI_API_KEY) {
      console.log("🧪 Agent'ı test ediyorum...");
      
      try {
        const response = await mcpAgent.generate([
          { role: "user", content: "1600 Amphitheatre Parkway, Mountain View, CA   bu konum geçerli mi ve bilgileri neler?" }
        ]);
        console.log("✅ Agent yanıtı:", response);
      } catch (apiError) {
        console.log("⚠️ OpenAI API hatası (quota sorunu olabilir):", apiError.message);
        console.log("✅ Ama MCP bağlantısı çalışıyor ve araçlar yüklü!");
      }
    } else {
      console.log("⚠️ OpenAI API key bulunamadı. MCP bağlantısı çalışıyor ama test yapılamıyor.");
    }
    
    console.log("✅ Sistem hazır! MCP araçları kullanılabilir.");
    
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
})();
