import { getO10mChallengeMode, O10M_CHALLENGE_MODES } from './challenge-modes.js';
import {
  buildChainForcedSettingsPatch,
  buildChainScenarioStartOverrides,
  initializeChainProgress,
  validateChainStepSelection,
} from './scenario-chains.js';
import {
  applySandboxKnobsToForcedSettings,
  applySandboxKnobsToScenarioStart,
  resolveSandboxKnobValues,
} from './sandbox-knobs.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  GameModeSelection,
  ModeInteractionRequest,
  ModeInteractionResult,
  O10mChainProgress,
  O10mChallengeModeId,
  O10mScenarioStartOverrides,
} from './types.js';
import { isSoloRivalMode } from './canonical-modes.js';

function mergeSettings(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  return { ...base, ...patch };
}

export interface ExtendedModeInteractionRequest extends ModeInteractionRequest {
  chainProgress?: O10mChainProgress | null;
}

export function resolveModeInteraction(request: ExtendedModeInteractionRequest): ModeInteractionResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let effectiveBaseMode: GameModeSelection = request.baseMode;
  let forcedSettingsMerge: Record<string, unknown> = {};
  let scenarioStartOverrides: O10mScenarioStartOverrides = {};

  const scenario = request.scenarioId ? findO10mScenario(request.scenarioId) : undefined;
  const hasScenario = Boolean(scenario || request.scenarioId);

  if (request.scenarioId && !scenario && request.scenarioId.startsWith('o10m_')) {
    errors.push(`Unknown O10M scenario id: ${request.scenarioId}`);
  }

  if (hasScenario && request.baseMode !== 'scenario' && !request.scenarioModeEnabled) {
    warnings.push('Scenario selected while base mode is not `scenario`; assembly should set selectedMode to scenario or enable scenarioModeEnabled.');
  }

  if (request.baseMode === 'single' && hasScenario) {
    errors.push('Single-player sandbox cannot host structured scenario objectives.');
  }

  if (request.baseMode === 'grand_tour' && hasScenario && request.scenarioId !== 'o10m_grand_tour_prologue') {
    warnings.push('Grand tour with non-prologue scenario may double-count challenge progression.');
  }

  if (request.chainId != null && request.chainStepIndex != null && request.scenarioId) {
    const chainCheck = validateChainStepSelection(
      request.chainId,
      request.chainProgress ?? initializeChainProgress(request.chainId),
      request.scenarioId,
      request.chainStepIndex,
    );
    if (!chainCheck.ok) {
      errors.push(...chainCheck.errors);
    } else if (request.chainProgress) {
      forcedSettingsMerge = mergeSettings(forcedSettingsMerge, buildChainForcedSettingsPatch(request.chainProgress));
      scenarioStartOverrides = buildChainScenarioStartOverrides(request.chainProgress);
    }
  }

  if (hasScenario && isSoloRivalMode(request.baseMode)) {
    effectiveBaseMode = request.baseMode === 'grand_tour' ? 'grand_tour' : 'scenario';
  }

  if (scenario) {
    forcedSettingsMerge = mergeSettings(forcedSettingsMerge, scenario.forcedSettings);
  }

  const seen = new Set<O10mChallengeModeId>();
  for (const challengeId of request.challengeModeIds) {
    if (seen.has(challengeId)) {
      errors.push(`Duplicate challenge mode: ${challengeId}`);
      continue;
    }
    seen.add(challengeId);
    const mode = getO10mChallengeMode(challengeId);
    if (mode.incompatibleBaseModes.includes(request.baseMode)) {
      errors.push(`Challenge ${challengeId} is incompatible with base mode ${request.baseMode}.`);
    }
    if (
      mode.compatibleBaseModes.length > 0 &&
      !mode.compatibleBaseModes.includes(request.baseMode)
    ) {
      warnings.push(`Challenge ${challengeId} is not in preferred list for ${request.baseMode}.`);
    }
    forcedSettingsMerge = mergeSettings(forcedSettingsMerge, mode.forcedSettingsPatch);
    for (const mod of mode.modifiers) {
      forcedSettingsMerge[`o10mModifier_${mod.id}`] = mod.value;
    }
  }

  if (request.challengeModeIds.length > 3) {
    errors.push('At most three challenge overlays may be active simultaneously.');
  }

  if (request.baseMode === 'team_ai_vs_ai' && request.challengeModeIds.includes('o10m_ironman')) {
    errors.push('Ironman overlay is disabled for team_ai_vs_ai autoplay.');
  }

  const sandboxResolved = resolveSandboxKnobValues(request.sandboxProfileId, request.sandboxKnobs);
  if (!sandboxResolved.ok) {
    errors.push(...sandboxResolved.errors);
  } else if (Object.keys(sandboxResolved.knobs).length > 0) {
    forcedSettingsMerge = applySandboxKnobsToForcedSettings(forcedSettingsMerge, sandboxResolved.knobs);
    scenarioStartOverrides = applySandboxKnobsToScenarioStart(scenarioStartOverrides, sandboxResolved.knobs);
    if (request.sandboxProfileId) {
      forcedSettingsMerge.o10mSandboxProfileId = request.sandboxProfileId;
    }
  }

  if (request.baseMode === 'single' && request.sandboxProfileId === 'o10m_sandbox_gauntlet') {
    warnings.push('Gauntlet sandbox on single mode is for mechanic testing only — no structured objectives.');
  }

  const ok = errors.length === 0;
  return {
    ok,
    errors,
    warnings,
    effectiveBaseMode,
    forcedSettingsMerge,
    scenarioStartOverrides: Object.keys(scenarioStartOverrides).length ? scenarioStartOverrides : undefined,
  };
}

export function listChallengeIncompatibilities(): Array<{ challengeId: O10mChallengeModeId; mode: GameModeSelection }> {
  const pairs: Array<{ challengeId: O10mChallengeModeId; mode: GameModeSelection }> = [];
  for (const c of O10M_CHALLENGE_MODES) {
    for (const mode of c.incompatibleBaseModes) {
      pairs.push({ challengeId: c.id, mode });
    }
  }
  return pairs;
}

/** Computes effective starting money for assembly hooks. */
export function computeEffectiveScenarioStartingMoney(
  scenarioBaseMoney: number,
  startOverrides?: O10mScenarioStartOverrides,
  chainMoneyBonus?: number,
): number {
  const mult = startOverrides?.startingMoneyMultiplier ?? 1;
  const bonus = chainMoneyBonus ?? 0;
  return Math.round(scenarioBaseMoney * mult + bonus);
}
