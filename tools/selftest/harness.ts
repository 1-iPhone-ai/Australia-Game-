// Shared browser harness: runs every registered self-test suite of a game module and
// exposes a JSON report on window.__selfTestReport for tools/selftest/run.mjs (Playwright).
// Not part of the game. Dev-only.

type Row = { suite: string; id: string; name: string; passed: boolean; detail: string };

type GameModule = {
  V95_EXISTING_SUITES: Array<{ id: string; label: string; tier: string; run: () => unknown }>;
  v95WithIsolatedGlobals: <T>(fn: () => T) => T;
  runV95ReleaseCheck: (mode: 'quick' | 'full') => Promise<{ report: unknown; checks: Array<{ id: string; name: string; passed: boolean; detail: string; section: string; severity: string }> }>;
  runV95ReleaseReadinessSelfTests: (opts?: { stressTurns?: number }) => unknown;
  runV96HumanVsAiFidelitySelfTests?: () => Promise<unknown>;
  runGameIntelligence2AsyncSelfTests?: () => Promise<unknown>;
  runGameIntelligence21AsyncSelfTests?: () => Promise<unknown>;
  [key: string]: unknown;
};

function normalize(raw: unknown): Array<{ id: string; name: string; passed: boolean; detail: string }> {
  const r = raw as { results?: unknown[]; tests?: unknown[]; categories?: Array<{ results?: unknown[]; tests?: unknown[] }> } | unknown[] | null;
  const arr: unknown[] = Array.isArray(r) ? r : (r?.results || r?.tests || (r?.categories ? r.categories.flatMap(c => c.results || c.tests || []) : []) || []);
  return arr.map(t => {
    const x = t as { id?: string; name?: string; testId?: string; passed?: boolean; pass?: boolean; status?: string; detail?: string; message?: string; reason?: string; errorMessage?: string };
    return {
      id: String(x.id || x.testId || x.name || '?'),
      name: String(x.name || x.id || '?'),
      passed: x.passed === true || x.pass === true || x.status === 'pass' || x.status === 'passed',
      detail: String(x.detail ?? x.message ?? x.reason ?? x.errorMessage ?? '')
    };
  });
}

export async function runHarness(G: GameModule, extraSuites: Array<[string, () => unknown]>): Promise<void> {
  const out = document.getElementById('out') as HTMLPreElement;
  const rows: Row[] = [];
  const errors: string[] = [];
  const log = (s: string) => { out.textContent += `\n${s}`; };
  out.textContent = 'running…';

  for (const spec of G.V95_EXISTING_SUITES) {
    try {
      const raw = G.v95WithIsolatedGlobals(() => spec.run());
      normalize(raw).forEach(t => rows.push({ suite: spec.id, ...t }));
    } catch (err) {
      errors.push(`${spec.id}: ${err instanceof Error ? err.stack || err.message : String(err)}`);
    }
    await new Promise(r => setTimeout(r, 0));
  }
  try {
    normalize(G.v95WithIsolatedGlobals(() => G.runV95ReleaseReadinessSelfTests({ stressTurns: 30 }))).forEach(t => rows.push({ suite: 'v95own', ...t }));
  } catch (err) { errors.push(`v95own: ${err instanceof Error ? err.stack || err.message : String(err)}`); }
  for (const [name, fn] of extraSuites) {
    try { normalize(await fn()).forEach(t => rows.push({ suite: name, ...t })); }
    catch (err) { errors.push(`${name}: ${err instanceof Error ? err.stack || err.message : String(err)}`); }
  }
  let release: unknown = null;
  try { release = await G.runV95ReleaseCheck('full'); } catch (err) { errors.push(`releaseCheck: ${err instanceof Error ? err.stack || err.message : String(err)}`); }

  const failed = rows.filter(r => !r.passed);
  const report = { total: rows.length, passed: rows.length - failed.length, failed: failed.length, failures: failed, errors, release, rows };
  (window as unknown as { __selfTestReport: unknown }).__selfTestReport = report;
  log(`total=${rows.length} passed=${report.passed} failed=${failed.length} errors=${errors.length}`);
  failed.forEach(f => log(`FAIL ${f.suite} ${f.id}: ${f.name} — ${f.detail}`));
  errors.forEach(e => log(`ERROR ${e}`));
}
