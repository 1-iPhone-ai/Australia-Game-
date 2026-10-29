# Agent 03 → Canonical merge map (Agent 25)

## Splice order

1. **Types** — extend `EmergingCapabilityId` with four Agent 03 ids (see `snippets/types-emerging-capability-id.ts`).
2. **Capabilities** — append to `CAPABILITY_DEFINITIONS` (`snippets/capability-definitions-append.ts`).
3. **Institutions** — append to `RF_FACTION_DEFINITIONS` / Agent03 parallel registry hook (`snippets/rf-factions-append.ts`).
4. **Commercialization** — call `deriveCommercializationStage` from innovation tick after V10.5 compute (`snippets/innovation-commercialization-hook.ts`).
5. **Progression** — register unlock evaluators in content engine + GI (`snippets/content-unlocks-append.ts`).
6. **UI** — PLAY strip + LAB inspector tab (`snippets/ui-surfaces.tsx.fragment`).
7. **Self-tests** — append `runAgent03InnovationSelfTests()` to quick regression tier.

## Invariants (must not break)

- Feature flags: `innovationEnabled` + National Systems dependency unchanged.
- Never write inventory, cash, or career from Agent 03 paths.
- Productivity deltas ≤ `V105_LIMITS.effectCap` per hook.
- Capability readiness must not feed from modifiers applied same turn (use `applied` snapshot in `InnovationInputs`).

## Verification after merge

- Run in-game quick tier: `v105`, `v1011`, plus new `a03` test id.
- Confirm ic17/ic18 analogues for proposed capabilities use same modifier merge path.
