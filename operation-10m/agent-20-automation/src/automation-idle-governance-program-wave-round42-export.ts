import type { O10IdleGovernanceProgramWaveRound41CapstoneResult } from './automation-idle-governance-program-wave-round41-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound42ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round42-export.v1';
  waveRound: 42;
  o10TaskId: 'O10-215';
  projectedLocHint: number;
  round42Ready: boolean;
  wave42HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound42ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round42-export.v1';
  waveRound: 42;
  o10TaskId: 'O10-215';
  round41Capstone: O10IdleGovernanceProgramWaveRound41CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound42ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-42 / wave-42 export for O10-215 integration hooks. */
export function exportIdleGovernanceProgramWaveRound42(
  round41Capstone: O10IdleGovernanceProgramWaveRound41CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound42ExportResult {
  const round42Ready = round41Capstone.capstoneReady;
  const wave42HookLines = [
    `O10_AGENT20_WAVE42 task=O10-215 round=42`,
    `O10_AGENT20_WAVE42 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE42 round42_ready=${round42Ready}`,
    `O10_AGENT20_WAVE42 prior_capstone=${round41Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE42 prior_task=${round41Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound42ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round42-export.v1',
    waveRound: 42,
    o10TaskId: 'O10-215',
    projectedLocHint,
    round42Ready,
    wave42HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 42 export (O10-215)',
    '',
    ...wave42HookLines.map(line => `- ${line}`),
    '',
    round41Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round42_export', 'task=O10-215', 'round=42', `ready=${round42Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round42-export.v1',
    waveRound: 42,
    o10TaskId: 'O10-215',
    round41Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound42ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound41CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round41-capstone.v1',
    o10TaskId: 'O10-213',
    waveRound: 41,
    capstoneReady: true,
    capstoneMarkdown: '# r41',
    summaryLine: 's',
    primaryRound40Capstone: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['primaryRound40Capstone'],
    twinRound40Capstone: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['twinRound40Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['capstoneCompare'],
    round41Export: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['round41Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound42(mockCap(), 2_207_543);
  push(
    'gov_prog_r42_export_o10',
    'wave 42 export tags O10-215 and loc hint',
    exported.o10TaskId === 'O10-215' &&
      exported.payload.projectedLocHint === 2_207_543 &&
      exported.payload.wave42HookLines.some(l => l.includes('O10-215'))
  );
  push(
    'gov_prog_r42_export_schema',
    'round 42 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round42-export.v1'
  );
  return results;
}
