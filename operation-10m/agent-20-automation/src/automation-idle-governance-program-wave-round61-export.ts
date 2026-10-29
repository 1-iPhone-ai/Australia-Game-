import type { O10IdleGovernanceProgramWaveRound61CapstoneResult } from './automation-idle-governance-program-wave-round61-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound61ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round61-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-267';
  projectedLocHint: number;
  round61Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound61ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round61-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-267';
  round52Capstone: O10IdleGovernanceProgramWaveRound61CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound61ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-61 export for O10-267 integration hooks. */
export function exportIdleGovernanceProgramWaveRound61(
  round52Capstone: O10IdleGovernanceProgramWaveRound61CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound61ExportResult {
  const round61Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE61 task=O10-267 round=52`,
    `O10_AGENT20_WAVE61 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE61 round61_ready=${round61Ready}`,
    `O10_AGENT20_WAVE61 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE61 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE61 integration_baseline=7f862be0`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound61ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round61-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-267',
    projectedLocHint,
    round61Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-267)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round61_export', 'task=O10-267', 'round=52', `ready=${round61Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round61-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-267',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound61ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound61CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round61-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound61CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound61CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound61CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound61CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound61(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 61 export tags O10-267 and loc hint',
    exported.o10TaskId === 'O10-267' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-267'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round61-export.v1'
  );
  return results;
}
