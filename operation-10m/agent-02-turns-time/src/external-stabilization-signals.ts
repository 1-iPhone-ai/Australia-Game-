/** Agent 05 pending-response stabilization export (round 8+). */
export interface ExternalStabilizationTurnSignals {
  postQueueCalm: boolean;
  pendingStabilizationWave: boolean;
}

export function normalizeExternalStabilizationSignals(
  raw: ExternalStabilizationTurnSignals | undefined,
): ExternalStabilizationTurnSignals {
  return {
    postQueueCalm: raw?.postQueueCalm ?? false,
    pendingStabilizationWave: raw?.pendingStabilizationWave ?? false,
  };
}

export function externalStabilizationSignalsEqual(
  a: ExternalStabilizationTurnSignals,
  b: ExternalStabilizationTurnSignals,
): boolean {
  const left = normalizeExternalStabilizationSignals(a);
  const right = normalizeExternalStabilizationSignals(b);
  return (
    left.postQueueCalm === right.postQueueCalm &&
    left.pendingStabilizationWave === right.pendingStabilizationWave
  );
}
