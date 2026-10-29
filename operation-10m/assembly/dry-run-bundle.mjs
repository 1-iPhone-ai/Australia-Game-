#!/usr/bin/env node
/**
 * Dry-run: estimate bundle size from module-sources.json (git show per branch root).
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const sources = JSON.parse(
  readFileSync(resolve(__dirname, "module-sources.json"), "utf8")
);

function listFiles(branch, root) {
  const r = spawnSync(
    "git",
    ["ls-tree", "-r", "--name-only", branch, root],
    { encoding: "utf8", cwd: repoRoot }
  );
  if (r.status !== 0) return [];
  return r.stdout
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && /\.(ts|tsx)$/.test(l));
}

function lineCount(branch, path) {
  const r = spawnSync("git", ["show", `${branch}:${path}`], {
    encoding: "utf8",
    cwd: repoRoot,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) return 0;
  return r.stdout.split("\n").length;
}

const jsonOut = process.argv.includes("--json");
const rows = [];

for (const src of sources.sources) {
  const files = listFiles(src.branch, src.root);
  let lines = 0;
  for (const f of files.slice(0, 200)) lines += lineCount(src.branch, f);
  rows.push({
    moduleId: src.moduleId,
    pr: src.pr,
    branch: src.branch,
    tsFiles: files.length,
    estimatedSourceLines: lines,
    inAssemblyManifest: false,
  });
}

const payload = {
  generatedAt: new Date().toISOString(),
  canonicalBase: sources.canonicalBase,
  note: "Source-line sum is not audited functional LOC; assembly uses chunked TSX only.",
  rows,
};

if (jsonOut) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log("Dry-run bundle from open module PR paths:");
  for (const row of rows) {
    console.log(
      `  ${row.moduleId} (PR #${row.pr}): ${row.tsFiles} ts files, ~${row.estimatedSourceLines.toLocaleString()} source lines`
    );
  }
}
