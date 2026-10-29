import type { O10IdleGovernanceProgramWaveRound75CapstoneResult } from './automation-idle-governance-program-wave-round75-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound75ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round75-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-351';
  projectedLocHint: number;
  round75Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound75ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round75-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-351';
  round52Capstone: O10IdleGovernanceProgramWaveRound75CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound75ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-75 export for O10-351 integration hooks. */
export function exportIdleGovernanceProgramWaveRound75(
  round52Capstone: O10IdleGovernanceProgramWaveRound75CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound75ExportResult {
  const round75Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE75 task=O10-351 round=52`,
    `O10_AGENT20_WAVE75 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE75 round75_ready=${round75Ready}`,
    `O10_AGENT20_WAVE75 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE75 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE75 integration_baseline=4ede8fed`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound75ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round75-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-351',
    projectedLocHint,
    round75Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-351)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round75_export', 'task=O10-351', 'round=52', `ready=${round75Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round75-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-351',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound75ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound75CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round75-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound75CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound75CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound75CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound75CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound75(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 75 export tags O10-351 and loc hint',
    exported.o10TaskId === 'O10-351' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-351'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round75-export.v1'
  );
  return results;
}
