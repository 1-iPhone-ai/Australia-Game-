import type { O10IdleGovernanceProgramComplianceScore } from './automation-idle-governance-program-compliance-score.js';
import type { O10IdleGovernanceProgramDirectorPassResult } from './automation-idle-governance-program-director-pass.js';
import type { O10IdleGovernanceProgramRemediationPlan } from './automation-idle-governance-program-remediation-plan.js';
import type { O10SelfTestResult } from './types.js';

export type O10IdleGovernanceProgramBoardDecision = 'certify' | 'hold' | 'escalate';

export interface O10IdleGovernanceProgramBoardCertification {
  schema: '10m.agent20.idle-governance-program-board-certification.v1';
  decision: O10IdleGovernanceProgramBoardDecision;
  rationale: string[];
  certificationMarkdown: string;
  summaryLine: string;
}

function buildBoardCertificationMarkdown(
  decision: O10IdleGovernanceProgramBoardDecision,
  rationale: string[]
): string {
  return [
    '## Agent 20 idle governance board certification',
    '',
    `- decision=${decision}`,
    ...rationale.map(r => `- ${r}`),
    '',
  ].join('\n');
}

/** Round-16 board certification from director pass outputs + remediation backlog. */
export function certifyIdleGovernanceProgramBoard(
  director: O10IdleGovernanceProgramDirectorPassResult,
  remediation: O10IdleGovernanceProgramRemediationPlan
): O10IdleGovernanceProgramBoardCertification {
  const compliance: O10IdleGovernanceProgramComplianceScore = director.complianceScore;
  const rollup = director.registryRollup;
  const rationale: string[] = [
    compliance.summaryLine,
    rollup.summaryLine,
    remediation.summaryLine,
  ];

  let decision: O10IdleGovernanceProgramBoardDecision = 'hold';

  if (remediation.items.some(i => i.actionKey === 'escalate_human_takeover')) {
    decision = 'escalate';
    rationale.push('Remediation backlog requires human takeover escalation.');
  } else if (compliance.band === 'green' && rollup.recommendation === 'director_certify_program') {
    decision = 'certify';
    rationale.push('Green compliance with director certify recommendation.');
  } else if (compliance.band === 'red') {
    decision = 'escalate';
    rationale.push('Red compliance band blocks certification.');
  } else if (compliance.band === 'amber') {
    decision = 'hold';
    rationale.push('Amber band — hold pending remediation execution.');
  } else if (compliance.band === 'green') {
    decision = 'certify';
    rationale.push('Green compliance — board certifies program cadence.');
  }

  const summaryLine = ['gov_program_board', `decision=${decision}`, `score=${compliance.score}`].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-board-certification.v1',
    decision,
    rationale,
    certificationMarkdown: buildBoardCertificationMarkdown(decision, rationale),
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramBoardCertificationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockDirector = (band: 'red' | 'amber' | 'green', rollupRec: string, score: number) =>
    ({
      schema: '10m.agent20.idle-governance-program-director-pass.v1',
      operations: {} as O10IdleGovernanceProgramDirectorPassResult['operations'],
      registryRollup: {
        schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
        entryCount: 1,
        attestOkRatio: band === 'green' ? 1 : 0.4,
        escalationCount: 0,
        dominantRollup: 'continue_scheduled_watch',
        recommendation: rollupRec,
        summaryLine: 'rollup',
      },
      complianceScore: {
        schema: '10m.agent20.idle-governance-program-compliance-score.v1',
        score,
        band,
        factors: [],
        summaryLine: `band=${band}`,
      },
      directorMarkdown: 'brief',
      summaryLine: 'director',
    }) satisfies O10IdleGovernanceProgramDirectorPassResult;

  const mockRemediation = (items: O10IdleGovernanceProgramRemediationPlan['items']) =>
    ({
      schema: '10m.agent20.idle-governance-program-remediation-plan.v1',
      items,
      summaryLine: 'remediation',
      planMarkdown: 'plan',
    }) satisfies O10IdleGovernanceProgramRemediationPlan;

  const certify = certifyIdleGovernanceProgramBoard(
    mockDirector('green', 'director_certify_program', 88),
    mockRemediation([{ priority: 1, actionKey: 'maintain_program_cadence', rationale: 'ok' }])
  );
  push('gov_prog_board_certify', 'green + certify recommendation certifies', certify.decision === 'certify');

  const hold = certifyIdleGovernanceProgramBoard(
    mockDirector('amber', 'director_audit_program_attestations', 52),
    mockRemediation([{ priority: 1, actionKey: 'tighten_watch_cadence', rationale: 'watch' }])
  );
  push('gov_prog_board_hold', 'amber band holds', hold.decision === 'hold');

  const escalate = certifyIdleGovernanceProgramBoard(
    mockDirector('red', 'director_escalate_takeover', 25),
    mockRemediation([{ priority: 0, actionKey: 'escalate_human_takeover', rationale: 'takeover' }])
  );
  push('gov_prog_board_escalate', 'takeover remediation escalates', escalate.decision === 'escalate');

  push(
    'gov_prog_board_schema',
    'board certification schema marker',
    certify.schema === '10m.agent20.idle-governance-program-board-certification.v1'
  );

  return results;
}
