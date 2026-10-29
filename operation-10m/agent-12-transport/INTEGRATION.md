# Agent 12 integration contract

## Consumer (canonical game)

- **File:** `(V9.4) australia-game-with-ai.tsx`
- **Anchor sections:** V10.2 strategic infrastructure networks (`SECTION 20U`), V10.14 macro productivity (`productivityIndex`, `logisticsCostMultiplier` inputs)

## Exported entrypoints (pre-assembly)

| Symbol | Purpose |
|--------|---------|
| `computeNationalTransportProductivity` | Turn-scoped national + per-region report from catalog + operational set |
| `deriveOperationalAssetsFromProjects` | Feed active `InfrastructureProject` snapshots; boosts linked catalog assets |
| `mapReportToMacroProductivityDeltas` | Caps regional bonuses for macro layer (max +18 index points / region) |
| `getAgent12TransportCatalog` | Full baseline asset list |
| `runAgent12TransportSelfChecks` | Bundled invariant checks |

## Inputs

```typescript
interface TransportProductivityInputs {
  turn: number;
  assets: TransportAsset[];
  operationalAssetIds: ReadonlySet<string>;
  conditionByAssetId?: ReadonlyMap<string, TransportAssetCondition>;
  networkUtilization?: Partial<Record<'freight' | 'trade' | 'mobility', number>>;
  activeProjectIds?: ReadonlySet<string>;
}
```

## Outputs (measurable)

`NationalTransportProductivityReport`:

- `byRegion[code].productivityIndexBonus` — sum of asset deltas + corridor spillovers
- `byRegion[code].logisticsCostMultiplier` — compounded per asset, clamped `[0.5, 1.05]`
- `byRegion[code].freightCapacityIndex` — sum of normalized capacity indices
- `nationalProductivityIndexBonus` — sum across regions (audit metric)

## Linked canonical project types

`high_speed_rail`, `inland_rail_hub`, `freight_rail_upgrade`, `remote_logistics_base`, `automated_port`, `port_expansion`

Catalog entries may set `linkedProjectId` to receive a **1.22×** productivity multiplier when that project id is active.

## Version

`AGENT12_CATALOG_VERSION = 2026-10-29.1`
