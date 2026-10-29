import type { O10IdleGovernanceProgramWaveRound33CapstoneResult } from './automation-idle-governance-program-wave-round33-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound34ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round34-export.v1';
  waveRound: 34;
  o10TaskId: 'O10-199';
  projectedLocHint: number;
  round34Ready: boolean;
  wave34HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound34ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round34-export.v1';
  waveRound: 34;
  o10TaskId: 'O10-199';
  round33Capstone: O10IdleGovernanceProgramWaveRound33CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound34ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-34 / wave-34 export for O10-199 integration hooks. */
export function exportIdleGovernanceProgramWaveRound34(
  round33Capstone: O10IdleGovernanceProgramWaveRound33CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound34ExportResult {
  const round34Ready = round33Capstone.capstoneReady;
  const wave34HookLines = [
    `O10_AGENT20_WAVE34 task=O10-199 round=34`,
    `O10_AGENT20_WAVE34 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE34 round34_ready=${round34Ready}`,
    `O10_AGENT20_WAVE34 prior_capstone=${round33Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE34 prior_task=${round33Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound34ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round34-export.v1',
    waveRound: 34,
    o10TaskId: 'O10-199',
    projectedLocHint,
    round34Ready,
    wave34HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 34 export (O10-199)',
    '',
    ...wave34HookLines.map(line => `- ${line}`),
    '',
    round33Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round34_export', 'task=O10-199', 'round=34', `ready=${round34Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round34-export.v1',
    waveRound: 34,
    o10TaskId: 'O10-199',
    round33Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound34ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound33CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round33-capstone.v1',
    o10TaskId: 'O10-197',
    waveRound: 33,
    capstoneReady: true,
    capstoneMarkdown: '# r33',
    summaryLine: 's',
    primaryRound32Capstone: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['primaryRound32Capstone'],
    twinRound32Capstone: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['twinRound32Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['capstoneCompare'],
    round33Export: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['round33Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound34(mockCap(), 1_886_428);
  push(
    'gov_prog_r34_export_o10',
    'wave 34 export tags O10-199 and loc hint',
    exported.o10TaskId === 'O10-199' &&
      exported.payload.projectedLocHint === 1_886_428 &&
      exported.payload.wave34HookLines.some(l => l.includes('O10-199'))
  );
  push(
    'gov_prog_r34_export_schema',
    'round 34 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round34-export.v1'
  );
  return results;
}
