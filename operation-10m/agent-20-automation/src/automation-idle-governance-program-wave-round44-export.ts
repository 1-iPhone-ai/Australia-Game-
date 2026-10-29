import type { O10IdleGovernanceProgramWaveRound43CapstoneResult } from './automation-idle-governance-program-wave-round43-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound44ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round44-export.v1';
  waveRound: 44;
  o10TaskId: 'O10-219';
  projectedLocHint: number;
  round44Ready: boolean;
  wave44HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound44ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round44-export.v1';
  waveRound: 44;
  o10TaskId: 'O10-219';
  round43Capstone: O10IdleGovernanceProgramWaveRound43CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound44ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-44 / wave-44 export for O10-219 integration hooks. */
export function exportIdleGovernanceProgramWaveRound44(
  round43Capstone: O10IdleGovernanceProgramWaveRound43CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound44ExportResult {
  const round44Ready = round43Capstone.capstoneReady;
  const wave44HookLines = [
    `O10_AGENT20_WAVE44 task=O10-219 round=44`,
    `O10_AGENT20_WAVE44 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE44 round44_ready=${round44Ready}`,
    `O10_AGENT20_WAVE44 prior_capstone=${round43Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE44 prior_task=${round43Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound44ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round44-export.v1',
    waveRound: 44,
    o10TaskId: 'O10-219',
    projectedLocHint,
    round44Ready,
    wave44HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 44 export (O10-219)',
    '',
    ...wave44HookLines.map(line => `- ${line}`),
    '',
    round43Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round44_export', 'task=O10-219', 'round=44', `ready=${round44Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round44-export.v1',
    waveRound: 44,
    o10TaskId: 'O10-219',
    round43Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound44ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound43CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round43-capstone.v1',
    o10TaskId: 'O10-217',
    waveRound: 43,
    capstoneReady: true,
    capstoneMarkdown: '# r43',
    summaryLine: 's',
    primaryRound42Capstone: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['primaryRound42Capstone'],
    twinRound42Capstone: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['twinRound42Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['capstoneCompare'],
    round43Export: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['round43Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound44(mockCap(), 2_503_353);
  push(
    'gov_prog_r44_export_o10',
    'wave 44 export tags O10-219 and loc hint',
    exported.o10TaskId === 'O10-219' &&
      exported.payload.projectedLocHint === 2_503_353 &&
      exported.payload.wave44HookLines.some(l => l.includes('O10-219'))
  );
  push(
    'gov_prog_r44_export_schema',
    'round 44 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round44-export.v1'
  );
  return results;
}
