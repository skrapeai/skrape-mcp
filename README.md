# Skrape MCP Server

[![smithery badge](https://smithery.ai/badge/@skrapeai/skrape-mcp)](https://smithery.ai/server/@skrapeai/skrape-mcp)

Convert webpages into clean, LLM-ready Markdown using [skrape.ai](https://skrape.ai). An MCP server that seamlessly integrates web scraping with Claude Desktop and other MCP-compatible applications.

## Key Features

- **Clean Output**: Removes ads, navigation, and irrelevant content
- **JavaScript Support**: Handles dynamic content rendering
- **LLM-Optimized**: Structured Markdown perfect for AI consumption
- **Consistent Format**: Uniform structure regardless of source

## Features

### Tools

- `get_markdown` - Convert any webpage to LLM-ready Markdown
  - Takes any input URL and optional parameters
  - Returns clean, structured Markdown optimized for LLM consumption
  - Supports JavaScript rendering for dynamic content
  - Optional JSON response format for advanced integrations

## Installation

### Installing via Smithery

To install Skrape MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@skrapeai/skrape-mcp):

```bash
npx -y @smithery/cli install @skrapeai/skrape-mcp --client claude
```

### Manual Installation

1. Get your API key from [skrape.ai](https://skrape.ai)

1. Install dependencies:

```bash
npm install
```

1. Build the server:

```bash
npm run build
```

1. Add the server config to Claude Desktop:

On MacOS:

```bash
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

On Windows:

```bash
notepad %APPDATA%/Claude/claude_desktop_config.json
```

Add this configuration (replace paths and API key with your values):

```json
{
  "mcpServers": {
    "skrape": {
      "command": "node",
      "args": ["path/to/skrape-mcp/build/index.js"],
      "env": {
        "SKRAPE_API_KEY": "your-key-here"
      }
    }
  }
}
```

## Using with LLMs

Here's how to use the server with Claude or other LLM models:

1. First, ensure the server is properly configured in your LLM application
2. Then, you can ask the ALLMI to fetch and process any webpage:

```
Convert this webpage to markdown: https://example.com

Claude will use the MCP tool like this:
<use_mcp_tool>
<server_name>skrape</server_name>
<tool_name>get_markdown</tool_name>
<arguments>
{
  "url": "https://example.com",
  "options": {
    "renderJs": true
  }
}
</arguments>
</use_mcp_tool>
```

The resulting Markdown will be clean, structured, and ready for LLM processing.

### Advanced Options

The `get_markdown` tool accepts these parameters:

- `url` (required): Any webpage URL to convert
- `returnJson` (optional): Set to `true` to get the full JSON response instead of just markdown
- `options` (optional): Additional scraping options
  - `renderJs`: Whether to render JavaScript before scraping (default: true)

Example with all options:

```
<use_mcp_tool>
<server_name>skrape</server_name>
<tool_name>get_markdown</tool_name>
<arguments>
{
  "url": "https://example.com",
  "returnJson": true,
  "options": {
    "renderJs": false
  }
}
</arguments>
</use_mcp_tool>
```

## Development

For development with auto-rebuild:

```bash
npm run watch
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

---

<a href="https://glama.ai/mcp/servers/7i81qzgkzd">
<img width="190" height="100" src="https://glama.ai/mcp/servers/7i81qzgkzd/badge" />
</a>
