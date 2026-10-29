# Agent 08 integration contract (Operation 10M)

## Anchor

Insert module at:

```tsx
// O6K_AGENT08_INTEGRATION_ANCHOR — Agent 08: companies / industries / production (V10.14 private sector)
```

Recommended placement: adjacent to existing V10.14 private sector block (SECTION 20AI) or replace duplicate after diff review.

## Exports (wire in game loop)

| Symbol | Use |
|--------|-----|
| `O6K_AGENT08_MODULE_VERSION` | Telemetry / save migration |
| `buildPrivateSectorInputs` | Build inputs from Living Regions, V10.1, V10.8, V10.0, V10.10 workforce |
| `computeNationalPrivateSector` | Derive national + regional private ecosystems each turn |
| `applyTaxLaborCapacityOverlay` | Optional overlay after fiscal (V10.12) + labor snapshots |
| `privateSectorWorldRoots` | World Reaction roots from derived private-sector events |
| `runAgent08ModuleSelfTests` | Lab / release self-test registry |

## Upstream authority (invariants)

1. **V10.1** — production, utilization, supply dependencies (authoritative).
2. **Living Regions** — sector weights, momentum evidence.
3. **V10.12 public finance** — tax burden / headroom (read-only into Agent 08 overlay).
4. **V10.10 workforce** — wage pressure, tightness (read-only into Agent 08 overlay).
5. Private companies never hold wallets or canonical inventory.

## Downstream

- World Reaction / Strategic Consequence reads `PrivateSectorDerivedEvent` via `privateSectorWorldRoots`.
- UI: `V1014_PRIVATE_PrivateSectorInspector` (optional dev surface).

## Agent 25 merge steps

1. Inline `v1014-private-sector-core.tsx` + `tax-labor-capacity-linkage.ts` (or merge linkage into core).
2. Remove `upstream-stubs.ts` imports; use canonical V9.4 types.
3. Register `runAgent08ModuleSelfTests` in SECTION 21B reliability suite if not already present.
4. Confirm `privateSectorInputHash` includes workforce + fiscal revision fields when overlay enabled.
