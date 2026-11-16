// Headless (Node) self-test runner: bundles the game file with esbuild and runs registered suites without a browser.
//   node tools/selftest/node-run.mjs [--file "<path to game .tsx>"] [--suites id1,id2|all] [--out report.json] [--extras] [--release]
// Dev-only. Browser tools/selftest/run.mjs stays the reference runner (it also runs the full release check).
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] ? args[i + 1] : dflt; };
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const gameFile = path.resolve(opt('file', path.join(root, '(V9.9) australia-game-with-ai.tsx')));
const wanted = opt('suites', 'all');
const outFile = opt('out', '');
const withExtras = args.includes('--extras');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aussie-node-'));
const bundle = path.join(tmp, 'game.mjs');
const t0 = Date.now();
await build({
  // V10.1 (SECTION 20BI): the wrapper entry puts a static renderer (bundled with the game's own React copy) on globalThis for the v101wl rendered-markup tests; the game file itself imports no react-dom/server.
  stdin: { contents: `export * from ${JSON.stringify(gameFile)};\nimport { renderToStaticMarkup as __v101r } from 'react-dom/server';\nglobalThis.__v101RenderStatic = __v101r;\n`, resolveDir: root, sourcefile: 'v101-entry.js', loader: 'js' },
  bundle: true, platform: 'node', format: 'esm', outfile: bundle, jsx: 'automatic',
  sourcemap: false, logLevel: 'error', nodePaths: [path.join(root, 'node_modules')], absWorkingDir: root,
  banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
  define: { 'process.env.NODE_ENV': '"development"' },
});
const tBuild = Date.now() - t0;

// Minimal browser surface for code that probes window/localStorage at call time.
const store = new Map();
globalThis.localStorage = { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => { store.set(k, String(v)); }, removeItem: k => { store.delete(k); }, clear: () => store.clear(), key: i => [...store.keys()][i] ?? null, get length() { return store.size; } };
globalThis.window = globalThis.window || globalThis;
globalThis.window.localStorage = globalThis.localStorage;

const G = await import(pathToFileURL(bundle).href);
const norm = raw => {
  const r = raw; const arr = Array.isArray(r) ? r : (r?.results || r?.tests || (r?.categories ? r.categories.flatMap(c => c.results || c.tests || []) : []) || []);
  return arr.map(t => ({ id: String(t.id || t.testId || t.name || '?'), name: String(t.name || t.id || '?'), passed: t.passed === true || t.pass === true || t.status === 'pass' || t.status === 'passed', detail: String(t.detail ?? t.message ?? t.reason ?? t.errorMessage ?? '') }));
};
const rows = []; const errors = [];
const pick = wanted === 'all' ? null : new Set(wanted.split(','));
for (const spec of G.V95_EXISTING_SUITES) {
  if (pick && !pick.has(spec.id)) continue;
  const t = Date.now();
  try { norm(G.v95WithIsolatedGlobals(() => spec.run())).forEach(x => rows.push({ suite: spec.id, ...x })); }
  catch (err) { errors.push(`${spec.id}: ${err instanceof Error ? err.stack || err.message : String(err)}`); }
  if (pick) console.log(`  ${spec.id} ${Date.now() - t} ms`);
}
if (withExtras && !pick) {
  try { norm(G.v95WithIsolatedGlobals(() => G.runV95ReleaseReadinessSelfTests({ stressTurns: 30 }))).forEach(x => rows.push({ suite: 'v95own', ...x })); } catch (err) { errors.push(`v95own: ${String(err)}`); }
  for (const [name, fn] of [['v96em-direct', () => G.runV96ExperienceModesSelfTests()], ['gi2-async', () => G.runGameIntelligence2AsyncSelfTests()], ['gi21-async', () => G.runGameIntelligence21AsyncSelfTests()], ['v96-fidelity-async', () => G.runV96HumanVsAiFidelitySelfTests()]]) {
    try { norm(await fn()).forEach(x => rows.push({ suite: name, ...x })); } catch (err) { errors.push(`${name}: ${String(err)}`); }
  }
}
if (args.includes('--release') && !pick) {
  try { const rel = await G.runV95ReleaseCheck('full'); const rr = rel.report; console.log(`release(full): status=${rr.status} checks=${rr.totals.checks} passed=${rr.totals.passed} failed=${rr.totals.failed}`); (rel.checks || []).filter(c => !c.passed).forEach(c => console.log(`  RELEASE FAIL ${c.section} ${c.name}: ${String(c.detail).slice(0, 200)}`)); } catch (err) { errors.push(`releaseCheck: ${String(err)}`); }
}
const failed = rows.filter(r => !r.passed);
console.log(`node-run: build ${tBuild} ms; total=${rows.length} passed=${rows.length - failed.length} failed=${failed.length} errors=${errors.length}`);
failed.slice(0, 60).forEach(f => console.log(`  FAIL ${f.suite} ${f.id}: ${f.name} — ${f.detail.slice(0, 240)}`));
errors.forEach(e => console.log(`  ERROR ${e.slice(0, 400)}`));
if (outFile) fs.writeFileSync(outFile, JSON.stringify({ total: rows.length, failed: failed.length, failures: failed, errors, rows }, null, 1));
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(failed.length || errors.length ? 1 : 0);
