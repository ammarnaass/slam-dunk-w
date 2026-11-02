/**
 * Resolvers Synchronization Script
 * Copies the modular resolver engine from src/lib/resolvers/ to backend/src/lib/resolvers/
 * Ensures 100% single source of truth across the Next.js platform and standalone Hono backend.
 */

import * as fs from "fs";
import * as path from "path";

const SOURCE_DIR = path.resolve(__dirname, "../src/lib/resolvers");
const TARGET_DIR = path.resolve(__dirname, "../backend/src/lib/resolvers");

function copyDirRecursive(source: string, target: string) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Synced: ${path.relative(process.cwd(), destPath)}`);
    }
  }
}

console.log("🔄 Synchronizing modular resolvers engine...");
copyDirRecursive(SOURCE_DIR, TARGET_DIR);

// Ensure backend/src/lib/resolvers.ts is a clean backward-compatibility re-export
const backendBarrelFile = path.resolve(__dirname, "../backend/src/lib/resolvers.ts");
const barrelContent = `/**
 * Anime Slayer & Anime Watch Grade Multi-Host Multi-Server Resolver Engine
 * Backward Compatibility Layer & Re-export Barrel
 * 
 * Modular implementation lives in: backend/src/lib/resolvers/
 * Synced automatically from: src/lib/resolvers/
 */

export * from "./resolvers/index";
`;

fs.writeFileSync(backendBarrelFile, barrelContent, "utf-8");
console.log(`Synced: ${path.relative(process.cwd(), backendBarrelFile)}`);
console.log("✅ Resolvers synchronization completed successfully.");
