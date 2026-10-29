/**
 * Agent 25 projection handoff brief — wave 57 (O10-260) @ integration baseline c4bbec67 / 3,054,213 projected.
 */

export interface Agent25Wave58IntegrationMonitor {
  shouldRunO10m260DryRun: boolean;
  wave58GateBand: 'ready' | 'blocked' | 'pending';
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
}

export interface Agent25Wave58GateTrajectorySnapshot {
  trajectory: 'improving' | 'stable' | 'deteriorating';
  band: 'ready' | 'watch' | 'blocked';
}

export interface Agent25Wave58ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave58: boolean;
  shouldRunO10m260DryRun: boolean;
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
  headlines: string[];
  summary: string;
}

export function composeAgent25Wave58ProjectionHandoffBrief(args: {
  turn: number;
  wave58IntegrationMonitor: Agent25Wave58IntegrationMonitor;
  wave58GateTrajectory?: Agent25Wave58GateTrajectorySnapshot;
}): Agent25Wave58ProjectionHandoffBrief {
  const shouldProjectWave58 =
    args.wave58IntegrationMonitor.shouldRunO10m260DryRun &&
    args.wave58GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave58) {
    headlines.push('Agent 25: project wave 55 module gate / O10-260 dry-run');
  } else {
    headlines.push('Agent 25 wave 56 projection deferred — integration gate not stable');
  }
  if (args.wave58GateTrajectory?.band === 'ready') {
    headlines.push('Wave 56 gate trajectory ready for O10-260 projection handoff');
  }
  if (args.wave58IntegrationMonitor.wave58GateBand === 'blocked') {
    headlines.push('Wave 56 gate blocked — hold O10-260 handoff');
  }

  const summary = `project=${shouldProjectWave58} o10m254=${args.wave58IntegrationMonitor.shouldRunO10m260DryRun} baseline=${args.wave58IntegrationMonitor.integrationBaselineSha.slice(0, 8)} projected=${args.wave58IntegrationMonitor.projectedAuditedFunctional}`;

  return {
    turn: args.turn,
    shouldProjectWave58,
    shouldRunO10m260DryRun: args.wave58IntegrationMonitor.shouldRunO10m260DryRun,
    integrationBaselineSha: args.wave58IntegrationMonitor.integrationBaselineSha,
    projectedAuditedFunctional: args.wave58IntegrationMonitor.projectedAuditedFunctional,
    headlines: headlines.slice(0, 3),
    summary,
  };
}

export function runAgent13Agent25Wave58ProjectionHandoffBriefSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  const brief = composeAgent25Wave58ProjectionHandoffBrief({
    turn: 57,
    wave58IntegrationMonitor: {
      shouldRunO10m260DryRun: true,
      wave58GateBand: 'ready',
      integrationBaselineSha: 'feb7e524ca511c106896e93b47329106a1786db6',
      projectedAuditedFunctional: 3_139_519,
    },
    wave58GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(brief.shouldProjectWave58);
  ok(brief.projectedAuditedFunctional === 3_139_519);
  ok(brief.integrationBaselineSha.startsWith('feb7e524'));
  ok(brief.headlines.length >= 1);

  return { passed, failed, total: passed + failed };
}
