const fs = require("fs");
const path = require("path");

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
    } catch (e) {
      // ignore
    }
  }
}

