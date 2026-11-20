/**
 * Headless V9.5 quick release check (Agent 91 evidence).
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gamePath = path.resolve(__dirname, '../(V9.4) australia-game-with-ai.tsx');

// Minimal React stub so the monolith module can load without DOM.
globalThis.React = await import('react');
globalThis.ReactDOM = await import('react-dom');

const mod = await import(pathToFileURL(gamePath).href);
const { runV95ReleaseCheck } = mod;

const { report, checks } = await runV95ReleaseCheck('quick');
const failed = checks.filter((c) => !c.passed);
console.log(JSON.stringify({
  status: report.status,
  mode: 'quick',
  checkCount: checks.length,
  failedCount: failed.length,
  failed: failed.map((c) => ({ id: c.id, name: c.name, severity: c.severity, detail: c.detail?.slice(0, 200) })),
}, null, 2));
process.exit(failed.some((c) => c.severity === 'BLOCKER' || c.severity === 'CRITICAL') ? 1 : 0);
