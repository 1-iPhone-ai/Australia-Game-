import type { O10IdleGovernanceProgramWaveCycleCloseoutResult } from './automation-idle-governance-program-wave-cycle-closeout.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveProjectionRollupResult {
  schema: '10m.agent20.idle-governance-program-wave-projection-rollup.v1';
  waveRound: number;
  projectedLocBand: 'on_track' | 'watch' | 'behind';
  cycleRecommendation: O10IdleGovernanceProgramWaveCycleCloseoutResult['cycleRecommendation'];
  handoffLineCount: number;
  projectionHookLines: string[];
  summaryLine: string;
}

function mapRecommendationToLocBand(
  rec: O10IdleGovernanceProgramWaveCycleCloseoutResult['cycleRecommendation']
): O10IdleGovernanceProgramWaveProjectionRollupResult['projectedLocBand'] {
  if (rec === 'advance_scale_wave_cycle') return 'on_track';
  if (rec === 'hold_scale_wave_cycle') return 'watch';
  return 'behind';
}

/** Round-22 projection rollup from cycle closeout for scale-wave LOC coordination. */
export function rollupIdleGovernanceProgramWaveProjection(
  closeout: O10IdleGovernanceProgramWaveCycleCloseoutResult,
  projectedLocHint: number = 1_401_419
): O10IdleGovernanceProgramWaveProjectionRollupResult {
  const waveRound = closeout.waveRound;
  const cycleRecommendation = closeout.cycleRecommendation;
  const projectedLocBand = mapRecommendationToLocBand(cycleRecommendation);
  const handoffLineCount =
    closeout.handoffBundle.payload.handoffDigestLines.length +
    closeout.handoffBundle.payload.integrationHookLines.length;

  const projectionHookLines = [
    `O10_AGENT20_WAVE_PROJECTION round=${waveRound}`,
    `O10_AGENT20_WAVE_LOC_HINT ${projectedLocHint}`,
    `O10_AGENT20_WAVE_LOC_BAND ${projectedLocBand}`,
    `O10_AGENT20_WAVE_CYCLE ${cycleRecommendation}`,
    `O10_AGENT20_WAVE_GATE open=${closeout.primaryGate.gateOpen}`,
  ];

  const summaryLine = [
    'gov_program_wave_projection_rollup',
    `round=${waveRound}`,
    `band=${projectedLocBand}`,
    `rec=${cycleRecommendation}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-projection-rollup.v1',
    waveRound,
    projectedLocBand,
    cycleRecommendation,
    handoffLineCount,
    projectionHookLines,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveProjectionRollupSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCloseout = (
    rec: O10IdleGovernanceProgramWaveCycleCloseoutResult['cycleRecommendation']
  ): O10IdleGovernanceProgramWaveCycleCloseoutResult => ({
    schema: '10m.agent20.idle-governance-program-wave-cycle-closeout.v1',
    waveRound: 22,
    cycleRecommendation: rec,
    cycleCloseoutMarkdown: 'md',
    summaryLine: 's',
    primaryGate: { gateOpen: rec === 'advance_scale_wave_cycle' } as O10IdleGovernanceProgramWaveCycleCloseoutResult['primaryGate'],
    twinGate: {} as O10IdleGovernanceProgramWaveCycleCloseoutResult['twinGate'],
    gateCompare: {} as O10IdleGovernanceProgramWaveCycleCloseoutResult['gateCompare'],
    handoffBundle: {
      payload: {
        gateOpen: true,
        handoffDigestLines: ['a', 'b', 'c', 'd', 'e'],
        integrationHookLines: ['h1'],
      },
    } as O10IdleGovernanceProgramWaveCycleCloseoutResult['handoffBundle'],
  });

  const advance = rollupIdleGovernanceProgramWaveProjection(mockCloseout('advance_scale_wave_cycle'));
  push(
    'gov_prog_proj_roll_advance',
    'advance cycle maps to on_track loc band',
    advance.projectedLocBand === 'on_track' && advance.projectionHookLines.length === 5
  );

  const escalate = rollupIdleGovernanceProgramWaveProjection(mockCloseout('escalate_scale_wave_cycle'));
  push(
    'gov_prog_proj_roll_escalate',
    'escalate cycle maps to behind loc band',
    escalate.projectedLocBand === 'behind'
  );

  push(
    'gov_prog_proj_roll_schema',
    'projection rollup schema marker',
    advance.schema === '10m.agent20.idle-governance-program-wave-projection-rollup.v1'
  );

  return results;
}
