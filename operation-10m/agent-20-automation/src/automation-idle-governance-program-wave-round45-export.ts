import type { O10IdleGovernanceProgramWaveRound44CapstoneResult } from './automation-idle-governance-program-wave-round44-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound45ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round45-export.v1';
  waveRound: 45;
  o10TaskId: 'O10-221';
  projectedLocHint: number;
  round45Ready: boolean;
  wave45HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound45ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round45-export.v1';
  waveRound: 45;
  o10TaskId: 'O10-221';
  round44Capstone: O10IdleGovernanceProgramWaveRound44CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound45ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-45 / wave-45 export for O10-221 integration hooks. */
export function exportIdleGovernanceProgramWaveRound45(
  round44Capstone: O10IdleGovernanceProgramWaveRound44CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound45ExportResult {
  const round45Ready = round44Capstone.capstoneReady;
  const wave45HookLines = [
    `O10_AGENT20_WAVE45 task=O10-221 round=45`,
    `O10_AGENT20_WAVE45 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE45 round45_ready=${round45Ready}`,
    `O10_AGENT20_WAVE45 prior_capstone=${round44Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE45 prior_task=${round44Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound45ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round45-export.v1',
    waveRound: 45,
    o10TaskId: 'O10-221',
    projectedLocHint,
    round45Ready,
    wave45HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 45 export (O10-221)',
    '',
    ...wave45HookLines.map(line => `- ${line}`),
    '',
    round44Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round45_export', 'task=O10-221', 'round=45', `ready=${round45Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round45-export.v1',
    waveRound: 45,
    o10TaskId: 'O10-221',
    round44Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound45ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound44CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round44-capstone.v1',
    o10TaskId: 'O10-219',
    waveRound: 44,
    capstoneReady: true,
    capstoneMarkdown: '# r44',
    summaryLine: 's',
    primaryRound43Capstone: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['primaryRound43Capstone'],
    twinRound43Capstone: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['twinRound43Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['capstoneCompare'],
    round44Export: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['round44Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound45(mockCap(), 2_548_579);
  push(
    'gov_prog_r45_export_o10',
    'wave 45 export tags O10-221 and loc hint',
    exported.o10TaskId === 'O10-221' &&
      exported.payload.projectedLocHint === 2_548_579 &&
      exported.payload.wave45HookLines.some(l => l.includes('O10-221'))
  );
  push(
    'gov_prog_r45_export_schema',
    'round 45 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round45-export.v1'
  );
  return results;
}
