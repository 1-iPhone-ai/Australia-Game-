# SECTION 20AZ — Public services v2 crosswalk (T6-5)

Expansion shard for **Operation O6K-10M** / Tranche 6 **T6-5**. Agent 25 inlines this tree **immediately before** `// SECTION 21B` in `(V9.4) australia-game-with-ai.tsx`. **Do not** edit the canonical mega-file from this branch.

## Anchor and upstream sections

| Section | Role |
|---------|------|
| **20AP** | V10.14 public service KPI baseline (housing / health / education outcomes) |
| **20AC** | Workforce, skills, human capital supply |
| **20AJ** | Labor market, demographics, migration flow bands |
| **20AF** | Household living standards and domestic demand stress |
| **20AZ** (this shard) | Second pass: **service delivery queues**, **skill mismatch**, **migration feedback loops** |

## Namespacing

- Symbol prefix: **`V1014_PUBSVC_*`**
- LAB suite id: **`v1014_public_services_v2`**
- Self-test entry: **`runV1014PublicServicesV2SelfTests()`**
- Primary tick: **`V1014_PUBSVC_computePublicServicesCrosswalk`**

## §6 persistence — regional aggregates

Persist under:

```text
save.meta.v1014.public_services_v2
```

Blob encoder: **`V1014_PUBSVC_encodeSection6Blob`** / decoder **`V1014_PUBSVC_decodeSection6Blob`**.

Each turn rolls **`V1014PubsSvcRegionalAggregate`** for all eight core regions (queue pressure, skill mismatch, migration loop, composite KPI, per-pillar wait bands). History tail depth: **`V1014_PUBSVC_LIMITS.section6HistoryDepth`** (8 turns).

Migration from prior HEAD: **`V1014_PUBSVC_migrateSection6Persisted`**.

## Turn pipeline hook (post–T6-4, pre–21B)

1. Build read-only adapters from live **`publicServicesState`**, **`workforceState`**, **`laborMarketState`**, **`householdState`** (20AP / 20AC / 20AJ / 20AF).
2. Call **`V1014_PUBSVC_computePublicServicesCrosswalk(inputs, save.meta.v1014.public_services_v2)`**.
3. Write **`persisted`** back to §6; expose **`snapshot`** on derived national state for dashboards / Guardian (warn-only).
4. Feed workforce pipeline hints to **20T** industry staffing adapters (read-only indices).

## LAB registration (§21B)

```typescript
{
  id: 'v1014_public_services_v2',
  label: 'V10.14 Public services crosswalk v2 (20AZ)',
  tier: 'quick',
  section: 'System Regression',
  severity: 'MAJOR',
  run: () =>
    runV1014PublicServicesV2SelfTests().results.map((r) => ({
      id: r.id,
      name: r.name,
      passed: r.passed,
      detail: r.detail,
    })),
}
```

## Build and verify

```bash
node expansion/o6k-10m/public-services/scripts/generate.mjs
npx --yes tsx expansion/o6k-10m/public-services/run-lab.ts
find expansion/o6k-10m/public-services -name '*.ts' | xargs wc -l
```

Expect **≥45** KPI regressions, **`failed: 0`**, physical TS LOC **~20,000–26,000** (excluding generator script).

## Merge owner

Agent 25 — single anchor PR **`cursor/o6k-10m-public-services`** onto **`australia-game-upgrade`**. Rebase after **20AP** / **20AJ** tail changes.
