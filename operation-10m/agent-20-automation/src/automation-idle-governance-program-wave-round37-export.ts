import type { O10IdleGovernanceProgramWaveRound36CapstoneResult } from './automation-idle-governance-program-wave-round36-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound37ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round37-export.v1';
  waveRound: 37;
  o10TaskId: 'O10-205';
  projectedLocHint: number;
  round37Ready: boolean;
  wave37HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound37ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round37-export.v1';
  waveRound: 37;
  o10TaskId: 'O10-205';
  round36Capstone: O10IdleGovernanceProgramWaveRound36CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound37ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-37 / wave-37 export for O10-205 integration hooks. */
export function exportIdleGovernanceProgramWaveRound37(
  round36Capstone: O10IdleGovernanceProgramWaveRound36CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound37ExportResult {
  const round37Ready = round36Capstone.capstoneReady;
  const wave37HookLines = [
    `O10_AGENT20_WAVE37 task=O10-205 round=37`,
    `O10_AGENT20_WAVE37 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE37 round37_ready=${round37Ready}`,
    `O10_AGENT20_WAVE37 prior_capstone=${round36Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE37 prior_task=${round36Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound37ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round37-export.v1',
    waveRound: 37,
    o10TaskId: 'O10-205',
    projectedLocHint,
    round37Ready,
    wave37HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 37 export (O10-205)',
    '',
    ...wave37HookLines.map(line => `- ${line}`),
    '',
    round36Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round37_export', 'task=O10-205', 'round=37', `ready=${round37Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round37-export.v1',
    waveRound: 37,
    o10TaskId: 'O10-205',
    round36Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound37ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound36CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round36-capstone.v1',
    o10TaskId: 'O10-203',
    waveRound: 36,
    capstoneReady: true,
    capstoneMarkdown: '# r36',
    summaryLine: 's',
    primaryRound35Capstone: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['primaryRound35Capstone'],
    twinRound35Capstone: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['twinRound35Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['capstoneCompare'],
    round36Export: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['round36Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound37(mockCap(), 2_001_028);
  push(
    'gov_prog_r37_export_o10',
    'wave 37 export tags O10-205 and loc hint',
    exported.o10TaskId === 'O10-205' &&
      exported.payload.projectedLocHint === 2_001_028 &&
      exported.payload.wave37HookLines.some(l => l.includes('O10-205'))
  );
  push(
    'gov_prog_r37_export_schema',
    'round 37 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round37-export.v1'
  );
  return results;
}
