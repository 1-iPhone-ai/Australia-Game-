import type { O10IdleGovernanceProgramWaveRound38CapstoneResult } from './automation-idle-governance-program-wave-round38-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound39ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round39-export.v1';
  waveRound: 39;
  o10TaskId: 'O10-209';
  projectedLocHint: number;
  round39Ready: boolean;
  wave39HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound39ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round39-export.v1';
  waveRound: 39;
  o10TaskId: 'O10-209';
  round38Capstone: O10IdleGovernanceProgramWaveRound38CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound39ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-39 / wave-39 export for O10-209 integration hooks. */
export function exportIdleGovernanceProgramWaveRound39(
  round38Capstone: O10IdleGovernanceProgramWaveRound38CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound39ExportResult {
  const round39Ready = round38Capstone.capstoneReady;
  const wave39HookLines = [
    `O10_AGENT20_WAVE39 task=O10-209 round=39`,
    `O10_AGENT20_WAVE39 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE39 round39_ready=${round39Ready}`,
    `O10_AGENT20_WAVE39 prior_capstone=${round38Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE39 prior_task=${round38Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound39ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round39-export.v1',
    waveRound: 39,
    o10TaskId: 'O10-209',
    projectedLocHint,
    round39Ready,
    wave39HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 39 export (O10-209)',
    '',
    ...wave39HookLines.map(line => `- ${line}`),
    '',
    round38Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round39_export', 'task=O10-209', 'round=39', `ready=${round39Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round39-export.v1',
    waveRound: 39,
    o10TaskId: 'O10-209',
    round38Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound39ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound38CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round38-capstone.v1',
    o10TaskId: 'O10-207',
    waveRound: 38,
    capstoneReady: true,
    capstoneMarkdown: '# r38',
    summaryLine: 's',
    primaryRound37Capstone: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['primaryRound37Capstone'],
    twinRound37Capstone: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['twinRound37Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['capstoneCompare'],
    round38Export: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['round38Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound39(mockCap(), 2_082_720);
  push(
    'gov_prog_r39_export_o10',
    'wave 39 export tags O10-209 and loc hint',
    exported.o10TaskId === 'O10-209' &&
      exported.payload.projectedLocHint === 2_082_720 &&
      exported.payload.wave39HookLines.some(l => l.includes('O10-209'))
  );
  push(
    'gov_prog_r39_export_schema',
    'round 39 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round39-export.v1'
  );
  return results;
}
