import type { O10IdleGovernanceProgramWaveRound69CapstoneResult } from './automation-idle-governance-program-wave-round69-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound69ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round69-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-301';
  projectedLocHint: number;
  round69Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound69ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round69-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-301';
  round52Capstone: O10IdleGovernanceProgramWaveRound69CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound69ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-69 export for O10-301 integration hooks. */
export function exportIdleGovernanceProgramWaveRound69(
  round52Capstone: O10IdleGovernanceProgramWaveRound69CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound69ExportResult {
  const round69Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE69 task=O10-301 round=52`,
    `O10_AGENT20_WAVE69 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE69 round69_ready=${round69Ready}`,
    `O10_AGENT20_WAVE69 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE69 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE69 integration_baseline=ef6c0625`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound69ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round69-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-301',
    projectedLocHint,
    round69Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-301)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round69_export', 'task=O10-301', 'round=52', `ready=${round69Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round69-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-301',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound69ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound69CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round69-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound69CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound69CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound69CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound69CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound69(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 69 export tags O10-301 and loc hint',
    exported.o10TaskId === 'O10-301' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-301'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round69-export.v1'
  );
  return results;
}
