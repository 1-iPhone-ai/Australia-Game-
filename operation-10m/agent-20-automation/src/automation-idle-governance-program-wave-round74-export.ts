import type { O10IdleGovernanceProgramWaveRound74CapstoneResult } from './automation-idle-governance-program-wave-round74-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound74ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round74-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-343';
  projectedLocHint: number;
  round74Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound74ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round74-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-343';
  round52Capstone: O10IdleGovernanceProgramWaveRound74CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound74ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-74 export for O10-343 integration hooks. */
export function exportIdleGovernanceProgramWaveRound74(
  round52Capstone: O10IdleGovernanceProgramWaveRound74CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound74ExportResult {
  const round74Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE74 task=O10-343 round=52`,
    `O10_AGENT20_WAVE74 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE74 round74_ready=${round74Ready}`,
    `O10_AGENT20_WAVE74 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE74 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE74 integration_baseline=72a7aee6`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound74ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round74-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-343',
    projectedLocHint,
    round74Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-343)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round74_export', 'task=O10-343', 'round=52', `ready=${round74Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round74-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-343',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound74ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound74CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round74-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound74CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound74CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound74CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound74CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound74(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 74 export tags O10-343 and loc hint',
    exported.o10TaskId === 'O10-343' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-343'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round74-export.v1'
  );
  return results;
}
