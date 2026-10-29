/**
 * O111 Agent 93 — headless cross-system integration runner.
 * Executes runO111IntegrationSelfTests() from the V9.4 monolith via tsx.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const runner = `
import { runO111IntegrationSelfTests } from './(V9.4) australia-game-with-ai.tsx';
const results = runO111IntegrationSelfTests();
const failed = results.filter((t) => !t.passed);
for (const t of results) {
  const tag = t.passed ? 'PASS' : 'FAIL';
  console.log(\`\${tag} \${t.id || t.name}: \${t.name}\${t.detail && t.detail !== 'ok' ? ' — ' + t.detail : ''}\`);
}
console.log('');
console.log(\`\${results.length - failed.length}/\${results.length} passed\`);
process.exit(failed.length ? 1 : 0);
`;

const res = spawnSync("npx", ["--yes", "tsx", "-e", runner], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

process.exit(res.status ?? 1);
