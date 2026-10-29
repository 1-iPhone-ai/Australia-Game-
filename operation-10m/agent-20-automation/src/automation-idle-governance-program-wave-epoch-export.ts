import type { O10IdleGovernanceProgramWaveEpochCloseoutResult } from './automation-idle-governance-program-wave-epoch-closeout.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveEpochExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-epoch-export.v1';
  waveRound: number;
  epochReady: boolean;
  projectedLocHint: number;
  o10TaskId: 'O10-183';
  wave26HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveEpochExportResult {
  schema: '10m.agent20.idle-governance-program-wave-epoch-export.v1';
  waveRound: number;
  epoch: O10IdleGovernanceProgramWaveEpochCloseoutResult;
  payload: O10IdleGovernanceProgramWaveEpochExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-26 / wave-26 epoch export for Agent 25 (O10-183). */
export function exportIdleGovernanceProgramWaveEpoch(
  epoch: O10IdleGovernanceProgramWaveEpochCloseoutResult,
  projectedLocHint: number = epoch.sealExport.payload.projectedLocHint
): O10IdleGovernanceProgramWaveEpochExportResult {
  const wave26HookLines = [
    `O10_AGENT20_WAVE26 task=O10-183 round=${epoch.waveRound}`,
    `O10_AGENT20_WAVE26 epoch_ready=${epoch.epochReady}`,
    `O10_AGENT20_WAVE26 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE26 seal=${epoch.primarySeal.sealVerdict}`,
    ...epoch.sealExport.payload.capstoneHookLines.map(line => `O10_AGENT20_WAVE26 capstone ${line}`),
  ];

  const payload: O10IdleGovernanceProgramWaveEpochExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-epoch-export.v1',
    waveRound: epoch.waveRound,
    epochReady: epoch.epochReady,
    projectedLocHint,
    o10TaskId: 'O10-183',
    wave26HookLines,
  };

  const exportMarkdown = [
    '# Agent 20 idle governance wave 26 epoch export (O10-183)',
    '',
    ...wave26HookLines.map(line => `- ${line}`),
    '',
    epoch.epochCloseoutMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_epoch_export',
    'task=O10-183',
    `round=${epoch.waveRound}`,
    `ready=${epoch.epochReady}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-epoch-export.v1',
    waveRound: epoch.waveRound,
    epoch,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveEpochExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockEpoch = (): O10IdleGovernanceProgramWaveEpochCloseoutResult => ({
    schema: '10m.agent20.idle-governance-program-wave-epoch-closeout.v1',
    waveRound: 26,
    epochReady: true,
    epochCloseoutMarkdown: '# epoch',
    summaryLine: 's',
    primarySeal: { sealVerdict: 'sealed' } as O10IdleGovernanceProgramWaveEpochCloseoutResult['primarySeal'],
    twinSeal: {} as O10IdleGovernanceProgramWaveEpochCloseoutResult['twinSeal'],
    sealCompare: {} as O10IdleGovernanceProgramWaveEpochCloseoutResult['sealCompare'],
    sealExport: {
      payload: {
        projectedLocHint: 1_563_481,
        capstoneHookLines: ['cap-a'],
      },
    } as O10IdleGovernanceProgramWaveEpochCloseoutResult['sealExport'],
  });

  const exported = exportIdleGovernanceProgramWaveEpoch(mockEpoch(), 1_563_481);
  push(
    'gov_prog_epoch_export_o10',
    'wave 26 export tags O10-183 hooks',
    exported.payload.o10TaskId === 'O10-183' &&
      exported.payload.wave26HookLines.some(l => l.includes('O10-183')) &&
      exported.payload.projectedLocHint === 1_563_481
  );

  push(
    'gov_prog_epoch_export_schema',
    'epoch export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-epoch-export.v1'
  );

  return results;
}
