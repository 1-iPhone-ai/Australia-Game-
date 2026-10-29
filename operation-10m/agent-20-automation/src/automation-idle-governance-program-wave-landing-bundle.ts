import type { O10IdleGovernanceProgramWaveLandingGateResult } from './automation-idle-governance-program-wave-landing-gate.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveLandingBundlePayload {
  schema: '10m.agent20.idle-governance-program-wave-landing-bundle.v1';
  waveRound: number;
  landingOpen: boolean;
  projectedLocHint: number;
  sealHookLines: string[];
}

export interface O10IdleGovernanceProgramWaveLandingBundleResult {
  schema: '10m.agent20.idle-governance-program-wave-landing-bundle.v1';
  waveRound: number;
  landing: O10IdleGovernanceProgramWaveLandingGateResult;
  payload: O10IdleGovernanceProgramWaveLandingBundlePayload;
  bundleMarkdown: string;
  summaryLine: string;
}

function buildSealHookLines(
  landing: O10IdleGovernanceProgramWaveLandingGateResult,
  projectedLocHint: number
): string[] {
  const rollup = landing.primaryDispatch.projectionRollup;
  return [
    `O10_AGENT20_WAVE_LANDING round=${landing.waveRound}`,
    `O10_AGENT20_WAVE_LANDING_OPEN ${landing.landingOpen}`,
    `O10_AGENT20_WAVE_LOC_HINT ${projectedLocHint}`,
    `O10_AGENT20_WAVE_LOC_BAND ${rollup.projectedLocBand}`,
    `O10_AGENT20_WAVE_DISPATCH_READY ${landing.primaryDispatch.dispatchReady}`,
  ];
}

/** Round-24 landing bundle for Agent 25 wave-24 integration seal hooks. */
export function bundleIdleGovernanceProgramWaveLanding(
  landing: O10IdleGovernanceProgramWaveLandingGateResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveLandingBundleResult {
  const sealHookLines = buildSealHookLines(landing, projectedLocHint);

  const payload: O10IdleGovernanceProgramWaveLandingBundlePayload = {
    schema: '10m.agent20.idle-governance-program-wave-landing-bundle.v1',
    waveRound: landing.waveRound,
    landingOpen: landing.landingOpen,
    projectedLocHint,
    sealHookLines,
  };

  const bundleMarkdown = [
    '# Agent 20 idle governance wave landing bundle',
    '',
    ...sealHookLines.map(line => `- ${line}`),
    '',
    landing.landingMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_landing_bundle',
    `round=${landing.waveRound}`,
    `open=${landing.landingOpen}`,
    `hooks=${sealHookLines.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-landing-bundle.v1',
    waveRound: landing.waveRound,
    landing,
    payload,
    bundleMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveLandingBundleSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockLanding = (): O10IdleGovernanceProgramWaveLandingGateResult => ({
    schema: '10m.agent20.idle-governance-program-wave-landing-gate.v1',
    waveRound: 24,
    landingOpen: true,
    landingMarkdown: '# land',
    summaryLine: 's',
    twinDispatch: {} as O10IdleGovernanceProgramWaveLandingGateResult['twinDispatch'],
    dispatchCompare: {} as O10IdleGovernanceProgramWaveLandingGateResult['dispatchCompare'],
    replayParity: {} as O10IdleGovernanceProgramWaveLandingGateResult['replayParity'],
    primaryDispatch: {
      dispatchReady: true,
      projectionRollup: { projectedLocBand: 'on_track' },
    } as O10IdleGovernanceProgramWaveLandingGateResult['primaryDispatch'],
  });

  const bundle = bundleIdleGovernanceProgramWaveLanding(mockLanding(), 1_487_095);
  push(
    'gov_prog_land_bundle_hooks',
    'landing bundle includes seal hook lines',
    bundle.payload.sealHookLines.length === 5 &&
      bundle.payload.projectedLocHint === 1_487_095 &&
      bundle.bundleMarkdown.includes('landing bundle')
  );

  push(
    'gov_prog_land_bundle_schema',
    'landing bundle schema marker',
    bundle.schema === '10m.agent20.idle-governance-program-wave-landing-bundle.v1'
  );

  return results;
}
