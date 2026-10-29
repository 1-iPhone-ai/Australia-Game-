import type { O10IdleGovernanceProgramWaveRound54CapstoneResult } from './automation-idle-governance-program-wave-round54-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound54ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round54-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-240';
  projectedLocHint: number;
  round54Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound54ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round54-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-240';
  round52Capstone: O10IdleGovernanceProgramWaveRound54CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound54ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-54 / wave-54 export for O10-240 integration hooks. */
export function exportIdleGovernanceProgramWaveRound54(
  round52Capstone: O10IdleGovernanceProgramWaveRound54CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound54ExportResult {
  const round54Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE54 task=O10-240 round=52`,
    `O10_AGENT20_WAVE54 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE54 round54_ready=${round54Ready}`,
    `O10_AGENT20_WAVE54 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE54 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE54 integration_baseline=5bd043ad`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound54ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round54-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-240',
    projectedLocHint,
    round54Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-240)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round54_export', 'task=O10-240', 'round=52', `ready=${round54Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round54-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-240',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound54CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round54-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound54CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound54CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound54CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound54CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound54(mockCap(), 3_022_056);
  push(
    'gov_prog_r54_export_o10',
    'wave 54 export tags O10-240 and loc hint',
    exported.o10TaskId === 'O10-240' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-240'))
  );
  push(
    'gov_prog_r54_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round54-export.v1'
  );
  return results;
}
