import { AGENT14_ALL_PROGRAM_STUBS } from './constants.ts';
import { makeSpendingCommitment } from './delayed-spending-effects.ts';
import type { SpendingCommitment } from './types.ts';

export function commitmentFromProgramStub(
  stubId: string,
  committedTurn: number,
  seq: number
): SpendingCommitment | null {
  const stub = AGENT14_ALL_PROGRAM_STUBS.find((p) => p.id === stubId);
  if (!stub) return null;
  return makeSpendingCommitment({
    id: `${stub.id}_c${seq}`,
    programId: stub.id,
    pillar: stub.pillar,
    regionId: stub.regionId,
    committedTurn,
    fiscalLoadPoints: stub.fiscalLoadPoints,
    durationTurns: stub.durationTurns,
    baseImpact: stub.baseImpact,
    effectLagTurns: stub.effectLagTurns,
    rampTurns: 3,
  });
}
