import type { O10IdleGovernanceProgramWaveRound57CapstoneResult } from './automation-idle-governance-program-wave-round57-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound57ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round57-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-257';
  projectedLocHint: number;
  round57Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound57ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round57-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-257';
  round52Capstone: O10IdleGovernanceProgramWaveRound57CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound57ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-57 export for O10-257 integration hooks. */
export function exportIdleGovernanceProgramWaveRound57(
  round52Capstone: O10IdleGovernanceProgramWaveRound57CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound57ExportResult {
  const round57Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE57 task=O10-257 round=52`,
    `O10_AGENT20_WAVE57 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE57 round57_ready=${round57Ready}`,
    `O10_AGENT20_WAVE57 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE57 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE57 integration_baseline=93c42b3d`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound57ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round57-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-257',
    projectedLocHint,
    round57Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-257)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round57_export', 'task=O10-257', 'round=52', `ready=${round57Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round57-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-257',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound57ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound57CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round57-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound57CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound57CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound57CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound57CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound57(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 57 export tags O10-257 and loc hint',
    exported.o10TaskId === 'O10-257' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-257'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round57-export.v1'
  );
  return results;
}
