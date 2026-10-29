import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tsxBin = resolve(root, 'node_modules/tsx/dist/cli.mjs');
const inline = `
import { runO111SimulationPerformanceSelfTests } from './(V9.4) australia-game-with-ai.tsx';
const results = runO111SimulationPerformanceSelfTests();
const failed = results.filter((t) => !t.passed);
console.log(\`O111 Agent 86 self-tests: \${results.length - failed.length}/\${results.length} passed\`);
for (const t of results) {
  const mark = t.passed ? 'PASS' : 'FAIL';
  console.log(\` \${mark} \${t.id} — \${t.name}\${t.detail ? \`: \${t.detail}\` : ''}\`);
}
process.exit(failed.length ? 1 : 0);
`;

const r = spawnSync(process.execPath, [tsxBin, '--eval', inline], { cwd: root, stdio: 'inherit', env: process.env });
process.exit(r.status ?? 1);
