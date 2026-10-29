import type { O10IdleGovernanceProgramWaveRound28CapstoneResult } from './automation-idle-governance-program-wave-round28-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound29ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round29-export.v1';
  waveRound: 29;
  o10TaskId: 'O10-189';
  projectedLocHint: number;
  round29Ready: boolean;
  wave29HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound29ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round29-export.v1';
  waveRound: 29;
  o10TaskId: 'O10-189';
  round28Capstone: O10IdleGovernanceProgramWaveRound28CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound29ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-29 / wave-29 export for O10-189 integration hooks. */
export function exportIdleGovernanceProgramWaveRound29(
  round28Capstone: O10IdleGovernanceProgramWaveRound28CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound29ExportResult {
  const round29Ready = round28Capstone.capstoneReady;

  const wave29HookLines = [
    `O10_AGENT20_WAVE29 task=O10-189 round=29`,
    `O10_AGENT20_WAVE29 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE29 round29_ready=${round29Ready}`,
    `O10_AGENT20_WAVE29 prior_capstone=${round28Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE29 prior_task=${round28Capstone.o10TaskId}`,
  ];

  const payload: O10IdleGovernanceProgramWaveRound29ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round29-export.v1',
    waveRound: 29,
    o10TaskId: 'O10-189',
    projectedLocHint,
    round29Ready,
    wave29HookLines,
  };

  const exportMarkdown = [
    '# Agent 20 scale wave round 29 export (O10-189)',
    '',
    ...wave29HookLines.map(line => `- ${line}`),
    '',
    round28Capstone.capstoneMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round29_export',
    'task=O10-189',
    'round=29',
    `ready=${round29Ready}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round29-export.v1',
    waveRound: 29,
    o10TaskId: 'O10-189',
    round28Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound29ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCap = (): O10IdleGovernanceProgramWaveRound28CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round28-capstone.v1',
    o10TaskId: 'O10-187',
    waveRound: 28,
    capstoneReady: true,
    capstoneMarkdown: '# r28',
    summaryLine: 's',
    primaryRound27Capstone: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['primaryRound27Capstone'],
    twinRound27Capstone: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['twinRound27Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['capstoneCompare'],
    round28Export: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['round28Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound29(mockCap(), 1_683_733);
  push(
    'gov_prog_r29_export_o10',
    'wave 29 export tags O10-189 and loc hint',
    exported.o10TaskId === 'O10-189' &&
      exported.payload.projectedLocHint === 1_683_733 &&
      exported.payload.wave29HookLines.some(l => l.includes('O10-189'))
  );

  push(
    'gov_prog_r29_export_schema',
    'round 29 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round29-export.v1'
  );

  return results;
}
