import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { z } from 'zod';
import { Toast } from 'powertoast';

const server = new McpServer({
  name: 'MCP Notification Server',
  version: '1.0.0'
});

server.registerTool(
  'notify',
  {
    title: 'Notify tool',
    description: 'Display a native Windows toast (title = header text, message = body) for quick status updates or alerts.',
    inputSchema: { title: z.string(), message: z.string() },
    outputSchema: { success: z.boolean() }
  },
  async ({ title, message }) => {
    let success = true;

    try {
      await new Toast({
        title: title,
        message: message
      }).show();
    } catch (error) {
      console.error("Error showing toast:", error);
      success = false;
    }

    return {
      content: [{ type: 'text', text: JSON.stringify({ success }) }],
      structuredContent: { success }
    };
  }
);

const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  res.on('close', () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`MCP server listening on port ${port}`);
}).on('error', error => {
  console.error('Error starting server:', error);
  process.exit(1);
})
