// src/mastra/agents/mcpAgent.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { mcp } from "../mcp";

export const createMcpAgent = async () => {
  try {
    console.log("MCP'ye bağlanmaya çalışıyorum...");
    const tools = await mcp.getTools();  // MCP'den araçları al
    console.log("MCP'den alınan araçlar:", tools);

    return new Agent({
      name: "MCP Connected Agent",
      description: "An agent that uses tools from MCP servers.",
      instructions: "You can use the MCP tools to answer user questions.",
      model: openai("gpt-4o-mini"),
      tools,
    });
  } catch (error) {
    console.error("MCP bağlantı hatası:", error);
    
    // Fallback olarak tools olmadan agent oluştur
    return new Agent({
      name: "Basic Agent",
      description: "A basic agent without MCP tools.",
      instructions: "You are a helpful AI assistant.",
      model: openai("gpt-4o-mini"),
    });
  }
};
