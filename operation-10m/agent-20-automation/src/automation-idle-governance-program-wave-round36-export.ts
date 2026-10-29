import type { O10IdleGovernanceProgramWaveRound35CapstoneResult } from './automation-idle-governance-program-wave-round35-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound36ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round36-export.v1';
  waveRound: 36;
  o10TaskId: 'O10-203';
  projectedLocHint: number;
  round36Ready: boolean;
  wave36HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound36ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round36-export.v1';
  waveRound: 36;
  o10TaskId: 'O10-203';
  round35Capstone: O10IdleGovernanceProgramWaveRound35CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound36ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-36 / wave-36 export for O10-203 integration hooks. */
export function exportIdleGovernanceProgramWaveRound36(
  round35Capstone: O10IdleGovernanceProgramWaveRound35CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound36ExportResult {
  const round36Ready = round35Capstone.capstoneReady;
  const wave36HookLines = [
    `O10_AGENT20_WAVE36 task=O10-203 round=36`,
    `O10_AGENT20_WAVE36 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE36 round36_ready=${round36Ready}`,
    `O10_AGENT20_WAVE36 prior_capstone=${round35Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE36 prior_task=${round35Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound36ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round36-export.v1',
    waveRound: 36,
    o10TaskId: 'O10-203',
    projectedLocHint,
    round36Ready,
    wave36HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 36 export (O10-203)',
    '',
    ...wave36HookLines.map(line => `- ${line}`),
    '',
    round35Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round36_export', 'task=O10-203', 'round=36', `ready=${round36Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round36-export.v1',
    waveRound: 36,
    o10TaskId: 'O10-203',
    round35Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound36ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound35CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round35-capstone.v1',
    o10TaskId: 'O10-201',
    waveRound: 35,
    capstoneReady: true,
    capstoneMarkdown: '# r35',
    summaryLine: 's',
    primaryRound34Capstone: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['primaryRound34Capstone'],
    twinRound34Capstone: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['twinRound34Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['capstoneCompare'],
    round35Export: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['round35Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound36(mockCap(), 1_962_828);
  push(
    'gov_prog_r36_export_o10',
    'wave 36 export tags O10-203 and loc hint',
    exported.o10TaskId === 'O10-203' &&
      exported.payload.projectedLocHint === 1_962_828 &&
      exported.payload.wave36HookLines.some(l => l.includes('O10-203'))
  );
  push(
    'gov_prog_r36_export_schema',
    'round 36 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round36-export.v1'
  );
  return results;
}
