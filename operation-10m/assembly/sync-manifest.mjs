#!/usr/bin/env node
/**
 * Sync manifest from local modules and/or scan origin/op10m/* branches.
 *
 *   node sync-manifest.mjs                 # local operation-10m/modules only
 *   node sync-manifest.mjs --remote-op10m    # also scan remote branches → audits/manifest-remote-sync.json
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hashModuleBody } from "./lib/anchors.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const modulesRoot = resolve(repoRoot, "operation-10m/modules");
const manifestPath = resolve(__dirname, "manifest.json");
const sourcesPath = resolve(__dirname, "module-sources.json");

const args = process.argv.slice(2);
const remoteOp10m = args.includes("--remote-op10m");

function syncLocalModules() {
  const modules = [];
  for (const name of readdirSync(modulesRoot)) {
    const dir = join(modulesRoot, name);
    if (!statSync(dir).isDirectory()) continue;
    const chunkPath = join(dir, "chunk.tsx");
    const localManifestPath = join(dir, "module.manifest.json");
    if (!existsSync(chunkPath) || !existsSync(localManifestPath)) continue;

    const local = JSON.parse(readFileSync(localManifestPath, "utf8"));
    const chunkText = readFileSync(chunkPath, "utf8");
    const sha = hashModuleBody(local.moduleId, chunkText);

    modules.push({
      moduleId: local.moduleId,
      path: `operation-10m/modules/${name}/chunk.tsx`,
      slot: local.slot,
      contentSha256: sha,
      source: "local",
      ...(local.touchesSaveFormat ? { touchesSaveFormat: true } : {}),
      ...(local.dependsOn ? { dependsOn: local.dependsOn } : {}),
    });
  }
  modules.sort((a, b) => a.moduleId.localeCompare(b.moduleId));
  return modules;
}

function gitLines(branch, path) {
  const r = spawnSync("git", ["show", `${branch}:${path}`], {
    encoding: "utf8",
    cwd: repoRoot,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) return null;
  return r.stdout;
}

function gitLs(branch, root) {
  const r = spawnSync("git", ["ls-tree", "-r", "--name-only", branch, root], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  if (r.status !== 0) return [];
  return r.stdout.split("\n").filter(Boolean);
}

function scanRemoteBranches() {
  const sources = JSON.parse(readFileSync(sourcesPath, "utf8"));
  const rows = [];
  for (const src of sources.sources) {
    const branch = src.branch;
    const root = src.root;
    const files = gitLs(branch, root);
    const tsFiles = files.filter((f) => /\.(ts|tsx)$/.test(f));
    const chunkPaths = [
      `operation-10m/modules/${src.moduleId}/chunk.tsx`,
      `${root}/chunk.tsx`,
      `${root}/src/chunk.tsx`,
    ];
    let chunkOnBranch = null;
    let chunkText = null;
    for (const p of chunkPaths) {
      const t = gitLines(branch, p);
      if (t && t.includes("OP10M_MODULE_BEGIN")) {
        chunkOnBranch = p;
        chunkText = t;
        break;
      }
    }
    let contentSha256 = null;
    let assemblyReady = false;
    if (chunkText) {
      try {
        contentSha256 = hashModuleBody(src.moduleId, chunkText);
        assemblyReady = true;
      } catch {
        assemblyReady = false;
      }
    }
    let estSourceLines = 0;
    for (const f of tsFiles.slice(0, 300)) {
      const t = gitLines(branch, f);
      if (t) estSourceLines += t.split("\n").length;
    }
    rows.push({
      moduleId: src.moduleId,
      branch,
      pr: src.pr,
      root,
      tsFileCount: tsFiles.length,
      estimatedSourceLines: estSourceLines,
      chunkPath: chunkOnBranch,
      assemblyReady,
      contentSha256,
      defaultSlot: "pre-final-export",
    });
  }
  rows.sort((a, b) => a.moduleId.localeCompare(b.moduleId));
  return {
    scannedAt: new Date().toISOString(),
    canonicalBase: sources.canonicalBase,
    branchCount: rows.length,
    assemblyReadyCount: rows.filter((r) => r.assemblyReady).length,
    rows,
  };
}

function materializeReadyChunks(scan) {
  let imported = 0;
  for (const row of scan.rows) {
    if (!row.assemblyReady || !row.chunkPath) continue;
    const chunkText = gitLines(row.branch, row.chunkPath);
    if (!chunkText) continue;
    const destDir = join(modulesRoot, row.moduleId);
    mkdirSync(destDir, { recursive: true });
    writeFileSync(
      join(destDir, "chunk.tsx"),
      chunkText.endsWith("\n") ? chunkText : chunkText + "\n"
    );
    const manifestFile = join(destDir, "module.manifest.json");
    const remoteManifestPath = `operation-10m/modules/${row.moduleId}/module.manifest.json`;
    const remoteManifest = gitLines(row.branch, remoteManifestPath);
    if (remoteManifest) {
      writeFileSync(manifestFile, remoteManifest.endsWith("\n") ? remoteManifest : remoteManifest + "\n");
    } else if (!existsSync(manifestFile)) {
      writeFileSync(
        manifestFile,
        JSON.stringify(
          {
            moduleId: row.moduleId,
            slot: row.defaultSlot || "pre-final-export",
            importedFrom: row.branch,
          },
          null,
          2
        ) + "\n"
      );
    }
    imported++;
  }
  return imported;
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const localModules = syncLocalModules();
manifest.modules = localModules.map(({ source, ...rest }) => rest);
if (!manifest.canonicalBaseCommit) {
  const head = spawnSync("git", ["rev-parse", "origin/australia-game-upgrade"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  if (head.status === 0) manifest.canonicalBaseCommit = head.stdout.trim().slice(0, 7);
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`sync-manifest: ${localModules.length} local module(s) → manifest.json`);

if (remoteOp10m) {
  const scan = scanRemoteBranches();
  const imported = materializeReadyChunks(scan);
  if (imported > 0) {
    console.log(`imported ${imported} remote chunk(s) → operation-10m/modules/`);
  }
  const out = resolve(__dirname, "audits/manifest-remote-sync.json");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(scan, null, 2) + "\n");
  console.log(
    `remote scan: ${scan.branchCount} branches, ${scan.assemblyReadyCount} assembly-ready chunk(s) → audits/manifest-remote-sync.json`
  );
  const localModulesAfter = syncLocalModules();
  manifest.modules = localModulesAfter.map(({ source, ...rest }) => rest);
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`sync-manifest: ${localModulesAfter.length} local module(s) → manifest.json (after remote import)`);
}
