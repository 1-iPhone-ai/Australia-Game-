import type { O10IdleGovernanceProgramWaveRound55CapstoneResult } from './automation-idle-governance-program-wave-round55-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound55ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round55-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-247';
  projectedLocHint: number;
  round55Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound55ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round55-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-247';
  round52Capstone: O10IdleGovernanceProgramWaveRound55CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound55ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-55 export for O10-247 integration hooks. */
export function exportIdleGovernanceProgramWaveRound55(
  round52Capstone: O10IdleGovernanceProgramWaveRound55CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound55ExportResult {
  const round55Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE55 task=O10-247 round=52`,
    `O10_AGENT20_WAVE55 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE55 round55_ready=${round55Ready}`,
    `O10_AGENT20_WAVE55 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE55 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE55 integration_baseline=c4bbec67`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound55ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round55-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-247',
    projectedLocHint,
    round55Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-247)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round55_export', 'task=O10-247', 'round=52', `ready=${round55Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round55-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-247',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound55CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round55-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound55CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound55CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound55CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound55CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound55(mockCap(), 3_054_213);
  push(
    'gov_prog_r55_export_o10',
    'wave 55 export tags O10-247 and loc hint',
    exported.o10TaskId === 'O10-247' &&
      exported.payload.projectedLocHint === 3_054_213 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-247'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round55-export.v1'
  );
  return results;
}
