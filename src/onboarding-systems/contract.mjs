#!/usr/bin/env node
/**
 * Operation 111 · Agent 72 — static onboarding architecture contracts against the V9.4 monolith.
 * Does not execute game code; verifies required symbols and wiring strings remain present.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const monolith = join(root, '(V9.4) australia-game-with-ai.tsx');

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function check(name, ok) {
  if (ok) console.log(`OK  ${name}`);
  else fail(name);
}

let src;
try {
  src = readFileSync(monolith, 'utf8');
} catch {
  fail(`missing monolith at ${monolith}`);
  process.exit(1);
}

const mustInclude = [
  ['DEFAULT playerIntentOnboardingEnabled', /playerIntentOnboardingEnabled: true/],
  ['playerIntentOnboardingDismissed default', /playerIntentOnboardingDismissed: \[\] as string\[\]/],
  ['guidedLearning settings slot', /guidedLearning: null as any/],
  ['collectIntentOnboardingHints exported', /export function collectIntentOnboardingHints\(/],
  ['intent hint dismiss wiring', /playerIntentOnboardingDismissed: \[\.\.\.\(prev\.playerIntentOnboardingDismissed/],
  ['usesGuidedIntentChrome exported', /export function usesGuidedIntentChrome\(/],
  ['resolveIntentNavToUiPatch exported', /export function resolveIntentNavToUiPatch\(/],
  ['SECTION 20N guided learning', /SECTION 20N: V9\.2 GUIDED LEARNING/],
  ['resolveLearningMode exported', /export function resolveLearningMode\(/],
  ['selectNextLearningMoment exported', /export function selectNextLearningMoment\(/],
  ['sanitizeLearningState exported', /export function sanitizeLearningState\(/],
  ['LEARNING_LIMITS bounded hints', /export const LEARNING_LIMITS = \{ recentHints:/],
  ['LEARNING_CONCEPTS registry', /export const LEARNING_CONCEPTS: LearningConceptDefinition\[\]/],
  ['getScenarioLearnTags exported', /export function getScenarioLearnTags\(/],
  ['runV9GuidedLearningSelfTests exported', /export function runV9GuidedLearningSelfTests\(/],
  ['v92 suite registration', /\{ id: 'v92', label: 'V9\.2 Guided Learning'/],
  ['autoModeOnboardingComplete default', /autoModeOnboardingComplete: false/],
  ['Auto Mode onboarding wizard copy', /Who should Auto Mode manage\?/],
  ['save migration onboarding enabled', /Defaulted playerIntentOnboardingEnabled/],
  ['gl welcome test id', /data-testid="gl-welcome"/],
  ['learning mode maps onboarding off', /playerIntentOnboardingEnabled === false \|\| learning\?\.skipGuidance\) return 'off'/],
];

for (const [name, re] of mustInclude) {
  check(name, re.test(src));
}

if (process.exitCode) {
  console.error('\nOnboarding systems contract: FAILED');
  process.exit(process.exitCode);
}
console.log('\nOnboarding systems contract: PASSED');
