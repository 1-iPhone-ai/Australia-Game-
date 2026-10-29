#!/usr/bin/env node
import { validateManifest, loadManifest } from "./lib/anchors.mjs";

const manifest = loadManifest();
const errors = validateManifest(manifest);
if (errors.length) {
  console.error("manifest validation FAILED:");
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}
console.log(`manifest OK (${manifest.modules.length} modules)`);
