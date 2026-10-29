import type { O10IdleGovernanceProgramWaveRound72CapstoneResult } from './automation-idle-governance-program-wave-round72-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound72ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round72-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-326';
  projectedLocHint: number;
  round72Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound72ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round72-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-326';
  round52Capstone: O10IdleGovernanceProgramWaveRound72CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound72ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-72 export for O10-326 integration hooks. */
export function exportIdleGovernanceProgramWaveRound72(
  round52Capstone: O10IdleGovernanceProgramWaveRound72CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound72ExportResult {
  const round72Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE72 task=O10-326 round=52`,
    `O10_AGENT20_WAVE72 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE72 round72_ready=${round72Ready}`,
    `O10_AGENT20_WAVE72 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE72 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE72 integration_baseline=926f46b0`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound72ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round72-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-326',
    projectedLocHint,
    round72Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-326)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round72_export', 'task=O10-326', 'round=52', `ready=${round72Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round72-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-326',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound72ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound72CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round72-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound72CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound72CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound72CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound72CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound72(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 72 export tags O10-326 and loc hint',
    exported.o10TaskId === 'O10-326' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-326'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round72-export.v1'
  );
  return results;
}
