#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const code = `
import { runPlayerMatchHistorySelfTests } from './(V9.4) australia-game-with-ai.tsx';
const results = runPlayerMatchHistorySelfTests();
const failed = results.filter((r) => !r.passed);
for (const r of results) {
  console.log(r.passed ? 'OK' : 'FAIL', r.id, '-', r.name);
  if (!r.passed && r.errorMessage) console.log('  ', r.errorMessage);
}
console.log('\\n' + (results.length - failed.length) + '/' + results.length + ' passed');
process.exit(failed.length ? 1 : 0);
`;
const r = spawnSync('npx', ['--yes', 'tsx', '-e', code], { cwd: root, stdio: 'inherit', shell: false });
process.exit(r.status ?? 1);
