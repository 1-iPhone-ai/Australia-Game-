#!/usr/bin/env node
/**
 * Sync operation-10m/assembly/manifest.json from operation-10m/modules agent chunk files.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hashModuleBody } from "./lib/anchors.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const modulesRoot = resolve(repoRoot, "operation-10m/modules");
const manifestPath = resolve(__dirname, "manifest.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const modules = [];

for (const name of readdirSync(modulesRoot)) {
  const dir = join(modulesRoot, name);
  if (!statSync(dir).isDirectory()) continue;
  const chunkPath = join(dir, "chunk.tsx");
  const localManifestPath = join(dir, "module.manifest.json");
  if (!statSync(chunkPath).isFile() || !statSync(localManifestPath).isFile()) continue;

  const local = JSON.parse(readFileSync(localManifestPath, "utf8"));
  const chunkText = readFileSync(chunkPath, "utf8");
  const sha = hashModuleBody(local.moduleId, chunkText);

  modules.push({
    moduleId: local.moduleId,
    path: `operation-10m/modules/${name}/chunk.tsx`,
    slot: local.slot,
    contentSha256: sha,
    ...(local.touchesSaveFormat ? { touchesSaveFormat: true } : {}),
    ...(local.dependsOn ? { dependsOn: local.dependsOn } : {}),
  });
}

modules.sort((a, b) => a.moduleId.localeCompare(b.moduleId));
manifest.modules = modules;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`sync-manifest: ${modules.length} module(s) → manifest.json`);
