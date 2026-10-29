import type { O10IdleGovernanceProgramWaveRound60CapstoneResult } from './automation-idle-governance-program-wave-round60-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound60ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round60-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-265';
  projectedLocHint: number;
  round60Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound60ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round60-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-265';
  round52Capstone: O10IdleGovernanceProgramWaveRound60CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound60ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-60 export for O10-265 integration hooks. */
export function exportIdleGovernanceProgramWaveRound60(
  round52Capstone: O10IdleGovernanceProgramWaveRound60CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound60ExportResult {
  const round60Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE60 task=O10-265 round=52`,
    `O10_AGENT20_WAVE60 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE60 round60_ready=${round60Ready}`,
    `O10_AGENT20_WAVE60 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE60 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE60 integration_baseline=af6c94f0`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound60ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round60-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-265',
    projectedLocHint,
    round60Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-265)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round60_export', 'task=O10-265', 'round=52', `ready=${round60Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round60-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-265',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound60ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound60CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round60-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound60CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound60CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound60CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound60CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound60(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 60 export tags O10-265 and loc hint',
    exported.o10TaskId === 'O10-265' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-265'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round60-export.v1'
  );
  return results;
}
