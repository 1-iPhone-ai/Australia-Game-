/**
 * Maps Agent 111 integration-plan checklist rows to integration test ids.
 * Usage: node scripts/run-o111-integration-gate.mjs [b2|final]
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const gate = process.argv[2] || "b2";
const gates = {
  b2: [
    "o111_int_r5_save_load_reducer",
    "o111_int_r6_settings_chain",
    "o111_int_r7_migration_smoke",
    "o111_int_r8_turn_order",
    "o111_int_r8b_turn_counter",
    "o111_int_r9_partial_load",
    "o111_int_r12_region_travel",
    "o111_int_r13_market_work",
    "o111_int_r16_guardian_notify",
    "o111_int_canonical_reducer_chain",
    "o111_int_build_save_roundtrip",
    "o111_int_isolated_globals",
  ],
  final: [
    "o111_int_r5_save_load_reducer",
    "o111_int_r6_settings_chain",
    "o111_int_r7_migration_smoke",
    "o111_int_r8_turn_order",
    "o111_int_r8b_turn_counter",
    "o111_int_r9_partial_load",
    "o111_int_r12_region_travel",
    "o111_int_r13_market_work",
    "o111_int_r16_guardian_notify",
    "o111_int_canonical_reducer_chain",
    "o111_int_build_save_roundtrip",
    "o111_int_isolated_globals",
  ],
};

const ids = gates[gate];
if (!ids) {
  console.error(`Unknown gate "${gate}". Use: b2 | final`);
  process.exit(2);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const idList = JSON.stringify(ids);
const runner = `
import { runO111IntegrationSelfTests } from './(V9.4) australia-game-with-ai.tsx';
const required = ${idList};
const results = runO111IntegrationSelfTests().filter((t) => required.includes(t.id));
const failed = results.filter((t) => !t.passed);
for (const t of results) {
  console.log(\`\${t.passed ? 'PASS' : 'FAIL'} \${t.id}: \${t.name}\`);
}
console.log(\`Gate ${gate}: \${results.length - failed.length}/\${results.length} required integration checks passed\`);
process.exit(failed.length ? 1 : 0);
`;

const res = spawnSync("npx", ["--yes", "tsx", "-e", runner], {
  cwd: root,
  stdio: "inherit",
});

process.exit(res.status ?? 1);
