const { spawn } = require("child_process");
const path = require("path");
const { runLiveE2ETest } = require("./live-e2e");

async function main() {
  console.log("Starting server for automated integration test...");
  const serverPath = path.join(__dirname, "..", "server.js");
  const server = spawn("node", [serverPath], {
    cwd: path.join(__dirname, ".."),
    env: { ...process.env, PORT: "3001", NODE_ENV: "production" },
    stdio: "inherit",
  });

  // Wait for server to bind
  let ready = false;
  let lastError = null;

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await fetch("http://127.0.0.1:3001/api/health");
      if (res.ok) {
        ready = true;
        break;
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (!ready) {
    server.kill();
    throw new Error(`Server failed to start within 20 seconds: ${lastError ? lastError.message : "unknown"}`);
  }

  try {
    await runLiveE2ETest("127.0.0.1:3001");
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
