import type { O10IdleGovernanceProgramSubjectPassResult } from './automation-idle-governance-program-subject-pass.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramScaleWaveRollupResult {
  schema: '10m.agent20.idle-governance-program-scale-wave-rollup.v1';
  waveRound: number;
  subjectPassCount: number;
  clearedCount: number;
  conditionalCount: number;
  blockedCount: number;
  meanComplianceScore: number;
  waveRecommendation: string;
  summaryLine: string;
}

/** Round-17 scale wave rollup across one or more subject passes in the same wave. */
export function rollupIdleGovernanceProgramScaleWave(
  waveRound: number,
  subjectPasses: O10IdleGovernanceProgramSubjectPassResult[]
): O10IdleGovernanceProgramScaleWaveRollupResult {
  const count = subjectPasses.length;
  if (count === 0) {
    return {
      schema: '10m.agent20.idle-governance-program-scale-wave-rollup.v1',
      waveRound,
      subjectPassCount: 0,
      clearedCount: 0,
      conditionalCount: 0,
      blockedCount: 0,
      meanComplianceScore: 0,
      waveRecommendation: 'run_subject_pass',
      summaryLine: `gov_program_scale_wave_rollup round=${waveRound} passes=0`,
    };
  }

  let clearedCount = 0;
  let conditionalCount = 0;
  let blockedCount = 0;
  let scoreSum = 0;

  for (const pass of subjectPasses) {
    if (pass.clearance === 'cleared') clearedCount += 1;
    else if (pass.clearance === 'conditional') conditionalCount += 1;
    else blockedCount += 1;
    scoreSum += pass.executive.director.complianceScore.score;
  }

  const meanComplianceScore = scoreSum / count;

  let waveRecommendation = 'continue_scale_wave';
  if (blockedCount >= Math.ceil(count / 2)) {
    waveRecommendation = 'halt_scale_wave_escalate';
  } else if (conditionalCount > clearedCount) {
    waveRecommendation = 'slow_scale_wave_remediate';
  } else if (clearedCount === count && meanComplianceScore >= 75) {
    waveRecommendation = 'advance_scale_wave';
  }

  const summaryLine = [
    'gov_program_scale_wave_rollup',
    `round=${waveRound}`,
    `passes=${count}`,
    `cleared=${clearedCount}`,
    `mean_score=${meanComplianceScore.toFixed(1)}`,
    `rec=${waveRecommendation}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-scale-wave-rollup.v1',
    waveRound,
    subjectPassCount: count,
    clearedCount,
    conditionalCount,
    blockedCount,
    meanComplianceScore,
    waveRecommendation,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramScaleWaveRollupSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const empty = rollupIdleGovernanceProgramScaleWave(17, []);
  push('gov_prog_wave_roll_empty', 'empty wave rollup prompts subject pass', empty.waveRecommendation === 'run_subject_pass');

  const mockSubject = (clearance: 'cleared' | 'conditional' | 'blocked', score: number) =>
    ({
      schema: '10m.agent20.idle-governance-program-subject-pass.v1',
      clearance,
      summaryLine: 'subject',
      subjectMarkdown: 'md',
      executive: {
        schema: '10m.agent20.idle-governance-program-executive-pass.v1',
        summaryLine: 'exec',
        executiveMarkdown: 'exec',
        board: {
          schema: '10m.agent20.idle-governance-program-board-certification.v1',
          decision: clearance === 'cleared' ? 'certify' : clearance === 'conditional' ? 'hold' : 'escalate',
          rationale: [],
          certificationMarkdown: '',
          summaryLine: 'board',
        },
        remediation: {
          schema: '10m.agent20.idle-governance-program-remediation-plan.v1',
          items: [],
          summaryLine: 'rem',
          planMarkdown: '',
        },
        director: {
          schema: '10m.agent20.idle-governance-program-director-pass.v1',
          summaryLine: 'dir',
          directorMarkdown: '',
          operations: {} as O10IdleGovernanceProgramSubjectPassResult['executive']['director']['operations'],
          registryRollup: {
            schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
            entryCount: 1,
            attestOkRatio: 1,
            escalationCount: 0,
            dominantRollup: 'continue_scheduled_watch',
            recommendation: 'director_certify_program',
            summaryLine: 'rollup',
          },
          complianceScore: {
            schema: '10m.agent20.idle-governance-program-compliance-score.v1',
            score,
            band: score >= 70 ? 'green' : score >= 45 ? 'amber' : 'red',
            factors: [],
            summaryLine: 'score',
          },
        },
      },
    }) satisfies O10IdleGovernanceProgramSubjectPassResult;

  const advance = rollupIdleGovernanceProgramScaleWave(17, [
    mockSubject('cleared', 88),
    mockSubject('cleared', 82),
  ]);
  push('gov_prog_wave_roll_advance', 'all cleared high scores advance wave', advance.waveRecommendation === 'advance_scale_wave');

  const halt = rollupIdleGovernanceProgramScaleWave(17, [
    mockSubject('blocked', 20),
    mockSubject('blocked', 25),
  ]);
  push('gov_prog_wave_roll_halt', 'majority blocked halts wave', halt.waveRecommendation === 'halt_scale_wave_escalate');

  push(
    'gov_prog_wave_roll_schema',
    'scale wave rollup schema marker',
    advance.schema === '10m.agent20.idle-governance-program-scale-wave-rollup.v1'
  );

  return results;
}
