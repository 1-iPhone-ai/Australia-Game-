import type { O10IdleGovernanceProgramWaveRound58CapstoneResult } from './automation-idle-governance-program-wave-round58-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound58ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round58-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-260';
  projectedLocHint: number;
  round58Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound58ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round58-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-260';
  round52Capstone: O10IdleGovernanceProgramWaveRound58CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound58ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-58 export for O10-260 integration hooks. */
export function exportIdleGovernanceProgramWaveRound58(
  round52Capstone: O10IdleGovernanceProgramWaveRound58CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound58ExportResult {
  const round58Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE58 task=O10-260 round=52`,
    `O10_AGENT20_WAVE58 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE58 round58_ready=${round58Ready}`,
    `O10_AGENT20_WAVE58 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE58 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE58 integration_baseline=feb7e524`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound58ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round58-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-260',
    projectedLocHint,
    round58Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-260)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round58_export', 'task=O10-260', 'round=52', `ready=${round58Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round58-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-260',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound58ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound58CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round58-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound58CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound58CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound58CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound58CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound58(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 58 export tags O10-260 and loc hint',
    exported.o10TaskId === 'O10-260' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-260'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round58-export.v1'
  );
  return results;
}
