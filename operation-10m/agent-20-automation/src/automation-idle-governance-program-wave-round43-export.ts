import type { O10IdleGovernanceProgramWaveRound42CapstoneResult } from './automation-idle-governance-program-wave-round42-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound43ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round43-export.v1';
  waveRound: 43;
  o10TaskId: 'O10-217';
  projectedLocHint: number;
  round43Ready: boolean;
  wave43HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound43ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round43-export.v1';
  waveRound: 43;
  o10TaskId: 'O10-217';
  round42Capstone: O10IdleGovernanceProgramWaveRound42CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound43ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-43 / wave-43 export for O10-217 integration hooks. */
export function exportIdleGovernanceProgramWaveRound43(
  round42Capstone: O10IdleGovernanceProgramWaveRound42CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound43ExportResult {
  const round43Ready = round42Capstone.capstoneReady;
  const wave43HookLines = [
    `O10_AGENT20_WAVE43 task=O10-217 round=43`,
    `O10_AGENT20_WAVE43 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE43 round43_ready=${round43Ready}`,
    `O10_AGENT20_WAVE43 prior_capstone=${round42Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE43 prior_task=${round42Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound43ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round43-export.v1',
    waveRound: 43,
    o10TaskId: 'O10-217',
    projectedLocHint,
    round43Ready,
    wave43HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 43 export (O10-217)',
    '',
    ...wave43HookLines.map(line => `- ${line}`),
    '',
    round42Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round43_export', 'task=O10-217', 'round=43', `ready=${round43Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round43-export.v1',
    waveRound: 43,
    o10TaskId: 'O10-217',
    round42Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound43ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound42CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round42-capstone.v1',
    o10TaskId: 'O10-215',
    waveRound: 42,
    capstoneReady: true,
    capstoneMarkdown: '# r42',
    summaryLine: 's',
    primaryRound41Capstone: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['primaryRound41Capstone'],
    twinRound41Capstone: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['twinRound41Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['capstoneCompare'],
    round42Export: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['round42Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound43(mockCap(), 2_253_960);
  push(
    'gov_prog_r43_export_o10',
    'wave 43 export tags O10-217 and loc hint',
    exported.o10TaskId === 'O10-217' &&
      exported.payload.projectedLocHint === 2_253_960 &&
      exported.payload.wave43HookLines.some(l => l.includes('O10-217'))
  );
  push(
    'gov_prog_r43_export_schema',
    'round 43 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round43-export.v1'
  );
  return results;
}
