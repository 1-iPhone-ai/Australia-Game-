import type { O10IdleGovernanceProgramWaveRound53CapstoneResult } from './automation-idle-governance-program-wave-round53-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound53ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round53-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-237';
  projectedLocHint: number;
  round53Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound53ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round53-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-237';
  round52Capstone: O10IdleGovernanceProgramWaveRound53CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound53ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-53 / wave-53 export for O10-237 integration hooks. */
export function exportIdleGovernanceProgramWaveRound53(
  round52Capstone: O10IdleGovernanceProgramWaveRound53CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound53ExportResult {
  const round53Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE53 task=O10-237 round=52`,
    `O10_AGENT20_WAVE53 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE53 round53_ready=${round53Ready}`,
    `O10_AGENT20_WAVE53 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE53 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE53 integration_baseline=51039c5e`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound53ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round53-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-237',
    projectedLocHint,
    round53Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-237)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round53_export', 'task=O10-237', 'round=52', `ready=${round53Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round53-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-237',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound53CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round53-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound53CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound53CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound53CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound53CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound53(mockCap(), 2_979_928);
  push(
    'gov_prog_r53_export_o10',
    'wave 53 export tags O10-237 and loc hint',
    exported.o10TaskId === 'O10-237' &&
      exported.payload.projectedLocHint === 2_979_928 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-237'))
  );
  push(
    'gov_prog_r53_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round53-export.v1'
  );
  return results;
}
