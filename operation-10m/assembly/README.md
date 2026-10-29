# Assembly pipeline (Agent 25)

Deterministic merge of worker modules into `(V9.4) australia-game-with-ai.tsx`.

| Script | Role |
|--------|------|
| `assemble.mjs` | Splice manifest modules at section anchors |
| `lib/anchors.mjs` | Section map + manifest hash validation |
| `audit-duplication.mjs` | Export / block duplication baseline |
| `audit-save-migrations.mjs` | Save migrator surface checks |
| `benchmark-scale.mjs` | Read/hash/scan timings |

Run full baseline gate:

```bash
node operation-10m/assembly/validate-manifest.mjs
node operation-10m/assembly/audit-duplication.mjs --write-audit operation-10m/assembly/audits/duplication-baseline.json
node operation-10m/assembly/audit-save-migrations.mjs --write-audit operation-10m/assembly/audits/save-baseline.json
node operation-10m/assembly/benchmark-scale.mjs --write-audit operation-10m/assembly/audits/scale-baseline.json
node scripts/measure-loc.mjs --write-audit operation-10m/assembly/audits/loc-baseline.json
node operation-10m/assembly/assemble.mjs --dry-run
node operation-10m/assembly/sync-manifest.mjs --remote-op10m
node operation-10m/assembly/tranche-dry-run.mjs --tranche operation-10m/assembly/tranches/tranche-01-op10m-registry.json
```

Only Agent 25 promotes `--out` assembly to canonical on `op10m/agent-25-integration`.
