// Dev-only: checks that every exported suite function (run...SelfTests / run...DevTests) is registered or explicitly listed.
//   node tools/selftest/registry-integrity.mjs [--file "<path to game .tsx>"]
// V10.1 (SECTION 20BK): the game cannot list its own exports at run time, so this script bundles it (like node-eval.mjs), asks the module for its export names and
// hands them to v101CheckSuiteManifest, which also checks the suite registry (V95_EXISTING_SUITES) against V101_SUITE_MANIFEST. Exit code 1 when anything is missing.
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const fi = args.indexOf('--file');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const gameFile = path.resolve(fi >= 0 ? args[fi + 1] : path.join(root, '(V10.1) australia-game-with-ai.tsx'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aussie-registry-'));
const bundle = path.join(tmp, 'game.mjs');
await build({
  entryPoints: [gameFile], bundle: true, platform: 'node', format: 'esm', outfile: bundle, jsx: 'automatic', logLevel: 'error',
  nodePaths: [path.join(root, 'node_modules')], absWorkingDir: root,
  banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
  define: { 'process.env.NODE_ENV': '"development"' },
});
const store = new Map();
globalThis.localStorage = { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => { store.set(k, String(v)); }, removeItem: k => { store.delete(k); }, clear: () => store.clear(), key: i => [...store.keys()][i] ?? null, get length() { return store.size; } };
globalThis.window = globalThis.window || globalThis;
globalThis.window.localStorage = globalThis.localStorage;
const G = await import(pathToFileURL(bundle).href);
const exported = Object.keys(G).filter(name => /^run\w*(SelfTests|DevTests)$/.test(name));
const problems = G.v101CheckSuiteManifest(G.V95_EXISTING_SUITES, G.V101_SUITE_MANIFEST, exported);
fs.rmSync(tmp, { recursive: true, force: true });
if (problems.length) {
  console.log(`registry-integrity: ${problems.length} problem(s)`);
  problems.forEach(p => console.log(`  ${p}`));
  process.exit(1);
}
console.log(`registry-integrity: ok (${exported.length} exported suite functions, ${G.V95_EXISTING_SUITES.length} registered suites)`);
