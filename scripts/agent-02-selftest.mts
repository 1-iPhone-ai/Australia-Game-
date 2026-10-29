/**
 * Lightweight runner: extracts Agent 02 section from V9.4 TSX and executes self-tests.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const tsxPath = path.resolve('../(V9.4) australia-game-with-ai.tsx');
const raw = fs.readFileSync(tsxPath, 'utf8');
const start = raw.indexOf('// SECTION 11A: AGENT 02');
const end = raw.indexOf('// SECTION 12: ASK THE GAME AI');
if (start < 0 || end < 0 || end <= start) {
  console.error('Could not locate Agent 02 section boundaries');
  process.exit(2);
}
const section = raw.slice(start, end);
const stub = `
type GameSettingsState = Record<string, any>;
const DEFAULT_GAME_SETTINGS: GameSettingsState = { advancedTurnProcessingEnabled: true };
`;
const source = stub + section.replace(/^export (const|function|type|interface) /gm, '$1 ');
const transpiled = ts.transpileModule(source + '\nmodule.exports = { runAgent02AdvancedTurnProcessingSelfTests, runAgent02AcceleratedDayBoundaries, AGENT_02_PIPELINE_STAGE_ORDER };', {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

const sandbox: any = { module: { exports: {} }, exports: {}, console };
vm.runInNewContext(transpiled, sandbox, { filename: 'agent-02-selftest.js' });
const run = sandbox.module.exports.runAgent02AdvancedTurnProcessingSelfTests as (() => Array<{ id: string; passed: boolean; detail: string }>) | undefined;
if (!run) {
  console.error('Self-test export missing');
  process.exit(2);
}
const results = run();
const failed = results.filter(r => !r.passed);
for (const r of results) {
  console.log(`${r.passed ? 'PASS' : 'FAIL'} ${r.id} — ${r.detail}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
