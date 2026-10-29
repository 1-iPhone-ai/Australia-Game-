import type { O10IdleGovernanceProgramWaveRound56CapstoneResult } from './automation-idle-governance-program-wave-round56-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound56ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round56-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-254';
  projectedLocHint: number;
  round56Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound56ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round56-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-254';
  round52Capstone: O10IdleGovernanceProgramWaveRound56CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound56ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-56 export for O10-254 integration hooks. */
export function exportIdleGovernanceProgramWaveRound56(
  round52Capstone: O10IdleGovernanceProgramWaveRound56CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound56ExportResult {
  const round56Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE56 task=O10-254 round=52`,
    `O10_AGENT20_WAVE56 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE56 round56_ready=${round56Ready}`,
    `O10_AGENT20_WAVE56 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE56 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE56 integration_baseline=8e2366bb`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound56ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round56-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-254',
    projectedLocHint,
    round56Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-254)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round56_export', 'task=O10-254', 'round=52', `ready=${round56Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round56-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-254',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound56ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound56CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round56-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound56CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound56CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound56CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound56CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound56(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 56 export tags O10-254 and loc hint',
    exported.o10TaskId === 'O10-254' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-254'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round56-export.v1'
  );
  return results;
}
