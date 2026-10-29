import type {
  Agent17DevTestReport,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
import { evaluateAcc17CommandCenterOperations } from '../evaluation/operations-evaluator.ts';
import { acc17ComputeRelevantStateFingerprint } from '../planning/fingerprint.ts';
import {
  acc17AdvanceVerifiedPlanProgress,
  acc17CreateMultiStepPlanFromObjective,
  createDefaultAcc17CommandCenterOpsState,
  defaultObjectiveResolver,
  sanitizeAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';

export function runAgent17Acc17DevTests(
  customState?: Agent17GameStateSlice,
  customSettings?: Agent17SettingsSlice
): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const actor = { id: 'player', money: 5000, netWorth: 8000, currentRegion: 'NSW' };
    const baseState: Agent17GameStateSlice = customState || {
      turnCounter: 3,
      day: 3,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        id: 'c1',
        sourceType: 'contract',
        sourceId: 'c1',
        title: 'Test Contract',
      },
      lastExecutedAction: { type: 'wait' },
    };
    const settings: Agent17SettingsSlice = customSettings || {
      aiCommunicationAutonomyLevel: 'assisted',
      commandCenterSettings: { enabled: true },
    };

    const fp1 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
    const mutated: Agent17GameStateSlice = {
      ...baseState,
      player: { ...actor, money: 5100 },
      lastExecutedAction: { type: 'travel' },
    };
    const fp3 = acc17ComputeRelevantStateFingerprint(mutated, 'player');
    push('acc17_fp_delta', 'Fingerprint reacts to state delta', fp1 !== fp3, `${fp1}/${fp3}`);

    const plan = acc17CreateMultiStepPlanFromObjective(
      baseState,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    push('acc17_plan', 'Objective spawns multi-step plan', !!plan && plan!.steps.length >= 3);

    let ops = createDefaultAcc17CommandCenterOpsState();
    ops = { ...ops, activePlan: plan, lastContextFingerprint: fp1 };
    const noAdvance = acc17AdvanceVerifiedPlanProgress(plan!, baseState, 'player', fp1);
    push(
      'acc17_gate_same_fp',
      'No verification log when fingerprint unchanged',
      noAdvance.logEntries.length === 0
    );

    ops = { ...ops, lastContextFingerprint: fp3 };
    const evalRes = evaluateAcc17CommandCenterOperations(mutated, settings, 'player', ops);
    push(
      'acc17_context',
      'Deep context slices populated',
      evalRes.snapshot.deepContext.slices.length >= 1
    );
    push(
      'acc17_delegate',
      'Delegated project created',
      evalRes.snapshot.delegatedProjects.length >= 1
    );
    push(
      'acc17_sanitize',
      'Sanitizer returns v1',
      sanitizeAcc17CommandCenterOpsState({ version: 2 }).version === 1
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('acc17_throw', 'Harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 ACC17 Dev Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
