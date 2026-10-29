/**
 * Agent 25 projection handoff brief — wave 55 (O10-247) @ integration baseline c4bbec67 / 3,054,213 projected.
 */

export interface Agent25Wave55IntegrationMonitor {
  shouldRunO10m247DryRun: boolean;
  wave55GateBand: 'ready' | 'blocked' | 'pending';
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
}

export interface Agent25Wave55GateTrajectorySnapshot {
  trajectory: 'improving' | 'stable' | 'deteriorating';
  band: 'ready' | 'watch' | 'blocked';
}

export interface Agent25Wave55ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave55: boolean;
  shouldRunO10m247DryRun: boolean;
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
  headlines: string[];
  summary: string;
}

export function composeAgent25Wave55ProjectionHandoffBrief(args: {
  turn: number;
  wave55IntegrationMonitor: Agent25Wave55IntegrationMonitor;
  wave55GateTrajectory?: Agent25Wave55GateTrajectorySnapshot;
}): Agent25Wave55ProjectionHandoffBrief {
  const shouldProjectWave55 =
    args.wave55IntegrationMonitor.shouldRunO10m247DryRun &&
    args.wave55GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave55) {
    headlines.push('Agent 25: project wave 55 module gate / O10-247 dry-run');
  } else {
    headlines.push('Agent 25 wave 55 projection deferred — integration gate not stable');
  }
  if (args.wave55GateTrajectory?.band === 'ready') {
    headlines.push('Wave 55 gate trajectory ready for O10-247 projection handoff');
  }
  if (args.wave55IntegrationMonitor.wave55GateBand === 'blocked') {
    headlines.push('Wave 55 gate blocked — hold O10-247 handoff');
  }

  const summary = `project=${shouldProjectWave55} o10m247=${args.wave55IntegrationMonitor.shouldRunO10m247DryRun} baseline=${args.wave55IntegrationMonitor.integrationBaselineSha.slice(0, 8)} projected=${args.wave55IntegrationMonitor.projectedAuditedFunctional}`;

  return {
    turn: args.turn,
    shouldProjectWave55,
    shouldRunO10m247DryRun: args.wave55IntegrationMonitor.shouldRunO10m247DryRun,
    integrationBaselineSha: args.wave55IntegrationMonitor.integrationBaselineSha,
    projectedAuditedFunctional: args.wave55IntegrationMonitor.projectedAuditedFunctional,
    headlines: headlines.slice(0, 3),
    summary,
  };
}

export function runAgent13Agent25Wave55ProjectionHandoffBriefSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  const brief = composeAgent25Wave55ProjectionHandoffBrief({
    turn: 55,
    wave55IntegrationMonitor: {
      shouldRunO10m247DryRun: true,
      wave55GateBand: 'ready',
      integrationBaselineSha: 'c4bbec67109a453217e2966bd0ab02bdbaf94787',
      projectedAuditedFunctional: 3_054_213,
    },
    wave55GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(brief.shouldProjectWave55);
  ok(brief.projectedAuditedFunctional === 3_054_213);
  ok(brief.integrationBaselineSha.startsWith('c4bbec67'));
  ok(brief.headlines.length >= 1);

  return { passed, failed, total: passed + failed };
}
