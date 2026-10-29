/**
 * Normative invariants for Division E memory work — enforced by contract tests
 * and documented in docs/ai-memory-system-spec.md (Project store).
 */
export const AI_MEMORY_INVARIANTS = {
  /** Memory adjusts scores only; it never removes legal actions from a decision set. */
  influenceNeverVetoes: true,
  /** The actor who committed an action does not record it in their own observer memory. */
  actorDoesNotSelfRemember: true,
  /** stableKey deduplication — duplicate commits are ignored. */
  idempotentByStableKey: true,
  /** Event list per actor capped at AI_MEMORY_EVENT_CAP. */
  boundedEventHistory: true,
  /** Rival strategic beliefs hidden unless ally team or Full Inspection debug. */
  fogOfWarInspection: true,
  /** Persistent priors capped so past matches nudge, never dictate. */
  priorConfidenceCap: 0.5,
  /** Settings alone cannot enable persistence — verified consent required. */
  persistenceRequiresConsent: true,
  /** Anonymous match identities never write cross-match profiles. */
  anonymousNeverPersists: true,
  /** Stale persistenceGeneration blocks in-flight writes after disable/delete. */
  generationGuardOnDisable: true,
} as const;

export type AiMemoryInvariantId = keyof typeof AI_MEMORY_INVARIANTS;
