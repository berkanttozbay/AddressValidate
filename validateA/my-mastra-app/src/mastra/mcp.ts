import { MCPClient, MCPServer } from "@mastra/mcp";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

 

export const mcp = new MCPClient({
  servers: {
    smithery: {
      url: new URL("https://server.smithery.ai/@berkanttozbay/mcplatest/mcp?api_key=fc7e1bea-267f-4159-9a2b-6d233bceb61d"),
      
      enableServerLogs: true,
    },
  },
});

