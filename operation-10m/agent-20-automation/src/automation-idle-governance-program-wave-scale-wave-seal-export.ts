import type { O10IdleGovernanceProgramWaveScaleWaveSealResult } from './automation-idle-governance-program-wave-scale-wave-seal.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveScaleWaveSealExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-export.v1';
  waveRound: number;
  sealVerdict: O10IdleGovernanceProgramWaveScaleWaveSealResult['sealVerdict'];
  projectedLocHint: number;
  capstoneHookLines: string[];
}

export interface O10IdleGovernanceProgramWaveScaleWaveSealExportResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-export.v1';
  waveRound: number;
  seal: O10IdleGovernanceProgramWaveScaleWaveSealResult;
  payload: O10IdleGovernanceProgramWaveScaleWaveSealExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-25 capstone export flattening scale-wave seal for Agent 25 O10-182 hooks. */
export function exportIdleGovernanceProgramWaveScaleWaveSeal(
  seal: O10IdleGovernanceProgramWaveScaleWaveSealResult
): O10IdleGovernanceProgramWaveScaleWaveSealExportResult {
  const projectedLocHint = seal.landingBundle.payload.projectedLocHint;
  const capstoneHookLines = [
    `O10_AGENT20_WAVE_CAPSTONE round=${seal.waveRound}`,
    `O10_AGENT20_WAVE_SEAL_VERDICT ${seal.sealVerdict}`,
    `O10_AGENT20_WAVE_LOC_HINT ${projectedLocHint}`,
    ...seal.landingBundle.payload.sealHookLines.map(line => `O10_AGENT20_WAVE_SEAL_HOOK ${line}`),
    `O10_AGENT20_WAVE_LANDING_OPEN ${seal.primaryLanding.landingOpen}`,
  ];

  const payload: O10IdleGovernanceProgramWaveScaleWaveSealExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-export.v1',
    waveRound: seal.waveRound,
    sealVerdict: seal.sealVerdict,
    projectedLocHint,
    capstoneHookLines,
  };

  const exportMarkdown = [
    '# Agent 20 idle governance scale-wave seal export',
    '',
    ...capstoneHookLines.map(line => `- ${line}`),
    '',
    seal.sealMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_scale_wave_seal_export',
    `round=${seal.waveRound}`,
    `verdict=${seal.sealVerdict}`,
    `hooks=${capstoneHookLines.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-export.v1',
    waveRound: seal.waveRound,
    seal,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleWaveSealExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockSeal = (): O10IdleGovernanceProgramWaveScaleWaveSealResult => ({
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal.v1',
    waveRound: 25,
    sealVerdict: 'sealed',
    sealMarkdown: '# seal',
    summaryLine: 's',
    primaryLanding: { landingOpen: true } as O10IdleGovernanceProgramWaveScaleWaveSealResult['primaryLanding'],
    twinLanding: {} as O10IdleGovernanceProgramWaveScaleWaveSealResult['twinLanding'],
    landingCompare: {} as O10IdleGovernanceProgramWaveScaleWaveSealResult['landingCompare'],
    landingBundle: {
      payload: {
        projectedLocHint: 1_525_288,
        sealHookLines: ['hook-a', 'hook-b'],
      },
    } as O10IdleGovernanceProgramWaveScaleWaveSealResult['landingBundle'],
  });

  const exported = exportIdleGovernanceProgramWaveScaleWaveSeal(mockSeal());
  push(
    'gov_prog_seal_export_hooks',
    'seal export includes capstone hook lines',
    exported.payload.capstoneHookLines.length >= 5 &&
      exported.exportMarkdown.includes('CAPSTONE') &&
      exported.payload.projectedLocHint === 1_525_288
  );

  push(
    'gov_prog_seal_export_schema',
    'seal export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-scale-wave-seal-export.v1'
  );

  return results;
}
