# Agent 20 — Idle / Automation / Autonomous Ops

Portable TypeScript module for Operation 10M. Covers:

- **Conditional actions** — trigger + requirement-tree gating for human automation and steward intents
- **Limits** — execution caps, safety floors, national steward spending caps
- **Logs** — ring-buffer run history and steward ledger entries
- **Safe time advance** — fail-closed gates before `end_turn` / `advance_day` while automation is in flight

National steward planning logic mirrors canonical **SECTION 20AN** (`V1014_*`) for Agent 25 inline assembly.

**Round 4** adds soak projection (`projectO10IdleAutomationSoak`), scenario replay tapes (`buildAutomationReplayTapeFromScenario`), and intent schedule coordination (`coordinateAutomationIntentSchedule`).

**Round 5** adds idle escalation tiers (`evaluateIdleAutomationEscalation`), soak↔replay attestation (`buildSoakReplayAttestationFromInput`), and intent backpressure (`scheduleWithIdleBackpressure`).

**Round 6** adds de-escalation hysteresis (`evaluateIdleEscalationWithDeescalation`), backpressure telemetry digest (`buildBackpressureTelemetryDigest`), and idle ops turn pipeline (`runIdleAutomationOpsTurn`).

**Round 7** adds multi-turn ops windows (`runIdleAutomationOpsWindow`), backpressure alert classification (`evaluateBackpressureAlerts`), and steward↔idle tier coordination (`coordinateNationalStewardWithIdleOpsTier`).

Module version: `10m.1.8.0-agent20`.

Run tests:

```bash
cd operation-10m/agent-20-automation && npm install && npm test
```
