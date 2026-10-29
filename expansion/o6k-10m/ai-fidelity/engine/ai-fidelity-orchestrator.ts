/**
 * Turn orchestrator — plan→act→verify fidelity tick (T6-8), after team coordination hooks.
 */
import type {
  V1014AiFidelityPersisted,
  V1014AiFidelityTurnInput,
  V1014AiFidelityTurnResult,
  V1014AiFidelityRuntimeState,
  V1014AiFidelityPavPhase,
} from '../types/core';
import {
  clampAiFidelity,
  aiFidelityHash,
  aiFidelityMixSeed,
  aiFidelityExecutionRank,
} from './ai-fidelity-utils';
import {
  createEmptyV1014AiFidelityPersisted,
  sanitizeV1014AiFidelityPersisted,
} from '../persistence/migrations';
import { buildV1014AiFidelityAiBriefing } from '../ai/fidelity-read-adapters';
import { readV1014AiFidelityAcc17Slice, applyV1014AiFidelityAcc17VerifyBridge } from '../adapters/adapter-acc17-execution';
import { readV1014AiFidelity20AuSlice, applyV1014AiFidelity20AuRoutingBridge } from '../adapters/adapter-20au-team-routing';
import { readV1014AiFidelity20PaSlice, applyV1014AiFidelity20PaAdvisoryBridge } from '../adapters/adapter-20pa-advisory';
import {
  evaluateV1014AiFidelityUiUnlocks,
  countV1014AiFidelityUiSurfacesUnlocked,
} from '../adapters/adapter-20bd-ui-gates';
import { V1014_AI_FIDELITY_VERIFY_TARGET_PASS_RATE } from '../constants/teams-routes';

export { createEmptyV1014AiFidelityPersisted, sanitizeV1014AiFidelityPersisted } from '../persistence/migrations';

const PAV_PHASES: V1014AiFidelityPavPhase[] = ['plan', 'act', 'verify'];

export function v1014AiFidelityInputHash(input: V1014AiFidelityTurnInput): string {
  return aiFidelityHash({
    turn: input.turn,
    seed: input.seed,
    band: input.executionBand,
    loops: input.activeLoopIds,
    dev: input.nationalDevelopmentIndex,
  });
}

function runPavMicroLoop(input: V1014AiFidelityTurnInput, phase: V1014AiFidelityPavPhase): number {
  const mix = aiFidelityMixSeed(input.seed, input.turn, `pav_${phase}`);
  const rank = aiFidelityExecutionRank(input.executionBand);
  const base =
    input.teamCoordinationScore * 0.35 +
    (1 - clampAiFidelity(input.advisoryMonitorSeverity, 0, 1)) * 0.2 +
    rank * 0.08;
  const phaseBoost = phase === 'plan' ? 0.06 : phase === 'act' ? 0.09 : 0.11;
  return clampAiFidelity(base + phaseBoost + mix * 0.12, 0, 1);
}

