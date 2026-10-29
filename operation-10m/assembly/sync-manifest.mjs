#!/usr/bin/env node
/**
 * Sync manifest from local modules and/or scan ALL origin/op10m/* branches.
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

const args = process.argv.slice(2);
const remoteOp10m = args.includes("--remote-op10m");

/** Branch slug (after op10m/) → canonical moduleId when chunk marker or path differs */
const BRANCH_TO_MODULE_ID = {
  "agent-10-finance-inflation": "agent-10-finance",
  "agent-19-memory": "agent-19-ai-memory",
  "agent-12-infrastructure": "agent-12-infrastructure",
  "agent-24-history": "agent-24-replay",
};

const SKIP_BRANCHES = new Set(["agent-25-integration"]);

function parseMarkerModuleId(chunkText) {
  const m = chunkText.match(/OP10M_MODULE_BEGIN\s+([a-z0-9-]+)/i);
  return m?.[1] ?? null;
}

function resolveModuleId(branchSlug, markerId) {
  if (markerId) return markerId;
  if (BRANCH_TO_MODULE_ID[branchSlug]) return BRANCH_TO_MODULE_ID[branchSlug];
  return branchSlug;
}

function listOp10mRemoteBranches() {
  const r = spawnSync("git", ["for-each-ref", "--format=%(refname:short)", "refs/remotes/origin/op10m/"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  if (r.status !== 0) return [];
  return r.stdout
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("origin/op10m/"))
    .map((l) => ({
      branch: l,
      slug: l.replace("origin/op10m/", ""),
    }))
    .filter(({ slug }) => !SKIP_BRANCHES.has(slug));
}

function gitLines(branch, path) {
  const r = spawnSync("git", ["show", `${branch}:${path}`], {
    encoding: "utf8",
    cwd: repoRoot,
    maxBuffer: 128 * 1024 * 1024,
  });
  if (r.status !== 0) return null;
  return r.stdout;
}

function discoverChunkOnBranch(branch) {
  const r = spawnSync(
    "git",
    ["ls-tree", "-r", "--name-only", branch, "operation-10m"],
    { encoding: "utf8", cwd: repoRoot, maxBuffer: 16 * 1024 * 1024 }
  );
  if (r.status !== 0) return null;
  const candidates = r.stdout
    .split("\n")
    .filter(Boolean)
    .filter(
      (p) =>
        /chunk\.tsx$/.test(p) &&
        (/^operation-10m\/modules\/agent-/.test(p) || /^operation-10m\/agent-/.test(p))
    );
  for (const path of candidates) {
    const text = gitLines(branch, path);
    if (text && text.includes("OP10M_MODULE_BEGIN")) {
      return { path, text, markerModuleId: parseMarkerModuleId(text) };
    }
  }
  return null;
}

function scanRemoteBranches() {
  const branches = listOp10mRemoteBranches();
  const totalHeads = spawnSync("git", ["for-each-ref", "--format=%(refname:short)", "refs/remotes/origin/op10m/"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  const originOp10mHeadCount = totalHeads.stdout.split("\n").filter((l) => l.trim()).length;
  const rows = [];
  const seenModuleIds = new Map();

  for (const { branch, slug } of branches) {
    const chunk = discoverChunkOnBranch(branch);
    let moduleId = null;
    let contentSha256 = null;
    let assemblyReady = false;
    if (chunk) {
      moduleId = resolveModuleId(slug, chunk.markerModuleId);
      try {
        contentSha256 = hashModuleBody(moduleId, chunk.text);
        assemblyReady = true;
      } catch {
        assemblyReady = false;
      }
    } else {
      moduleId = resolveModuleId(slug, null);
    }

    const row = {
      branch,
      branchSlug: slug,
      moduleId,
      chunkPath: chunk?.path ?? null,
      markerModuleId: chunk?.markerModuleId ?? null,
      assemblyReady,
      contentSha256,
      defaultSlot: "pre-final-export",
    };

    if (assemblyReady && seenModuleIds.has(moduleId)) {
      row.duplicateModuleIdOf = seenModuleIds.get(moduleId);
      row.assemblyReady = false;
      row.skipReason = "duplicate moduleId (branch not primary)";
    } else if (assemblyReady) {
      seenModuleIds.set(moduleId, branch);
    }

    rows.push(row);
  }

  rows.sort((a, b) => a.moduleId.localeCompare(b.moduleId));
  return {
    scannedAt: new Date().toISOString(),
    canonicalBase: "origin/australia-game-upgrade",
    baselineCommit: "bc1adf3",
    originOp10mHeadCount,
    branchHeadCount: branches.length,
    branchCount: rows.length,
    assemblyReadyCount: rows.filter((r) => r.assemblyReady).length,
    pendingAgent14: !rows.some((r) => r.branchSlug.includes("agent-14") && r.assemblyReady),
    rows,
  };
}

function syncLocalModules() {
  const modules = [];
  if (!existsSync(modulesRoot)) return modules;
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
      ...(local.touchesSaveFormat ? { touchesSaveFormat: true } : {}),
      ...(local.dependsOn ? { dependsOn: local.dependsOn } : {}),
    });
  }
  modules.sort((a, b) => a.moduleId.localeCompare(b.moduleId));
  return modules;
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
      const slot =
        row.moduleId === "agent-03-research-tech"
          ? "post-v10z"
          : row.moduleId === "agent-06-macroeconomy"
            ? "append-only-self-tests"
            : row.defaultSlot;
      writeFileSync(
        manifestFile,
        JSON.stringify({ moduleId: row.moduleId, slot, importedFrom: row.branch }, null, 2) + "\n"
      );
    }
    imported++;
  }
  return imported;
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const localModules = syncLocalModules();
manifest.modules = localModules.map(({ source, ...rest }) => rest);
manifest.canonicalBaseCommit = manifest.canonicalBaseCommit || "bc1adf3";
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
    `remote scan: ${scan.originOp10mHeadCount} origin/op10m heads (${scan.branchHeadCount} excl. integration), ${scan.assemblyReadyCount} assembly-ready → audits/manifest-remote-sync.json`
  );
  const localModulesAfter = syncLocalModules();
  manifest.modules = localModulesAfter.map(({ source, ...rest }) => rest);
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`sync-manifest: ${localModulesAfter.length} local module(s) → manifest.json (after remote import)`);
}
