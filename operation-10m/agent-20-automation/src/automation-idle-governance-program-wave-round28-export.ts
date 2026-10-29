import type { O10IdleGovernanceProgramWaveRound27CapstoneResult } from './automation-idle-governance-program-wave-round27-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound28ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round28-export.v1';
  waveRound: 28;
  o10TaskId: 'O10-187';
  projectedLocHint: number;
  round28Ready: boolean;
  wave28HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound28ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round28-export.v1';
  waveRound: 28;
  o10TaskId: 'O10-187';
  round27Capstone: O10IdleGovernanceProgramWaveRound27CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound28ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-28 / wave-28 export for O10-187 integration hooks. */
export function exportIdleGovernanceProgramWaveRound28(
  round27Capstone: O10IdleGovernanceProgramWaveRound27CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound28ExportResult {
  const round28Ready = round27Capstone.capstoneReady;

  const wave28HookLines = [
    `O10_AGENT20_WAVE28 task=O10-187 round=28`,
    `O10_AGENT20_WAVE28 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE28 round28_ready=${round28Ready}`,
    `O10_AGENT20_WAVE28 prior_capstone=${round27Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE28 prior_task=${round27Capstone.o10TaskId}`,
  ];

  const payload: O10IdleGovernanceProgramWaveRound28ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round28-export.v1',
    waveRound: 28,
    o10TaskId: 'O10-187',
    projectedLocHint,
    round28Ready,
    wave28HookLines,
  };

  const exportMarkdown = [
    '# Agent 20 scale wave round 28 export (O10-187)',
    '',
    ...wave28HookLines.map(line => `- ${line}`),
    '',
    round27Capstone.capstoneMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round28_export',
    'task=O10-187',
    'round=28',
    `ready=${round28Ready}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round28-export.v1',
    waveRound: 28,
    o10TaskId: 'O10-187',
    round27Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound28ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCap = (): O10IdleGovernanceProgramWaveRound27CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round27-capstone.v1',
    o10TaskId: 'O10-185',
    waveRound: 27,
    capstoneReady: true,
    capstoneMarkdown: '# r27',
    summaryLine: 's',
    primaryRound26Capstone: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['primaryRound26Capstone'],
    twinRound26Capstone: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['twinRound26Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['capstoneCompare'],
    round27Export: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['round27Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound28(mockCap(), 1_645_538);
  push(
    'gov_prog_r28_export_o10',
    'wave 28 export tags O10-187 and loc hint',
    exported.o10TaskId === 'O10-187' &&
      exported.payload.projectedLocHint === 1_645_538 &&
      exported.payload.wave28HookLines.some(l => l.includes('O10-187'))
  );

  push(
    'gov_prog_r28_export_schema',
    'round 28 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round28-export.v1'
  );

  return results;
}
