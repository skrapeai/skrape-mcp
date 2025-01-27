#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const API_KEY = process.env.SKRAPE_API_KEY;
if (!API_KEY) {
  throw new Error("SKRAPE_API_KEY environment variable is required");
}

const server = new Server(
  {
    name: "skrape",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_markdown",
        description: "Get markdown content from a webpage using skrape.ai",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the webpage to scrape"
            },
            returnJson: {
              type: "boolean",
              description: "Whether to return JSON response (true) or raw markdown (false)",
              default: false
            },
            options: {
              type: "object",
              description: "Additional scraping options",
              properties: {
                renderJs: {
                  type: "boolean",
                  description: "Whether to render the JavaScript content of the website",
                  default: true
                }
              },
              default: { renderJs: true }
            }
          },
          required: ["url"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_markdown": {
      const { url, returnJson = false, options = { renderJs: true } } = request.params.arguments || {};

      if (!url || typeof url !== "string") {
        throw new McpError(ErrorCode.InvalidParams, "URL is required and must be a string");
      }

      try {
        const response = await axios.post(
          "https://skrape.ai/api/markdown",
          { url, options },
          {
            headers: {
              "Authorization": `Bearer ${API_KEY}`,
              "Content-Type": returnJson ? "application/json" : "text/markdown"
            }
          }
        );

        return {
          content: [{
            type: "text",
            text: returnJson ? JSON.stringify(response.data, null, 2) : response.data
          }]
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new McpError(
            ErrorCode.InternalError,
            `Skrape API error: ${error.response?.data?.message || error.message}`
          );
        }
        throw error;
      }
    }

    default:
      throw new McpError(ErrorCode.MethodNotFound, "Unknown tool");
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Skrape MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
