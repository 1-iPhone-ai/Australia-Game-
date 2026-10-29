import type { O10IdleGovernanceProgramWaveRound30CapstoneResult } from './automation-idle-governance-program-wave-round30-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound31ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round31-export.v1';
  waveRound: 31;
  o10TaskId: 'O10-193';
  projectedLocHint: number;
  round31Ready: boolean;
  wave31HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound31ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round31-export.v1';
  waveRound: 31;
  o10TaskId: 'O10-193';
  round30Capstone: O10IdleGovernanceProgramWaveRound30CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound31ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-31 / wave-31 export for O10-193 integration hooks. */
export function exportIdleGovernanceProgramWaveRound31(
  round30Capstone: O10IdleGovernanceProgramWaveRound30CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound31ExportResult {
  const round31Ready = round30Capstone.capstoneReady;
  const wave31HookLines = [
    `O10_AGENT20_WAVE31 task=O10-193 round=31`,
    `O10_AGENT20_WAVE31 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE31 round31_ready=${round31Ready}`,
    `O10_AGENT20_WAVE31 prior_capstone=${round30Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE31 prior_task=${round30Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound31ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round31-export.v1',
    waveRound: 31,
    o10TaskId: 'O10-193',
    projectedLocHint,
    round31Ready,
    wave31HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 31 export (O10-193)',
    '',
    ...wave31HookLines.map(line => `- ${line}`),
    '',
    round30Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round31_export', 'task=O10-193', 'round=31', `ready=${round31Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round31-export.v1',
    waveRound: 31,
    o10TaskId: 'O10-193',
    round30Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound31ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound30CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round30-capstone.v1',
    o10TaskId: 'O10-191',
    waveRound: 30,
    capstoneReady: true,
    capstoneMarkdown: '# r30',
    summaryLine: 's',
    primaryRound29Capstone: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['primaryRound29Capstone'],
    twinRound29Capstone: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['twinRound29Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['capstoneCompare'],
    round30Export: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['round30Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound31(mockCap(), 1_760_131);
  push(
    'gov_prog_r31_export_o10',
    'wave 31 export tags O10-193 and loc hint',
    exported.o10TaskId === 'O10-193' &&
      exported.payload.projectedLocHint === 1_760_131 &&
      exported.payload.wave31HookLines.some(l => l.includes('O10-193'))
  );
  push(
    'gov_prog_r31_export_schema',
    'round 31 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round31-export.v1'
  );
  return results;
}
