# T6-3 — Historical replay & counterfactual analytics (V1014_REPLAY_*)

## Splice anchor

Insert generated bundle **immediately before**:

```text
// SECTION 21B
```

(Current remote HEAD: ~line 319482 in `(V9.4) australia-game-with-ai.tsx`.)

## Section band

**`SECTION 20AY`** — Agent 24 / #287 depth pass (T6-3).

> `SECTION 20AX` is occupied on `australia-game-upgrade` by Agent 03 commercialization. Do not duplicate.

## Symbol prefix

All exports use **`V1014_REPLAY_*`** (types, engines, adapters, persistence helpers, self-tests).

## LAB suite

Register in Developer LAB quick tier:

| Field | Value |
|-------|-------|
| Suite id | `o6k_agent24_v2` |
| Runner | `runV1014ReplayCounterfactualSelfTests()` |
| Formatter | `formatV1014ReplaySelfTestReport()` |

## §6 persistence keys (`save.meta.v1014`)

| Key path | Purpose |
|----------|---------|
| `save.meta.v1014.replay_counterfactual.schemaVersion` | Migration spine |
| `save.meta.v1014.replay_counterfactual.archiveRing` | Turn snapshot ring (max 48) |
| `save.meta.v1014.replay_counterfactual.activeBranch` | Active counterfactual branch (non-authoritative) |
| `save.meta.v1014.replay_counterfactual.lastDiffReportId` | Last turn diff report id |
| `save.meta.v1014.replay_counterfactual.section6SlotBindings` | Maps §6 slot id → snapshot header id |
| `save.meta.v1014.replay_counterfactual.scrubberIndex` | Timeline scrubber cursor |
| `save.meta.v1014.replay_counterfactual.forecastOverlay` | 20M / 20AQ non-authoritative overlay blob |
| `save.meta.v1014.replay_counterfactual.dashboardTiles` | O6K-A23 tile cache |

## Cross-wires (T6-3)

| Partner | Hook |
|---------|------|
| **§6** replay / save slots | `V1014_REPLAY_bindSection6ReplaySlot`, `V1014_REPLAY_SECTION6_SLOT_IDS` |
| **20M** forecast / diagnostics | `V1014_REPLAY_buildForecastLabOverlay` → `section20M.diagnosticsOnly` |
| **20AQ** policy lab | same overlay → `section20AQ.policyLabOverlay` |
| **O6K-A23** dashboards | `V1014_REPLAY_buildO6kA23DashboardTiles` |
| **Replay branch tree** | `V1014_REPLAY_createBranchIsolationEnvelope` + `replayBranchTree` node ids |

## Turn pipeline hook (proposed)

After day boundary checkpoint (post §11A), Agent 25 should:

1. `V1014_REPLAY_encodeSnapshot` from live state + branch node id
2. Push into persistence slice via `V1014_REPLAY_patchPersistenceSlice`
3. When user opens what-if: `V1014_REPLAY_createBranchIsolationEnvelope` (never write sandbox → live)

## Self-test case names (≥40)

- `archive_roundtrip_empty_metrics`
- `archive_roundtrip_multi_domain`
- `snapshot_header_deterministic`
- `snapshot_encoder_ring_push`
- `snapshot_decoder_invalid_blob`
- `diff_identical_snapshots_zero_ops`
- `diff_scalar_delta_detection`
- `diff_branch_isolation_flag`
- `branch_envelope_live_untouch`
- `branch_materialize_unknown_preset`
- `branch_materialize_valid_preset`
- `section6_bind_quick_save`
- `section6_bind_counterfactual_sandbox`
- `section6_slot_binding_keys`
- `persistence_read_missing_slice`
- `persistence_patch_roundtrip`
- `migration_step_chain_01`
- `migration_step_chain_40`
- `forecast_overlay_non_authoritative`
- `forecast_overlay_links_20aq`
- `dashboard_tiles_empty_snapshot`
- `dashboard_tiles_with_diff`
- `scrubber_selects_latest_turn`
- `scrubber_before_first_turn`
- `stable_stringify_key_order`
- `fnv1a32_known_vector`
- `fingerprint_excludes_timestamp`
- `catalog_archive_slice_lookup`
- `catalog_diff_rule_lookup`
- `catalog_counterfactual_preset_lookup`
- `counterfactual_authoritative_false`
- `encoder_skips_sparse_regions`
- `diff_report_fingerprint_stable`
- `isolation_rng_stream_count`
- `section6_keys_forecast_overlay`
- `section6_keys_dashboard_tiles`
- `replay_schema_version_constant`
- `archive_catalog_minimum_size`
- `diff_rule_catalog_minimum_size`
- `counterfactual_preset_minimum_size`
- `determinism_double_encode`
- `double_branch_envelope_ids`
- `overlay_paths_present_on_preset`
- `live_corruption_guard_message`
- `net_scalar_delta_aggregation`
- `decode_reencode_snapshot`

## Regenerate

```bash
cd expansion/o6k-10m/replay-counterfactual && python3 generate-replay-counterfactual.py
```
