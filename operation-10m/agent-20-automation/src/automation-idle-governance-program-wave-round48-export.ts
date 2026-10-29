import type { O10IdleGovernanceProgramWaveRound47CapstoneResult } from './automation-idle-governance-program-wave-round47-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound48ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round48-export.v1';
  waveRound: 48;
  o10TaskId: 'O10-227';
  projectedLocHint: number;
  round48Ready: boolean;
  wave48HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound48ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round48-export.v1';
  waveRound: 48;
  o10TaskId: 'O10-227';
  round47Capstone: O10IdleGovernanceProgramWaveRound47CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound48ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-48 / wave-48 export for O10-227 integration hooks. */
export function exportIdleGovernanceProgramWaveRound48(
  round47Capstone: O10IdleGovernanceProgramWaveRound47CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound48ExportResult {
  const round48Ready = round47Capstone.capstoneReady;
  const wave48HookLines = [
    `O10_AGENT20_WAVE48 task=O10-227 round=48`,
    `O10_AGENT20_WAVE48 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE48 round48_ready=${round48Ready}`,
    `O10_AGENT20_WAVE48 prior_capstone=${round47Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE48 prior_task=${round47Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound48ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round48-export.v1',
    waveRound: 48,
    o10TaskId: 'O10-227',
    projectedLocHint,
    round48Ready,
    wave48HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 48 export (O10-227)',
    '',
    ...wave48HookLines.map(line => `- ${line}`),
    '',
    round47Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round48_export', 'task=O10-227', 'round=48', `ready=${round48Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round48-export.v1',
    waveRound: 48,
    o10TaskId: 'O10-227',
    round47Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound48ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound47CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round47-capstone.v1',
    o10TaskId: 'O10-225',
    waveRound: 47,
    capstoneReady: true,
    capstoneMarkdown: '# r47',
    summaryLine: 's',
    primaryRound46Capstone: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['primaryRound46Capstone'],
    twinRound46Capstone: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['twinRound46Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['capstoneCompare'],
    round47Export: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['round47Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound48(mockCap(), 2_684_235);
  push(
    'gov_prog_r48_export_o10',
    'wave 48 export tags O10-227 and loc hint',
    exported.o10TaskId === 'O10-227' &&
      exported.payload.projectedLocHint === 2_684_235 &&
      exported.payload.wave48HookLines.some(l => l.includes('O10-227'))
  );
  push(
    'gov_prog_r48_export_schema',
    'round 48 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round48-export.v1'
  );
  return results;
}
