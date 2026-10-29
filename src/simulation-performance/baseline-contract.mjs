import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASELINE = resolve(process.cwd(), '(V9.4) australia-game-with-ai.tsx');

/** @param {string} pattern */
function mustInclude(source, pattern, label) {
  if (!source.includes(pattern)) {
    return { ok: false, label, detail: `missing marker: ${pattern.slice(0, 80)}` };
  }
  return { ok: true, label };
}

export function runSimulationPerformanceBaselineContract() {
  const source = readFileSync(BASELINE, 'utf8');
  const checks = [
    mustInclude(source, 'export function nationalSystemsInputHash', 'nationalSystemsInputHash exported'),
    mustInclude(source, 'const nsDiagRef = useRef', 'nsDiagRef runtime diagnostics'),
    mustInclude(source, 'prev.inputHash === nsHash && prev.initializedTurn !== null', 'V10.0 hash skip guard'),
    mustInclude(source, 'prev.inputHash === scHash && prev.initializedTurn !== null', 'V10.1 hash skip guard'),
    mustInclude(source, 'Recomputed only when its compact input hash changes', 'hash-keyed recompute comment (NS)'),
    mustInclude(source, 'export function o111CoalesceLoadStatePayloads', 'LOAD_STATE coalesce helper'),
    mustInclude(source, 'export function runO111SimulationPerformanceSelfTests', 'Agent 86 self-tests'),
    mustInclude(source, "id: 'o111_a86'", 'V95 quick suite registration'),
    mustInclude(source, 'computeMs', 'compute timing field on national state'),
    mustInclude(source, "dispatchGameState({ type: 'LOAD_STATE', payload: { nationalSystems:", 'NS persist dispatch pattern'),
  ];
  const failed = checks.filter((c) => !c.ok);
  return {
    passed: failed.length === 0,
    total: checks.length,
    failed: failed.map((f) => f),
  };
}
