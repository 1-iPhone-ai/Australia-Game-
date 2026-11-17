// Dev-only: bundle the game file with esbuild and run a script against its exports in Node (no browser).
//   node tools/selftest/node-eval.mjs <script.mjs> [--file "<game .tsx>"]
// The script is an ES module whose default export is `async (G) => { ... }`; G is the game module (all `export`s).
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const fileIdx = args.indexOf('--file');
const script = args.find((a, i) => !a.startsWith('--') && (fileIdx < 0 || i !== fileIdx + 1));
if (!script) { console.error('usage: node tools/selftest/node-eval.mjs <script.mjs> [--file game.tsx]'); process.exit(2); }
const fi = args.indexOf('--file');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const gameFile = path.resolve(fi >= 0 ? args[fi + 1] : path.join(root, '(V9.9) australia-game-with-ai.tsx'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aussie-eval-'));
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
try {
  const mod = await import(pathToFileURL(path.resolve(script)).href);
  const out = await mod.default(G);
  if (out !== undefined) console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 1));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
