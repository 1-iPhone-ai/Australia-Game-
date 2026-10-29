import type { O10IdleGovernanceProgramWaveRound31CapstoneResult } from './automation-idle-governance-program-wave-round31-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound32ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round32-export.v1';
  waveRound: 32;
  o10TaskId: 'O10-195';
  projectedLocHint: number;
  round32Ready: boolean;
  wave32HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound32ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round32-export.v1';
  waveRound: 32;
  o10TaskId: 'O10-195';
  round31Capstone: O10IdleGovernanceProgramWaveRound31CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound32ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-32 / wave-32 export for O10-195 integration hooks. */
export function exportIdleGovernanceProgramWaveRound32(
  round31Capstone: O10IdleGovernanceProgramWaveRound31CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound32ExportResult {
  const round32Ready = round31Capstone.capstoneReady;
  const wave32HookLines = [
    `O10_AGENT20_WAVE32 task=O10-195 round=32`,
    `O10_AGENT20_WAVE32 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE32 round32_ready=${round32Ready}`,
    `O10_AGENT20_WAVE32 prior_capstone=${round31Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE32 prior_task=${round31Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound32ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round32-export.v1',
    waveRound: 32,
    o10TaskId: 'O10-195',
    projectedLocHint,
    round32Ready,
    wave32HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 32 export (O10-195)',
    '',
    ...wave32HookLines.map(line => `- ${line}`),
    '',
    round31Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round32_export', 'task=O10-195', 'round=32', `ready=${round32Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round32-export.v1',
    waveRound: 32,
    o10TaskId: 'O10-195',
    round31Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound32ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound31CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round31-capstone.v1',
    o10TaskId: 'O10-193',
    waveRound: 31,
    capstoneReady: true,
    capstoneMarkdown: '# r31',
    summaryLine: 's',
    primaryRound30Capstone: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['primaryRound30Capstone'],
    twinRound30Capstone: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['twinRound30Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['capstoneCompare'],
    round31Export: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['round31Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound32(mockCap(), 1_798_330);
  push(
    'gov_prog_r32_export_o10',
    'wave 32 export tags O10-195 and loc hint',
    exported.o10TaskId === 'O10-195' &&
      exported.payload.projectedLocHint === 1_798_330 &&
      exported.payload.wave32HookLines.some(l => l.includes('O10-195'))
  );
  push(
    'gov_prog_r32_export_schema',
    'round 32 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round32-export.v1'
  );
  return results;
}
