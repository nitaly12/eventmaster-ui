import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");

console.log("Regenerating Prisma and reseeding database...\n");

if (fs.existsSync(nextDir)) {
  console.warn("Warning: .next/ still exists. Run npm run clean first (with dev server stopped).\n");
}

execSync("npx prisma generate", { cwd: root, stdio: "inherit" });
execSync("npm run db:push", { cwd: root, stdio: "inherit" });
execSync("npm run db:seed", { cwd: root, stdio: "inherit" });
execSync("npm run db:check", { cwd: root, stdio: "inherit" });

console.log("\nDone. Start the app with: npm run dev");
