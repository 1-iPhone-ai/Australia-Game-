import type { O10IdleGovernanceProgramWaveRound37CapstoneResult } from './automation-idle-governance-program-wave-round37-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound38ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round38-export.v1';
  waveRound: 38;
  o10TaskId: 'O10-207';
  projectedLocHint: number;
  round38Ready: boolean;
  wave38HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound38ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round38-export.v1';
  waveRound: 38;
  o10TaskId: 'O10-207';
  round37Capstone: O10IdleGovernanceProgramWaveRound37CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound38ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-38 / wave-38 export for O10-207 integration hooks. */
export function exportIdleGovernanceProgramWaveRound38(
  round37Capstone: O10IdleGovernanceProgramWaveRound37CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound38ExportResult {
  const round38Ready = round37Capstone.capstoneReady;
  const wave38HookLines = [
    `O10_AGENT20_WAVE38 task=O10-207 round=38`,
    `O10_AGENT20_WAVE38 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE38 round38_ready=${round38Ready}`,
    `O10_AGENT20_WAVE38 prior_capstone=${round37Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE38 prior_task=${round37Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound38ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round38-export.v1',
    waveRound: 38,
    o10TaskId: 'O10-207',
    projectedLocHint,
    round38Ready,
    wave38HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 38 export (O10-207)',
    '',
    ...wave38HookLines.map(line => `- ${line}`),
    '',
    round37Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round38_export', 'task=O10-207', 'round=38', `ready=${round38Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round38-export.v1',
    waveRound: 38,
    o10TaskId: 'O10-207',
    round37Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound38ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound37CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round37-capstone.v1',
    o10TaskId: 'O10-205',
    waveRound: 37,
    capstoneReady: true,
    capstoneMarkdown: '# r37',
    summaryLine: 's',
    primaryRound36Capstone: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['primaryRound36Capstone'],
    twinRound36Capstone: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['twinRound36Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['capstoneCompare'],
    round37Export: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['round37Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound38(mockCap(), 2_039_227);
  push(
    'gov_prog_r38_export_o10',
    'wave 38 export tags O10-207 and loc hint',
    exported.o10TaskId === 'O10-207' &&
      exported.payload.projectedLocHint === 2_039_227 &&
      exported.payload.wave38HookLines.some(l => l.includes('O10-207'))
  );
  push(
    'gov_prog_r38_export_schema',
    'round 38 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round38-export.v1'
  );
  return results;
}