export function runV1014AiFidelityTurn(input: V1014AiFidelityTurnInput): V1014AiFidelityTurnResult {
  const persisted = sanitizeV1014AiFidelityPersisted(
    input.persisted ?? createEmptyV1014AiFidelityPersisted(),
    input.turn,
  );

  const acc17 = readV1014AiFidelityAcc17Slice(input);
  const teamSlice = readV1014AiFidelity20AuSlice(input);
  const paSlice = readV1014AiFidelity20PaSlice(input);

  const phaseScores = PAV_PHASES.map(ph => runPavMicroLoop(input, ph));
  const aggregatePav = clampAiFidelity(
    (phaseScores[0] + phaseScores[1] * 1.05 + phaseScores[2] * 1.1) / 3.15,
    0,
    1,
  );

  const accBridge = applyV1014AiFidelityAcc17VerifyBridge(input, aggregatePav);
  const routeBridge = applyV1014AiFidelity20AuRoutingBridge(input, aggregatePav);
  const paBridge = applyV1014AiFidelity20PaAdvisoryBridge(input, aggregatePav);

  const verifyPassRate = clampAiFidelity(
    persisted.verifyPassRate * 0.85 +
      accBridge.verifyBoost * 0.35 +
      (accBridge.gateClosed ? -0.08 : 0.04),
    0,
    1,
  );

  const uiFlags = evaluateV1014AiFidelityUiUnlocks(input);
  const uiSurfacesUnlocked = countV1014AiFidelityUiSurfacesUnlocked(uiFlags);

  const bands = ['blocked', 'cautious', 'normal', 'accelerated', 'autonomous'] as const;
  const execRank = aiFidelityExecutionRank(input.executionBand);
  const executionBandHint = bands[clampAiFidelity(execRank + (aggregatePav > 0.72 ? 1 : 0), 0, 4)];

  const explainabilityDigest = buildV1014AiFidelityAiBriefing(
    input,
    acc17,
    teamSlice,
    paSlice,
    { aggregatePavScore: aggregatePav, verifyPassRate },
  );

  const state: V1014AiFidelityRuntimeState = {
    turn: input.turn,
    aggregatePavScore: aggregatePav,
    verifyPassRate,
    routingCoherence: routeBridge.routingCoherence,
    advisoryPressure: paBridge.advisoryPressure,
    uiSurfacesUnlocked,
    executionBandHint,
    explainabilityDigest,
    inputHash: v1014AiFidelityInputHash(input),
  };

  const loopSnapshots: V1014AiFidelityPersisted['loopSnapshots'] = { ...persisted.loopSnapshots };
  for (const loopId of input.activeLoopIds) {
    loopSnapshots[loopId] = {
      phase: PAV_PHASES[input.turn % 3],
      score: aggregatePav,
    };
  }

  const nextPersisted: V1014AiFidelityPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    loopSnapshots,
    verifyPassRate,
    routeHashes: {
      ...persisted.routeHashes,
      [`turn_${input.turn}`]: routeBridge.routeDigest,
    },
    advisoryEscalations: [...persisted.advisoryEscalations, ...paBridge.escalationIds].slice(-48),
    uiUnlockFlags: { ...persisted.uiUnlockFlags, ...uiFlags },
    explainabilityCache: {
      ...persisted.explainabilityCache,
      [`turn_${input.turn}`]: explainabilityDigest.slice(0, 280),
    },
  };

  const telemetry = [
    {
      id: `pav_${input.turn}`,
      turn: input.turn,
      kind: 'pav' as const,
      summary: `pav=${aggregatePav.toFixed(3)} target_verify=${V1014_AI_FIDELITY_VERIFY_TARGET_PASS_RATE}`,
    },
    {
      id: `verify_${input.turn}`,
      turn: input.turn,
      kind: 'verify' as const,
      summary: accBridge.gateClosed ? 'acc17_gate_closed' : 'acc17_gate_open',
    },
    {
      id: `route_${input.turn}`,
      turn: input.turn,
      kind: 'route' as const,
      summary: `20au_coherence=${routeBridge.routingCoherence.toFixed(3)}`,
    },
    {
      id: `adv_${input.turn}`,
      turn: input.turn,
      kind: 'advisory' as const,
      summary: `20pa_pressure=${paBridge.advisoryPressure.toFixed(3)}`,
    },
  ];

  return { state, persisted: nextPersisted, telemetry };
}

export function buildV1014AiFidelityTurnInputFromGameState(
  gs: { turn?: number; seed?: number },
  turn: number,
): V1014AiFidelityTurnInput {
  return {
    turn,
    seed: typeof gs.seed === 'number' ? gs.seed : 9001,
    executionBand: 'normal',
    acc17QueueDepth: 4,
    teamCoordinationScore: 0.58,
    advisoryMonitorSeverity: 0.22,
    nationalDevelopmentIndex: 0.42,
    featureFlagsEnabled: true,
    activeLoopIds: ['pav_loop_001', 'pav_loop_002'],
    persisted: null,
  };
}
