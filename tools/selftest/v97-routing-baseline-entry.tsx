// Dev-only: runs the V9.7 routing replay script (SECTION 20AO) against the untouched V9.6 exports and against V9.7's
// own with canonicalActionRoutingV97 off and on, so the results can be pinned in V96_ROUTING_SCRIPT_BASELINE and
// V97_ROUTING_SCRIPT_ON_BASELINE. See tools/selftest/v97-routing-baseline.mjs.
import * as V96 from '../../(V9.6) australia-game-with-ai.tsx';
import * as V97 from '../../(V9.7) australia-game-with-ai.tsx';

const api = (m: unknown) => m as V97.V96ScriptApi;
const out: Record<string, unknown> = {};
try {
  const a = V97.v95WithIsolatedGlobals(() => V97.runV97RoutingScript(api(V96), false));
  const b = V97.v95WithIsolatedGlobals(() => V97.runV97RoutingScript(api(V97), false));
  const c = V97.v95WithIsolatedGlobals(() => V97.runV97RoutingScript(api(V97), true));
  out.v96 = { hash: a.hash, executed: a.executed };
  out.v97off = { hash: b.hash, executed: b.executed };
  out.v97on = { hash: c.hash, executed: c.executed };
  out.offEqual = a.projection === b.projection;
  if (!out.offEqual) { out.v96projection = a.projection.slice(0, 6000); out.v97offProjection = b.projection.slice(0, 6000); }
  out.onProjection = c.projection.slice(0, 6000);
} catch (err) {
  out.error = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
}
(window as unknown as { __v97RoutingBaseline: unknown }).__v97RoutingBaseline = out;
const pre = document.getElementById('out');
if (pre) pre.textContent = JSON.stringify(out, null, 1);
