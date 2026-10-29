import type { O10IdleGovernanceProgramWaveRound26CapstoneResult } from './automation-idle-governance-program-wave-round26-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound27ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round27-export.v1';
  waveRound: 27;
  o10TaskId: 'O10-185';
  projectedLocHint: number;
  round27Ready: boolean;
  wave27HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound27ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round27-export.v1';
  waveRound: 27;
  o10TaskId: 'O10-185';
  round26Capstone: O10IdleGovernanceProgramWaveRound26CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound27ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-27 / wave-27 export hooks for O10-185 Agent 25 integration. */
export function exportIdleGovernanceProgramWaveRound27(
  round26Capstone: O10IdleGovernanceProgramWaveRound26CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound27ExportResult {
  const round27Ready = round26Capstone.capstoneReady;

  const wave27HookLines = [
    `O10_AGENT20_WAVE27 task=O10-185 round=27`,
    `O10_AGENT20_WAVE27 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE27 round27_ready=${round27Ready}`,
    `O10_AGENT20_WAVE27 prior_capstone=${round26Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE27 prior_task=${round26Capstone.o10TaskId}`,
  ];

  const payload: O10IdleGovernanceProgramWaveRound27ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round27-export.v1',
    waveRound: 27,
    o10TaskId: 'O10-185',
    projectedLocHint,
    round27Ready,
    wave27HookLines,
  };

  const exportMarkdown = [
    '# Agent 20 scale wave round 27 export (O10-185)',
    '',
    ...wave27HookLines.map(line => `- ${line}`),
    '',
    round26Capstone.capstoneMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round27_export',
    'task=O10-185',
    'round=27',
    `ready=${round27Ready}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round27-export.v1',
    waveRound: 27,
    o10TaskId: 'O10-185',
    round26Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound27ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCap = (): O10IdleGovernanceProgramWaveRound26CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round26-capstone.v1',
    o10TaskId: 'O10-183',
    waveRound: 26,
    capstoneReady: true,
    capstoneMarkdown: '# r26',
    summaryLine: 's',
    primaryEpoch: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['primaryEpoch'],
    twinEpoch: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['twinEpoch'],
    epochCompare: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['epochCompare'],
    epochExport: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['epochExport'],
  });

  const exported = exportIdleGovernanceProgramWaveRound27(mockCap(), 1_601_674);
  push(
    'gov_prog_r27_export_o10',
    'wave 27 export tags O10-185 and loc hint',
    exported.o10TaskId === 'O10-185' &&
      exported.payload.projectedLocHint === 1_601_674 &&
      exported.payload.wave27HookLines.some(l => l.includes('O10-185'))
  );

  push(
    'gov_prog_r27_export_schema',
    'round 27 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round27-export.v1'
  );

  return results;
}
