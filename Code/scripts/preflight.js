const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 1. Clear any stuck process on port 3001
try {
  const netstat = execSync("netstat -ano").toString();
  const lines = netstat.split(/\r?\n/);
  for (const line of lines) {
    if (line.includes(":3001") && line.includes("LISTENING")) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== "0" && pid !== String(process.pid)) {
        console.log(`[*] Freeing port 3001 (PID: ${pid})...`);
        try {
          execSync(`taskkill /F /PID ${pid} >nul 2>&1`);
        } catch (_) {}
      }
    }
  }
} catch (_) {}

// 2. Sync server chunks if needed
const serverDir = path.join(__dirname, "..", ".next", "server");
const chunksDir = path.join(serverDir, "chunks");

if (fs.existsSync(chunksDir)) {
  const files = fs.readdirSync(chunksDir);
  for (const f of files) {
    try {
      const src = path.join(chunksDir, f);
      const dest = path.join(serverDir, f);
      if (fs.statSync(src).isFile() && !fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
      }
    } catch (_) {}
  }
}

