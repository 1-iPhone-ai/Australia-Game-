/**
 * Agent 25 projection handoff brief — wave 56 (O10-254) @ integration baseline c4bbec67 / 3,054,213 projected.
 */

export interface Agent25Wave56IntegrationMonitor {
  shouldRunO10m254DryRun: boolean;
  wave56GateBand: 'ready' | 'blocked' | 'pending';
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
}

export interface Agent25Wave56GateTrajectorySnapshot {
  trajectory: 'improving' | 'stable' | 'deteriorating';
  band: 'ready' | 'watch' | 'blocked';
}

export interface Agent25Wave56ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave56: boolean;
  shouldRunO10m254DryRun: boolean;
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
  headlines: string[];
  summary: string;
}

export function composeAgent25Wave56ProjectionHandoffBrief(args: {
  turn: number;
  wave56IntegrationMonitor: Agent25Wave56IntegrationMonitor;
  wave56GateTrajectory?: Agent25Wave56GateTrajectorySnapshot;
}): Agent25Wave56ProjectionHandoffBrief {
  const shouldProjectWave56 =
    args.wave56IntegrationMonitor.shouldRunO10m254DryRun &&
    args.wave56GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave56) {
    headlines.push('Agent 25: project wave 55 module gate / O10-254 dry-run');
  } else {
    headlines.push('Agent 25 wave 55 projection deferred — integration gate not stable');
  }
  if (args.wave56GateTrajectory?.band === 'ready') {
    headlines.push('Wave 55 gate trajectory ready for O10-254 projection handoff');
  }
  if (args.wave56IntegrationMonitor.wave56GateBand === 'blocked') {
    headlines.push('Wave 55 gate blocked — hold O10-254 handoff');
  }

  const summary = `project=${shouldProjectWave56} o10m247=${args.wave56IntegrationMonitor.shouldRunO10m254DryRun} baseline=${args.wave56IntegrationMonitor.integrationBaselineSha.slice(0, 8)} projected=${args.wave56IntegrationMonitor.projectedAuditedFunctional}`;

  return {
    turn: args.turn,
    shouldProjectWave56,
    shouldRunO10m254DryRun: args.wave56IntegrationMonitor.shouldRunO10m254DryRun,
    integrationBaselineSha: args.wave56IntegrationMonitor.integrationBaselineSha,
    projectedAuditedFunctional: args.wave56IntegrationMonitor.projectedAuditedFunctional,
    headlines: headlines.slice(0, 3),
    summary,
  };
}

export function runAgent13Agent25Wave56ProjectionHandoffBriefSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  const brief = composeAgent25Wave56ProjectionHandoffBrief({
    turn: 56,
    wave56IntegrationMonitor: {
      shouldRunO10m254DryRun: true,
      wave56GateBand: 'ready',
      integrationBaselineSha: '8e2366bb438a75b184f0fe47cc2b0247a32059cb',
      projectedAuditedFunctional: 3_084_921,
    },
    wave56GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(brief.shouldProjectWave56);
  ok(brief.projectedAuditedFunctional === 3_084_921);
  ok(brief.integrationBaselineSha.startsWith('8e2366bb'));
  ok(brief.headlines.length >= 1);

  return { passed, failed, total: passed + failed };
}
