import type { O10IdleGovernanceProgramWaveRound34CapstoneResult } from './automation-idle-governance-program-wave-round34-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound35ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round35-export.v1';
  waveRound: 35;
  o10TaskId: 'O10-201';
  projectedLocHint: number;
  round35Ready: boolean;
  wave35HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound35ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round35-export.v1';
  waveRound: 35;
  o10TaskId: 'O10-201';
  round34Capstone: O10IdleGovernanceProgramWaveRound34CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound35ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-35 / wave-35 export for O10-201 integration hooks. */
export function exportIdleGovernanceProgramWaveRound35(
  round34Capstone: O10IdleGovernanceProgramWaveRound34CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound35ExportResult {
  const round35Ready = round34Capstone.capstoneReady;
  const wave35HookLines = [
    `O10_AGENT20_WAVE35 task=O10-201 round=35`,
    `O10_AGENT20_WAVE35 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE35 round35_ready=${round35Ready}`,
    `O10_AGENT20_WAVE35 prior_capstone=${round34Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE35 prior_task=${round34Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound35ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round35-export.v1',
    waveRound: 35,
    o10TaskId: 'O10-201',
    projectedLocHint,
    round35Ready,
    wave35HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 35 export (O10-201)',
    '',
    ...wave35HookLines.map(line => `- ${line}`),
    '',
    round34Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round35_export', 'task=O10-201', 'round=35', `ready=${round35Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round35-export.v1',
    waveRound: 35,
    o10TaskId: 'O10-201',
    round34Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound35ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound34CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round34-capstone.v1',
    o10TaskId: 'O10-199',
    waveRound: 34,
    capstoneReady: true,
    capstoneMarkdown: '# r34',
    summaryLine: 's',
    primaryRound33Capstone: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['primaryRound33Capstone'],
    twinRound33Capstone: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['twinRound33Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['capstoneCompare'],
    round34Export: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['round34Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound35(mockCap(), 1_924_628);
  push(
    'gov_prog_r35_export_o10',
    'wave 35 export tags O10-201 and loc hint',
    exported.o10TaskId === 'O10-201' &&
      exported.payload.projectedLocHint === 1_924_628 &&
      exported.payload.wave35HookLines.some(l => l.includes('O10-201'))
  );
  push(
    'gov_prog_r35_export_schema',
    'round 35 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round35-export.v1'
  );
  return results;
}
