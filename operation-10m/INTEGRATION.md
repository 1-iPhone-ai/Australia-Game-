# Operation 10M — Integration contracts (draft)

## Agent 16 — Guardian / Co-Pilot (`operation-10m/agent-16-guardian/`)

**Role:** Read-only advisory stream for Guardian AI + Human Co-Pilot. Monitors liquidity, AP, contracts, travel, team plans, and Co-Pilot control state.

**Exports:** `runGuardianCoPilotAdvisoryCycle`, `buildGuardianCoPilotMonitorSnapshot`, `runAgent16GuardianCoPilotSelfTests`, UI panel type `GuardianCoPilotAdvisoryStreamPanel` (optional React — assemble from canonical if duplicated).

**State:** Advisory output is ephemeral — not persisted in `initialGameState`.

**Execution boundary:** Advisory recommendations MUST NOT call dispatch, execute hooks, or widen Co-Pilot permissions. Co-Pilot execution remains on the existing confirmation / Guardian pipeline.

**Verification gate:** All emitted warnings pass `verifyStateVerifiedWarning` before inclusion in `cycle.recommendations`.
