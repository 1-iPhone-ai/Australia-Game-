import type { O10IdleGovernanceProgramPassResult } from './automation-idle-governance-program-pass.js';
import { buildIdleGovernanceReplayTapeFromWatch } from './automation-idle-governance-watch-replay-tape.js';
import { verifyIdleGovernanceReplayTapeDeterminism } from './automation-idle-governance-watch-replay-tape.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramAttestation {
  schema: '10m.agent20.idle-governance-program-attestation.v1';
  replayFrameCount: number;
  effectiveCycles: number;
  replayDeterministic: boolean;
  charterPolicyLine: string;
  rollupRecommendation: string;
  digestChain: string;
  ok: boolean;
  notes: string[];
}

function fnv1aHex(text: string): string {
  let chain = 2166136261;
  for (let i = 0; i < text.length; i++) {
    chain ^= text.charCodeAt(i);
    chain = Math.imul(chain, 16777619);
  }
  return `o10govprog_${(chain >>> 0).toString(16).padStart(8, '0')}`;
}

/** Attest a program pass: replay determinism, cycle alignment, rollup recommendation present. */
export function attestIdleGovernanceProgramPass(
  pass: O10IdleGovernanceProgramPassResult
): O10IdleGovernanceProgramAttestation {
  const notes: string[] = [];
  const tape = pass.replayTape;
  const verify = verifyIdleGovernanceReplayTapeDeterminism(pass.watch, tape);

  if (!pass.replayDeterministic || !verify.ok) {
    notes.push('replay_nondeterministic');
  }
  if (tape.frameCount !== pass.watch.journal.entries.length) {
    notes.push(`frame_journal_mismatch:${tape.frameCount}!=${pass.watch.journal.entries.length}`);
  }
  if (pass.effectiveCycles !== pass.watch.cyclesRun) {
    notes.push('cycle_count_mismatch');
  }
  if (tape.rollupRecommendation !== pass.watch.rollup.recommendation) {
    notes.push('rollup_recommendation_mismatch');
  }

  const digestChain = fnv1aHex([
    pass.charterPolicyLine,
    tape.rollupRecommendation,
    tape.frames.map(f => f.digest).join('|'),
    String(pass.effectiveCycles),
  ].join('\n'));

  const ok = notes.length === 0;

  return {
    schema: '10m.agent20.idle-governance-program-attestation.v1',
    replayFrameCount: tape.frameCount,
    effectiveCycles: pass.effectiveCycles,
    replayDeterministic: pass.replayDeterministic && verify.ok,
    charterPolicyLine: pass.charterPolicyLine,
    rollupRecommendation: tape.rollupRecommendation,
    digestChain,
    ok,
    notes,
  };
}

export function verifyIdleGovernanceProgramAttestation(
  pass: O10IdleGovernanceProgramPassResult,
  attestation: O10IdleGovernanceProgramAttestation
): boolean {
  const rerun = attestIdleGovernanceProgramPass(pass);
  return rerun.digestChain === attestation.digestChain && rerun.ok === attestation.ok;
}

export function runO10Agent20IdleGovernanceProgramAttestationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockWatch = {
    schema: '10m.agent20.idle-governance-sustained-watch.v1' as const,
    cyclesRun: 2,
    summaryLine: 'watch',
    finalTrail: { schema: '10m.agent20.idle-governance-audit-trail.v1' as const, entries: [] },
    lastPass: {} as never,
    journal: {
      schema: '10m.agent20.idle-governance-assurance-journal.v1' as const,
      entries: [
        {
          schema: '10m.agent20.idle-governance-assurance-journal-entry.v1' as const,
          turn: 1,
          attestationFingerprint: 'fnv1a_1',
          reconcileStatus: 'aligned',
          trendDirection: 'stable',
          watchUrgency: 'low',
          attestValid: true,
        },
        {
          schema: '10m.agent20.idle-governance-assurance-journal-entry.v1' as const,
          turn: 2,
          attestationFingerprint: 'fnv1a_2',
          reconcileStatus: 'aligned',
          trendDirection: 'stable',
          watchUrgency: 'low',
          attestValid: true,
        },
      ],
    },
    rollup: {
      schema: '10m.agent20.idle-governance-assurance-rollup.v1' as const,
      entryCount: 2,
      validRatio: 1,
      highUrgencyCount: 0,
      dominantTrend: 'stable',
      recommendation: 'continue_scheduled_watch',
      summaryLine: 'rollup',
    },
  };

  const replayTape = buildIdleGovernanceReplayTapeFromWatch(mockWatch);
  const replayDeterministic = verifyIdleGovernanceReplayTapeDeterminism(mockWatch, replayTape).ok;

  const mockPass: O10IdleGovernanceProgramPassResult = {
    schema: '10m.agent20.idle-governance-program-pass.v1',
    requestedCycles: 2,
    effectiveCycles: 2,
    charterPolicyLine: 'charter continue_scheduled_watch',
    replayDeterministic,
    summaryLine: 'mock',
    watch: mockWatch,
    replayTape,
  };

  const att = attestIdleGovernanceProgramPass(mockPass);
  push('gov_prog_att_ok', 'aligned mock pass attests ok', att.ok && att.digestChain.startsWith('o10govprog_'));
  push('gov_prog_att_verify', 'verify matches digest rerun', verifyIdleGovernanceProgramAttestation(mockPass, att));

  const badPass = {
    ...mockPass,
    replayDeterministic: false,
    replayTape: { ...mockPass.replayTape, rollupRecommendation: 'escalate_to_human_takeover' as const },
  };
  const badAtt = attestIdleGovernanceProgramPass(badPass);
  push('gov_prog_att_fail', 'mismatch yields notes and not ok', !badAtt.ok && badAtt.notes.length > 0);

  push('gov_prog_att_schema', 'program attestation schema marker', att.schema === '10m.agent20.idle-governance-program-attestation.v1');

  return results;
}
