import type { O10IdleGovernanceProgramWaveRound59CapstoneResult } from './automation-idle-governance-program-wave-round59-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound59ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round59-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-263';
  projectedLocHint: number;
  round59Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound59ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round59-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-263';
  round52Capstone: O10IdleGovernanceProgramWaveRound59CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound59ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-59 export for O10-263 integration hooks. */
export function exportIdleGovernanceProgramWaveRound59(
  round52Capstone: O10IdleGovernanceProgramWaveRound59CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound59ExportResult {
  const round59Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE59 task=O10-263 round=52`,
    `O10_AGENT20_WAVE59 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE59 round59_ready=${round59Ready}`,
    `O10_AGENT20_WAVE59 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE59 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE59 integration_baseline=4182618c`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound59ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round59-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-263',
    projectedLocHint,
    round59Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-263)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round59_export', 'task=O10-263', 'round=52', `ready=${round59Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round59-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-263',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound59ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound59CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round59-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound59CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound59CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound59CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound59CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound59(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 59 export tags O10-263 and loc hint',
    exported.o10TaskId === 'O10-263' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-263'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round59-export.v1'
  );
  return results;
}
