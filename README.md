# Windows MCP Notification Server
Lightweight MCP server that exposes `/mcp` on Windows (and via WSL bridge) so any MCP-compatible agent can trigger native toast notifications without touching platform-specific APIs.

## Features
- Uses the Streamable HTTP server transport to expose `/mcp`.
- Works inside WSL environments via the Express bridge.
- Makes custom MCP tools trivial to add by keeping logic in `server.ts`.

## Tools
- `notify`: Pops a native Windows toast for quick status updates or alerts. Inputs: `title` (toast header text) and `message` (body text). Output: `{ "success": boolean }`.

## How to use
### MCP Server (Windows)
1. Clone this repository
```
git clone https://github.com/Hamachi-Multi/windows-notification-server.git
cd windows-notification-server
```

2. Install dependencies
```
pnpm install
# or
npm install
```

3. Install `tsx` (if it's not already available)
```
pnpm add -D tsx
# or
npm install --save-dev tsx
```

4. Run MCP Server
```
npx -y tsx server.ts
```

### MCP Client (inside WSL)
1. Check your Windows hostname
```
echo $(hostname)
```

2. Configure your agent MCP (~/.codex/config.toml, see the [Codex streamable HTTP docs](https://github.com/openai/codex/blob/main/docs/config.md#streamable-http))
```
[mcp_servers.notification]
url = "http://[HOSTNAME].local:3000/mcp"
http_headers = { "accept" = "application/json, text/event-stream", "content-type" = "application/json" }
```

3. Configure your agnet instructions (AGENTS.md)
```
`Use the notification MCP server's notify tool at the beginning and end of each task.`
```

4. Start the agent
```
codex
```

## License
This project (including portions adapted from the official Model Context Protocol server example) is distributed under the MIT License. See `LICENSE` for the full text and attribution details.
