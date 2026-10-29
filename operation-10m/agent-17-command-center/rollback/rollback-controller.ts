import type { Acc17CommandCenterOpsState, Agent17RollbackCheckpoint } from '../types/command-center-types.ts';
import { sanitizeAcc17CommandCenterOpsState } from '../planning/ops-state.ts';

const MAX_CHECKPOINTS = 16;

export interface Agent17RollbackController {
  capture(label: string, turn: number, ops: Acc17CommandCenterOpsState): Agent17RollbackCheckpoint;
  rollbackToLatest(): Acc17CommandCenterOpsState | null;
  rollbackTo(checkpointId: string): Acc17CommandCenterOpsState | null;
  listCheckpoints(): Agent17RollbackCheckpoint[];
  clear(): void;
}

export function createAgent17RollbackController(): Agent17RollbackController {
  const stack: Agent17RollbackCheckpoint[] = [];

  const trim = () => {
    while (stack.length > MAX_CHECKPOINTS) stack.shift();
  };

  return {
    capture(label, turn, ops) {
      const checkpoint: Agent17RollbackCheckpoint = {
        id: `agent17_cp_${Date.now()}_${stack.length}`,
        label,
        createdAt: Date.now(),
        turn,
        ops: sanitizeAcc17CommandCenterOpsState(ops),
      };
      stack.push(checkpoint);
      trim();
      return checkpoint;
    },
    rollbackToLatest() {
      const cp = stack.pop();
      return cp ? sanitizeAcc17CommandCenterOpsState(cp.ops) : null;
    },
    rollbackTo(checkpointId) {
      const idx = stack.findIndex(c => c.id === checkpointId);
      if (idx < 0) return null;
      const [cp] = stack.splice(idx, 1);
      return sanitizeAcc17CommandCenterOpsState(cp.ops);
    },
    listCheckpoints() {
      return [...stack];
    },
    clear() {
      stack.length = 0;
    },
  };
}

/** Migrate unknown persisted shapes before evaluation (forward-only; rollback handles undo). */
export function migrateAgent17OpsPayload(input: unknown): Acc17CommandCenterOpsState {
  if (!input || typeof input !== 'object') {
    return sanitizeAcc17CommandCenterOpsState(input);
  }
  const obj = input as Record<string, unknown>;
  if (obj.version === 2) {
    return sanitizeAcc17CommandCenterOpsState({ ...obj, version: 1 });
  }
  return sanitizeAcc17CommandCenterOpsState(input);
}
