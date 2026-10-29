/**
 * Operation 111 · Agent 107 — static contracts on the V9.4 monolith.
 * Run: npm run test:national-resilience-contracts
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const monolith = join(root, '(V9.4) australia-game-with-ai.tsx');
const src = readFileSync(monolith, 'utf8');

const checks = [];

function mustInclude(label, pattern) {
  const ok = typeof pattern === 'string' ? src.includes(pattern) : pattern.test(src);
  checks.push({ label, ok });
}

function mustNotInclude(label, pattern) {
  const ok = !(typeof pattern === 'string' ? src.includes(pattern) : pattern.test(src));
  checks.push({ label, ok });
}

// Section ownership
mustInclude('V10.0 National Systems section', 'SECTION 20S: V10.0 NATIONAL SYSTEMS');
mustInclude('V10.6 Systemic Risk section', 'SECTION 20Y: V10.6 RESILIENCE, DEPENDENCIES & SYSTEMIC RISK');
mustInclude('V10.6 never writes canonical state (comment)', /V10\.6 never writes any of them/);

// Distinct band types
mustInclude('NationalResilienceBand type', 'export type NationalResilienceBand');
mustInclude('SystemicRiskBand type', 'export type SystemicRiskBand');
mustInclude('Distinct national resilience labels', 'highly_resilient');
mustInclude('Distinct systemic robust band', "'robust'");

// Persistence schemas
mustInclude('NationalSystemsPersisted schema 10.0', "schemaVersion: '10.0'");
mustInclude('SystemicRiskPersisted schema 10.6', "schemaVersion: '10.6'");

// Liquidity / debt boundary (Agent 24 alignment)
mustInclude('buildSystemicRiskInputs uses calculateActorOutstandingDebt', 'debt: calculateActorOutstandingDebt(v)');
mustInclude('buildSystemicRiskInputs uses extractActorDebt', /extractActorDebt\(v\)/);

// Feature flags
mustInclude('systemicRiskEnabled default', 'systemicRiskEnabled: true');
mustInclude('Match-scoped systemicRiskEnabled', "'systemicRiskEnabled'");

// Self-test suites
mustInclude('V10.6 self-test runner', 'export function runV106ResilienceSystemicRiskSelfTests');
mustInclude('O111 Agent 107 self-test runner', 'export function runO111NationalResilienceSelfTests');
mustInclude('V95 suite o111_a107', "id: 'o111_a107'");

// Propagation limits documented
mustInclude('V106_LIMITS maxDepth', 'maxDepth: 3');
mustInclude('V106_LIMITS maxNodes', 'maxNodes: 24');

// National resilience hysteresis
mustInclude('NS_RES_RANK hysteresis', 'NS_RES_RANK');
mustInclude('nationalBand persisted', 'nationalBand: NationalResilienceBand');

// V10.6 graph built from real structure
mustInclude('v106Graph from national dependencies', 'ns?.dependencies');

const failed = checks.filter((c) => !c.ok);
if (failed.length) {
  console.error('National resilience contract failures:');
  failed.forEach((f) => console.error(`  ✗ ${f.label}`));
  process.exit(1);
}
console.log(`National resilience contracts: ${checks.length}/${checks.length} passed`);
