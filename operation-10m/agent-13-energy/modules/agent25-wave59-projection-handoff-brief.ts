/**
 * Agent 25 projection handoff brief — wave 57 (O10-263) @ integration baseline c4bbec67 / 3,054,213 projected.
 */

export interface Agent25Wave59IntegrationMonitor {
  shouldRunO10m263DryRun: boolean;
  wave59GateBand: 'ready' | 'blocked' | 'pending';
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
}

export interface Agent25Wave59GateTrajectorySnapshot {
  trajectory: 'improving' | 'stable' | 'deteriorating';
  band: 'ready' | 'watch' | 'blocked';
}

export interface Agent25Wave59ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave59: boolean;
  shouldRunO10m263DryRun: boolean;
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
  headlines: string[];
  summary: string;
}

export function composeAgent25Wave59ProjectionHandoffBrief(args: {
  turn: number;
  wave59IntegrationMonitor: Agent25Wave59IntegrationMonitor;
  wave59GateTrajectory?: Agent25Wave59GateTrajectorySnapshot;
}): Agent25Wave59ProjectionHandoffBrief {
  const shouldProjectWave59 =
    args.wave59IntegrationMonitor.shouldRunO10m263DryRun &&
    args.wave59GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave59) {
    headlines.push('Agent 25: project wave 55 module gate / O10-263 dry-run');
  } else {
    headlines.push('Agent 25 wave 56 projection deferred — integration gate not stable');
  }
  if (args.wave59GateTrajectory?.band === 'ready') {
    headlines.push('Wave 56 gate trajectory ready for O10-263 projection handoff');
  }
  if (args.wave59IntegrationMonitor.wave59GateBand === 'blocked') {
    headlines.push('Wave 56 gate blocked — hold O10-263 handoff');
  }

  const summary = `project=${shouldProjectWave59} o10m254=${args.wave59IntegrationMonitor.shouldRunO10m263DryRun} baseline=${args.wave59IntegrationMonitor.integrationBaselineSha.slice(0, 8)} projected=${args.wave59IntegrationMonitor.projectedAuditedFunctional}`;

  return {
    turn: args.turn,
    shouldProjectWave59,
    shouldRunO10m263DryRun: args.wave59IntegrationMonitor.shouldRunO10m263DryRun,
    integrationBaselineSha: args.wave59IntegrationMonitor.integrationBaselineSha,
    projectedAuditedFunctional: args.wave59IntegrationMonitor.projectedAuditedFunctional,
    headlines: headlines.slice(0, 3),
    summary,
  };
}

export function runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  const brief = composeAgent25Wave59ProjectionHandoffBrief({
    turn: 57,
    wave59IntegrationMonitor: {
      shouldRunO10m263DryRun: true,
      wave59GateBand: 'ready',
      integrationBaselineSha: '4182618c60ef4f19fc7d6911ee33123124fa6a23',
      projectedAuditedFunctional: 3_166_371,
    },
    wave59GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(brief.shouldProjectWave59);
  ok(brief.projectedAuditedFunctional === 3_166_371);
  ok(brief.integrationBaselineSha.startsWith('4182618c'));
  ok(brief.headlines.length >= 1);

  return { passed, failed, total: passed + failed };
}
