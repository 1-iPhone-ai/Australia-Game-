/**
 * Operation 111 / Agent 106 — pure ledger causal linkage + prune guards.
 * Usage: npx vite-node scripts/run-ledger-causal-pure-tests.mjs
 */
import {
  createGameActivityLedgerEvent,
  pruneLedgerEvents,
} from '../(V9.4) australia-game-with-ai.tsx';

const checks = [];

function check(id, name, fn) {
  try {
    const ok = Boolean(fn());
    checks.push({ id, name, passed: ok, detail: ok ? undefined : 'assertion failed' });
  } catch (err) {
    checks.push({ id, name, passed: false, detail: String(err?.message || err) });
  }
}

check('ch_root_linkage', 'Ledger events mirror causalLinkage on flat fields', () => {
  const root = createGameActivityLedgerEvent('decision', 'root decision', {
    matchId: 'm1',
    sequenceId: 1,
    causalChainId: 'chain-a',
    causalDepth: 0,
  });
  const child = createGameActivityLedgerEvent('action', 'follow-up', {
    matchId: 'm1',
    sequenceId: 2,
    parentEventId: root.eventId,
    rootEventId: root.eventId,
    causalChainId: 'chain-a',
    causalDepth: 1,
  });
  return (
    root.causalLinkage?.causalChainId === 'chain-a'
    && child.parentEventId === root.eventId
    && child.causalLinkage?.parentEventId === root.eventId
    && child.causalDepth === 1
  );
});

check('ch_preserve_root_causal', 'pruneLedgerEvents preserveRootCausal keeps root nodes', () => {
  const root = createGameActivityLedgerEvent('decision', 'root', {
    matchId: 'm1',
    sequenceId: 1,
    day: 1,
    turn: 1,
  });
  const noise = Array.from({ length: 8 }, (_, i) =>
    createGameActivityLedgerEvent('action', `noise ${i}`, {
      matchId: 'm1',
      sequenceId: i + 2,
      parentEventId: 'some-parent',
      day: 1,
      turn: i + 2,
    })
  );
  const events = [root, ...noise];
  const pruned = pruneLedgerEvents(events, 3, 'keep_recent', { preserveRootCausal: true });
  const stillHasRoot = pruned.some((e) => e.eventId === root.eventId);
  return stillHasRoot && pruned.totalPruned >= 1;
});

check('ch_keep_critical_policy', 'keep_critical retains approval category under cap pressure', () => {
  const routine = Array.from({ length: 6 }, (_, i) =>
    createGameActivityLedgerEvent('action', `routine ${i}`, { matchId: 'm1', sequenceId: i + 1 })
  );
  const critical = createGameActivityLedgerEvent('approval', 'governance vote', {
    matchId: 'm1',
    sequenceId: 99,
  });
  const pruned = pruneLedgerEvents([...routine, critical], 3, 'keep_critical');
  return pruned.some((e) => e.category === 'approval');
});

const failed = checks.filter((c) => !c.passed);
console.log(
  JSON.stringify(
    {
      suite: 'ledger-causal-pure',
      total: checks.length,
      passed: checks.length - failed.length,
      failedCount: failed.length,
      failed,
    },
    null,
    2
  )
);
process.exit(failed.length ? 1 : 0);
