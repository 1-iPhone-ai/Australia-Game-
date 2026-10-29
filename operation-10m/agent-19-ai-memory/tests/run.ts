import { runAgent19MemoryEvalSuite } from '../eval/run-suite.ts';
import {
  applyAiMemoryInfluence,
  applyCommittedActionToAiMemories,
  applyPriorsToFreshMemories,
  buildAiMemoryHorizonSnapshot as canonicalHorizon,
  createFreshAiMemories,
  HUMAN_PROFILE_ID,
  profileToPriorSeed,
  runAiMemoryPhase7SelfTests,
} from '../canonical-study/v94-section-1b-memory.ts';
import { auditFindingsOk, auditMemoryInfluenceDecisions } from '../influence-audit.ts';

const MEM_OBS = [
  { id: 'player', kind: 'human', teamId: 'team_player' },
  { id: 'ai', kind: 'ai', teamId: 'team_opponent' },
  { id: 'ally_ai', kind: 'ai', teamId: 'team_player' },
] as const;

function main() {
  const suite = runAgent19MemoryEvalSuite({
    buildAiMemoryHorizonSnapshot: canonicalHorizon,
    createFreshAiMemories,
    applyPriorsToFreshMemories,
    profileToPriorSeed,
    HUMAN_PROFILE_ID,
  });

  const phase7 = runAiMemoryPhase7SelfTests().results.map(r => ({
    id: `canonical_${r.id}`,
    name: r.name,
    passed: r.passed,
    detail: r.detail,
  }));

  let m = createFreshAiMemories(['ai']);
  m = applyCommittedActionToAiMemories(
    m,
    { actionType: 'sabotage', actorId: 'player', targetId: 'ai', turn: 1, summary: 's', stableKey: 'audit' },
    [...MEM_OBS],
  );
  const before = [{ type: 'sabotage', score: 10, data: { targetActorId: 'player' } }, { type: 'sell', score: 10 }];
  const after = applyAiMemoryInfluence(before, { actorId: 'ai', memory: m.ai });
  const auditOk = auditFindingsOk(auditMemoryInfluenceDecisions(before, after));
  const auditCase = {
    id: 'a19_live_influence_audit',
    name: 'Canonical applyAiMemoryInfluence passes modular audit',
    passed: auditOk && after.length === 2,
    detail: auditOk ? undefined : 'audit findings failed',
  };

  const all = [...suite.results, ...phase7, auditCase];
  const failed = all.filter(r => !r.passed);
  for (const r of all) {
    const mark = r.passed ? 'ok' : 'FAIL';
    console.log(`${mark}  ${r.id}  ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
  }
  console.log(`\nAgent 19: ${all.length - failed.length}/${all.length} passed`);
  if (failed.length) process.exit(1);
}

main();
