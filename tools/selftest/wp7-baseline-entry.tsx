// Dev-only: runs the V9.6 50-action script against the untouched V9.5 exports and against V9.6's own, so the
// V9.5 result can be pinned in V95_FIFTY_ACTION_BASELINE (SECTION 20AM). See tools/selftest/wp7-baseline.mjs.
import * as V95 from '../../(V9.5) australia-game-with-ai.tsx';
import * as V96 from '../../(V9.6) australia-game-with-ai.tsx';

const api = (m: unknown) => m as V96.V96ScriptApi;
const out: Record<string, unknown> = {};
try {
  const a = V96.runFiftyActionScript(api(V95));
  const b = V96.runFiftyActionScript(api(V96));
  out.v95 = { hash: a.hash, executed: a.executed };
  out.v96 = { hash: b.hash, executed: b.executed };
  out.equal = a.projection === b.projection;
  if (!out.equal) { out.v95projection = a.projection.slice(0, 4000); out.v96projection = b.projection.slice(0, 4000); }
} catch (err) {
  out.error = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
}
(window as unknown as { __wp7Baseline: unknown }).__wp7Baseline = out;
const pre = document.getElementById('out');
if (pre) pre.textContent = JSON.stringify(out, null, 1);
