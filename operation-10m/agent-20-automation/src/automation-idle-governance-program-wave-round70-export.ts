import type { O10IdleGovernanceProgramWaveRound70CapstoneResult } from './automation-idle-governance-program-wave-round70-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound70ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round70-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-309';
  projectedLocHint: number;
  round70Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound70ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round70-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-309';
  round52Capstone: O10IdleGovernanceProgramWaveRound70CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound70ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-70 export for O10-309 integration hooks. */
export function exportIdleGovernanceProgramWaveRound70(
  round52Capstone: O10IdleGovernanceProgramWaveRound70CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound70ExportResult {
  const round70Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE70 task=O10-309 round=52`,
    `O10_AGENT20_WAVE70 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE70 round70_ready=${round70Ready}`,
    `O10_AGENT20_WAVE70 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE70 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE70 integration_baseline=6bf2bf7b`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound70ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round70-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-309',
    projectedLocHint,
    round70Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-309)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round70_export', 'task=O10-309', 'round=52', `ready=${round70Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round70-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-309',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound70ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound70CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round70-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound70CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound70CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound70CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound70CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound70(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 70 export tags O10-309 and loc hint',
    exported.o10TaskId === 'O10-309' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-309'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round70-export.v1'
  );
  return results;
}
