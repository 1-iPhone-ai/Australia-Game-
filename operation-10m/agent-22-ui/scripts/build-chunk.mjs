#!/usr/bin/env node
/**
 * Bundles agent-22-ui src into operation-10m/modules/agent-22-ui/chunk.tsx (no local imports).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-22-ui/src');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-22-ui');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'types/progression.ts',
  'types/accessibility.ts',
  'types/access-policy.ts',
  'registry/modal-panel-definitions.ts',
  'registry/progression-milestones.ts',
  'registry/launcher-panel-definitions.ts',
  'registry/panel-definitions.ts',
  'sim/evolution-hooks.ts',
  'engine/progression-signals.ts',
  'engine/unlock-hint-formatter.ts',
  'engine/phase-panel-policy.ts',
  'sim/onboarding-funnel.ts',
  'sim/session-ui-memory.ts',
  'engine/layout-preset-evolution.ts',
  'engine/notification-lane-progression.ts',
  'engine/resolve-panel-visibility.ts',
  'engine/layout-aware-visibility.ts',
  'engine/keyboard-shortcut-progression.ts',
  'engine/contextual-quick-actions.ts',
  'engine/ui-density-progression.ts',
  'engine/focus-session-policy.ts',
  'engine/responsive-layout-hints.ts',
  'engine/motion-timing-profile.ts',
  'engine/announcement-pacing-policy.ts',
  'engine/cognitive-load-governor.ts',
  'engine/attention-budget-scheduler.ts',
  'engine/ui-calm-recovery-policy.ts',
  'engine/touch-target-scaling.ts',
  'engine/coach-dismissal-backoff.ts',
  'engine/landmark-reading-order.ts',
  'engine/high-contrast-chrome-policy.ts',
  'engine/announcement-dedup-ledger.ts',
  'engine/modal-focus-restoration.ts',
  'engine/attention-surface-gate.ts',
  'engine/paced-announcement-scheduler.ts',
  'engine/keyboard-shortcut-conflict-guard.ts',
  'engine/live-region-priority-queue.ts',
  'engine/deferred-announcement-flush.ts',
  'engine/session-resume-coach.ts',
  'engine/memory-weighted-quick-actions.ts',
  'engine/accessible-chrome-shell.ts',
  'engine/onboarding-persist-bridge.ts',
  'engine/responsive-nav-rail-plan.ts',
  'engine/coach-live-region-scheduler.ts',
  'engine/layout-onboarding-visibility.ts',
  'engine/phase-coach-gate.ts',
  'engine/show-all-progressive-safety.ts',
  'engine/progression-coverage-snapshot.ts',
  'engine/keyboard-hints-priority-plan.ts',
  'engine/contextual-widget-coach.ts',
  'engine/notification-lane-coach-plan.ts',
  'engine/layout-preset-density-bridge.ts',
  'engine/progression-signal-delta.ts',
  'engine/modal-focus-trap-registry.ts',
  'engine/legacy-access.ts',
  'engine/merge-with-v94-contextual-hiding.ts',
  'engine/progression-coach.ts',
  'engine/scale-wave-self-tests.ts',
  'engine/round3-self-tests.ts',
  'engine/round4-self-tests.ts',
  'engine/round5-self-tests.ts',
  'engine/round6-self-tests.ts',
  'engine/round7-self-tests.ts',
  'engine/round8-self-tests.ts',
  'engine/round9-self-tests.ts',
  'engine/round10-self-tests.ts',
  'engine/round11-self-tests.ts',
  'engine/round12-self-tests.ts',
  'engine/round13-self-tests.ts',
  'a11y/aria-builders.ts',
  'a11y/focus-management.ts',
  'a11y/live-region-controller.ts',
  'adapters/v94-settings-bridge.ts',
  'adapters/v94-phase-bridge.ts',
  'fixtures/stories/index.ts',
  'react/ProgressionPanelShell.tsx',
  'react/EvolvingNavRail.tsx',
  'react/AccessibilityAnnouncer.tsx',
  'react/ShowAllPanelsToggle.tsx',
  'react/PanelUnlockCoach.tsx',
  'react/EvolvingUiProgressLab.tsx',
  'react/SimulationUiEvolutionBridge.tsx',
  'react/ContextualQuickActionRail.tsx',
  'react/KeyboardHintsOverlay.tsx',
  'react/UiDensitySelector.tsx',
  'react/FocusSessionBanner.tsx',
  'react/CognitiveLoadCoachBanner.tsx',
  'react/UiCalmRecoveryBanner.tsx',
  'react/CoachDismissalBackoffBanner.tsx',
  'react/LandmarkSkipLinksStrip.tsx',
  'react/AnnouncementDedupStatusBanner.tsx',
  'react/ModalFocusRestoreStrip.tsx',
  'react/MotionTimingChromeRoot.tsx',
  'react/PacedAnnouncementStatusStrip.tsx',
  'react/KeyboardShortcutConflictBanner.tsx',
  'react/SessionResumeCoachStrip.tsx',
  'react/DeferredAnnouncementFlushBanner.tsx',
  'react/OnboardingFunnelCoachStrip.tsx',
  'react/ResponsiveNavRailHintBanner.tsx',
  'react/CoachLiveRegionDeliveryStrip.tsx',
  'react/PhaseCoachGateBanner.tsx',
  'react/ProgressionCoverageCoachStrip.tsx',
  'react/ShowAllSafetyCoachBanner.tsx',
  'react/NotificationLaneCoachStrip.tsx',
  'react/LayoutPresetDensityHintBanner.tsx',
  'react/ProgressionSignalDeltaBanner.tsx',
  'react/ModalFocusTrapStatusStrip.tsx',
];

function stripModulePreamble(source) {
  const lines = source.split('\n');
  const out = [];
  let skip = false;
  for (const line of lines) {
    const t = line.trim();
    if (skip) {
      if (t.includes(';') || /^from\s+['"]/.test(t)) skip = false;
      continue;
    }
    if (/^import\s/.test(t)) {
      if (!t.includes(';') && !/from\s+['"]/.test(t)) skip = true;
      continue;
    }
    if (/^export\s+\*\s+from\s+['"]/.test(t)) continue;
    if (/^export\s+\{[^}]*\}\s+from\s+['"]/.test(t)) continue;
    out.push(line);
  }
  return out.join('\n').trim();
}

const bodyParts = [
  '// Operation 10M — Agent 22 Evolving UI & Accessibility',
  '// Generated from operation-10m/agent-22-ui/src/ — regenerate: npm run build:agent22-chunk',
  '',
];

for (const rel of FILES) {
  const abs = path.join(srcRoot, rel);
  if (!fs.existsSync(abs)) {
    console.error('Missing source file:', rel);
    process.exit(1);
  }
  bodyParts.push(`// --- source: ${rel} ---`);
  bodyParts.push(stripModulePreamble(fs.readFileSync(abs, 'utf8')));
  bodyParts.push('');
}

bodyParts.push(`export const AGENT_22_MODULE_ID = 'operation-10m/agent-22-ui';`);
bodyParts.push(`export const AGENT_22_MODULE_VERSION = '1.13.0';`);
bodyParts.push('');
bodyParts.push(`export function runOp10mAgent22EvolvingUiSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'agent22_essential_map',
    'essential map panel visible day 1 simple',
    resolveEvolvingPanelVisibility(
      'nav_map',
      { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    ).state === 'visible'
  );

  check(
    'agent22_legacy_loans',
    'legacy nav loans always patches',
    resolveLegacyUiAccess({ target: 'loans', source: 'intent_nav' }, DEFAULT_EVOLVING_UI_ACCESS_POLICY).allowed &&
      Boolean(resolveLegacyUiAccess({ target: 'loans', source: 'intent_nav' }, DEFAULT_EVOLVING_UI_ACCESS_POLICY).uiPatch.showAdvancedLoans)
  );

  check(
    'agent22_registry_unique',
    'panel registry ids unique',
    Object.keys(EVOLVING_UI_PANEL_BY_ID).length === EVOLVING_UI_PANEL_REGISTRY.length
  );

  for (const story of ALL_STORY_FIXTURES) {
    for (const target of story.expectedLegacyNavAlwaysWorks) {
      const access = resolveLegacyUiAccess({ target, source: 'deep_link' }, story.policy);
      check(
        \`agent22_story_\${story.id}_legacy_\${target}\`,
        \`\${story.id} legacy \${target}\`,
        access.allowed && Object.keys(access.uiPatch).length > 0
      );
    }
  }

  const scale = runAgent22ScaleWaveSelfTests();
  for (const r of scale.results) {
    check(\`agent22_scale_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round3 = runAgent22Round3SelfTests();
  for (const r of round3.results) {
    check(\`agent22_round3_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round4 = runAgent22Round4SelfTests();
  for (const r of round4.results) {
    check(\`agent22_round4_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round5 = runAgent22Round5SelfTests();
  for (const r of round5.results) {
    check(\`agent22_round5_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round6 = runAgent22Round6SelfTests();
  for (const r of round6.results) {
    check(\`agent22_round6_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round7 = runAgent22Round7SelfTests();
  for (const r of round7.results) {
    check(\`agent22_round7_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round8 = runAgent22Round8SelfTests();
  for (const r of round8.results) {
    check(\`agent22_round8_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round9 = runAgent22Round9SelfTests();
  for (const r of round9.results) {
    check(\`agent22_round9_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round10 = runAgent22Round10SelfTests();
  for (const r of round10.results) {
    check(\`agent22_round10_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round11 = runAgent22Round11SelfTests();
  for (const r of round11.results) {
    check(\`agent22_round11_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round12 = runAgent22Round12SelfTests();
  for (const r of round12.results) {
    check(\`agent22_round12_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const round13 = runAgent22Round13SelfTests();
  for (const r of round13.results) {
    check(\`agent22_round13_\${r.id}\`, r.name, r.passed, r.detail);
  }

  const failed = results.filter(r => !r.passed).length;
  return {
    passed: results.length - failed,
    failed,
    total: results.length,
    allPassed: failed === 0,
    results,
  };
}`);

const body = bodyParts.join('\n');
const contentSha256 = createHash('sha256').update(body).digest('hex');
const hash = contentSha256.slice(0, 16);
const chunk = `// OP10M_MODULE_BEGIN agent-22-ui\n// content-sha256-prefix: ${hash}\n${body}\n// OP10M_MODULE_END agent-22-ui\n`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, chunk, 'utf8');

const manifest = {
  moduleId: 'agent-22-ui',
  slot: 'post-v10z',
  touchesSaveFormat: false,
  proposedGameSettingsField: 'evolvingUi',
  contentSha256,
  chunkPath: 'operation-10m/modules/agent-22-ui/chunk.tsx',
  selfTestExport: 'runOp10mAgent22EvolvingUiSelfTests',
  moduleVersion: '1.13.0',
};
fs.writeFileSync(
  path.join(outDir, 'module.manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8'
);

console.log('Wrote', outFile, `(${chunk.split('\n').length} lines, sha256~${hash}, manifest ${contentSha256.slice(0, 12)}…)`);
