import type { O10IdleGovernanceProgramWaveRound64CapstoneResult } from './automation-idle-governance-program-wave-round64-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound64ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round64-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-275';
  projectedLocHint: number;
  round64Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound64ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round64-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-275';
  round52Capstone: O10IdleGovernanceProgramWaveRound64CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound64ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-64 export for O10-275 integration hooks. */
export function exportIdleGovernanceProgramWaveRound64(
  round52Capstone: O10IdleGovernanceProgramWaveRound64CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound64ExportResult {
  const round64Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE64 task=O10-275 round=52`,
    `O10_AGENT20_WAVE64 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE64 round64_ready=${round64Ready}`,
    `O10_AGENT20_WAVE64 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE64 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE64 integration_baseline=308fd6dc`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound64ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round64-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-275',
    projectedLocHint,
    round64Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-275)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round64_export', 'task=O10-275', 'round=52', `ready=${round64Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round64-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-275',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound64ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound64CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round64-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound64CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound64CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound64CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound64CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound64(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 64 export tags O10-275 and loc hint',
    exported.o10TaskId === 'O10-275' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-275'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round64-export.v1'
  );
  return results;
}
