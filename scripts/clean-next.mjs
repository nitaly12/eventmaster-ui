import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");

console.log("Remove ALL npm run dev terminals (Ctrl+C) before this runs.\n");

if (!fs.existsSync(nextDir)) {
  console.log(".next/ is already missing.");
  process.exit(0);
}

try {
  fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 8, retryDelay: 300 });
  console.log("Removed .next/ — start with: npm run dev");
} catch {
  console.error(
    "Could not delete .next/. Stop every npm run dev process, close extra terminals, then run: npm run clean",
  );
  process.exit(1);
}
