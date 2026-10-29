import type { O10IdleGovernanceProgramWaveCloseoutResult } from './automation-idle-governance-program-wave-closeout.js';
import type { O10SelfTestResult } from './types.js';

export type O10IdleGovernanceProgramWaveScorecardBand = 'green' | 'amber' | 'red';

export interface O10IdleGovernanceProgramWaveScorecardResult {
  schema: '10m.agent20.idle-governance-program-wave-scorecard.v1';
  waveRound: number;
  clearance: O10IdleGovernanceProgramWaveCloseoutResult['subject']['clearance'];
  waveRecommendation: string;
  meanComplianceScore: number;
  scorecardBand: O10IdleGovernanceProgramWaveScorecardBand;
  assemblyReady: boolean;
  scorecardMarkdown: string;
  summaryLine: string;
}

function bandFromCloseout(closeout: O10IdleGovernanceProgramWaveCloseoutResult): O10IdleGovernanceProgramWaveScorecardBand {
  const rec = closeout.scaleWaveRollup.waveRecommendation;
  if (rec === 'halt_scale_wave_escalate') return 'red';
  if (rec === 'slow_scale_wave_remediate' || closeout.subject.clearance === 'conditional') return 'amber';
  if (closeout.subject.clearance === 'blocked') return 'red';
  return 'green';
}

export function buildIdleGovernanceProgramWaveScorecardMarkdown(
  closeout: O10IdleGovernanceProgramWaveCloseoutResult,
  band: O10IdleGovernanceProgramWaveScorecardBand,
  assemblyReady: boolean
): string {
  return [
    '# Agent 20 idle governance wave scorecard',
    '',
    `- wave_round=${closeout.waveRound}`,
    `- band=${band}`,
    `- assembly_ready=${assemblyReady}`,
    `- ${closeout.scaleWaveRollup.summaryLine}`,
    '',
    closeout.closeoutMarkdown,
  ].join('\n');
}

/** Round-18 scorecard digest from a wave closeout for assembly gating. */
export function exportIdleGovernanceProgramWaveScorecard(
  closeout: O10IdleGovernanceProgramWaveCloseoutResult
): O10IdleGovernanceProgramWaveScorecardResult {
  const waveRound = closeout.waveRound;
  const clearance = closeout.subject.clearance;
  const waveRecommendation = closeout.scaleWaveRollup.waveRecommendation;
  const meanComplianceScore = closeout.scaleWaveRollup.meanComplianceScore;
  const scorecardBand = bandFromCloseout(closeout);

  const assemblyReady =
    scorecardBand !== 'red' &&
    waveRecommendation !== 'halt_scale_wave_escalate' &&
    waveRecommendation !== 'run_subject_pass';

  const scorecardMarkdown = buildIdleGovernanceProgramWaveScorecardMarkdown(closeout, scorecardBand, assemblyReady);

  const summaryLine = [
    'gov_program_wave_scorecard',
    `round=${waveRound}`,
    `band=${scorecardBand}`,
    `ready=${assemblyReady}`,
    `rec=${waveRecommendation}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scorecard.v1',
    waveRound,
    clearance,
    waveRecommendation,
    meanComplianceScore,
    scorecardBand,
    assemblyReady,
    scorecardMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScorecardSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCloseout = (
    clearance: 'cleared' | 'conditional' | 'blocked',
    rec: string,
    score: number
  ): O10IdleGovernanceProgramWaveCloseoutResult =>
    ({
      schema: '10m.agent20.idle-governance-program-wave-closeout.v1',
      waveRound: 18,
      closeoutMarkdown: 'closeout',
      summaryLine: 'closeout',
      subject: {
        clearance,
        summaryLine: 'subj',
        subjectMarkdown: 'subj',
        schema: '10m.agent20.idle-governance-program-subject-pass.v1',
        executive: {} as O10IdleGovernanceProgramWaveCloseoutResult['subject']['executive'],
      },
      scaleWaveRollup: {
        schema: '10m.agent20.idle-governance-program-scale-wave-rollup.v1',
        waveRound: 18,
        subjectPassCount: 1,
        clearedCount: clearance === 'cleared' ? 1 : 0,
        conditionalCount: clearance === 'conditional' ? 1 : 0,
        blockedCount: clearance === 'blocked' ? 1 : 0,
        meanComplianceScore: score,
        waveRecommendation: rec,
        summaryLine: 'rollup',
      },
    }) satisfies O10IdleGovernanceProgramWaveCloseoutResult;

  const green = exportIdleGovernanceProgramWaveScorecard(
    mockCloseout('cleared', 'advance_scale_wave', 90)
  );
  push(
    'gov_prog_wave_score_green',
    'advance closeout yields green scorecard ready for assembly',
    green.scorecardBand === 'green' && green.assemblyReady === true
  );

  const red = exportIdleGovernanceProgramWaveScorecard(
    mockCloseout('blocked', 'halt_scale_wave_escalate', 12)
  );
  push(
    'gov_prog_wave_score_red',
    'halt recommendation yields red scorecard not assembly ready',
    red.scorecardBand === 'red' && red.assemblyReady === false
  );

  push(
    'gov_prog_wave_score_md',
    'scorecard markdown includes wave scorecard header',
    green.scorecardMarkdown.includes('wave scorecard') && green.scorecardMarkdown.includes('band=green')
  );

  push(
    'gov_prog_wave_score_schema',
    'wave scorecard schema marker',
    green.schema === '10m.agent20.idle-governance-program-wave-scorecard.v1'
  );

  return results;
}
