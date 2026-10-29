import fs from 'node:fs';
import path from 'node:path';

export const BASELINE_RELATIVE = '(V9.4) australia-game-with-ai.tsx';

export function resolveBaselinePath(cwd = process.cwd()): string {
  return path.resolve(cwd, BASELINE_RELATIVE);
}

/** Pure exports Agent 48 contract tests expect on the canonical baseline. */
export const REQUIRED_AUTOMATION_ENGINE_EXPORTS = [
  'evaluateHumanAutomationTrigger',
  'buildHumanAutomationDecision',
  'evaluateHumanAutomationExecutionEligibility',
  'checkHumanAutomationSafetyLimits',
  'detectHumanAutomationConflicts',
  'sanitizeHumanAutomation',
  'sanitizeHumanAutomations',
  'exportHumanAutomationsJSON',
  'importHumanAutomationsJSON',
  'instantiateHumanAutomationTemplate',
  'validateAutoModeActionAgainstSmartBoundaries',
  'applySmartSettingsPlan',
  'undoSmartSettingsTransaction',
  'checkLiveMatchSafety',
  'flushTurnEndDeferredSettings',
  'flushMatchWideDeferredSettings',
] as const;

export const REQUIRED_SECTION_MARKERS = [
  '// SECTION 11: AUTOMATION AND ADVANCED GAME SYSTEMS',
  '// Human Player Automation and Action Rules System, Phase HA1',
  'runHumanAutomationsForPlayer',
  'testHumanAutomationAgainstCurrentState',
] as const;

export function readBaseline(cwd = process.cwd()): string {
  const filePath = resolveBaselinePath(cwd);
  return fs.readFileSync(filePath, 'utf8');
}

export function findMissingExports(source: string): string[] {
  return REQUIRED_AUTOMATION_ENGINE_EXPORTS.filter(
    (name) => !new RegExp(`export (const|function) ${name}\\b`).test(source)
  );
}

export function findMissingMarkers(source: string): string[] {
  return REQUIRED_SECTION_MARKERS.filter((marker) => !source.includes(marker));
}

export function extractExportBlock(source: string, exportName: string): string | null {
  const fnMatch = source.match(
    new RegExp(`export function ${exportName}\\([^]*?\\n\\}`, 'm')
  );
  if (fnMatch) return fnMatch[0];
  const constMatch = source.match(
    new RegExp(`export const ${exportName} = [^;]+;`, 'm')
  );
  return constMatch ? constMatch[0] : null;
}
