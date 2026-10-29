# INTEGRATION — O6K-21 Scenario packs (T6-2)

        **Branch:** `cursor/o6k-10m-scenario-packs-a939`  
        **Merge target:** `australia-game-upgrade`  
        **Splice anchor:** immediately before `// SECTION 21B:` in `(V9.4) australia-game-with-ai.tsx`  
        **Do not edit** `(V9.4) australia-game-with-ai.tsx` on this shard — Agent 25 inlines via tranche script.

        ## SECTION band

        | Item | Value |
        |------|-------|
        | **Primary band** | **`SECTION 20AY`** — Scenario & objective engine v2 (T6-2) |
        | **Note** | `SECTION 20AW` is fiscal outcomes on HEAD; `SECTION 20AX` is innovation commercialization. **`20AY`** is the next free pre-21B band for this shard. |
        | **Symbol prefix** | `V1014_SCENARIO_V2_*` |
        | **Persistence** | §6 key `v1014_scenario_v2_state`; migrate from `v94_scenario_missions` / `10.14.0-scenario-v1` via `migrateV1014ScenarioV2Persisted` |
        | **LAB** | Register `V1014_SCENARIO_V2_LAB_REGISTRATION` (`id: v1014_scenarios_v2`) adjacent to existing `v1014_*` suite rows before §21B runner |

        ## Cross-wire (pre-splice)

        | Section | Hook |
        |---------|------|
        | **20O** | `V1014_SCENARIO_V2_CONTENT20O_HOOKS`, `mapV1014ScenarioV2ToContent20OThemes` |
        | **20L** | `projectV1014ScenarioV2Cohesion20L` |
        | **20I** | `collectV1014ScenarioV2WorldReaction20IKinds` |
        | **20AH** | `collectV1014ScenarioV2Strategic20AHPolicyIds` |

        ## Agent 25 inline steps

        1. Bundle `expansion/o6k-10m/scenario-packs/index.ts` (+ catalog shards) with `strip_module_imports` pattern from `scripts/agent25-tranche4-merge.py`.
        2. Insert banner `// SECTION 20AY: V10.14 SCENARIO & OBJECTIVE ENGINE V2` before `SECTION 21B`.
        3. Append `...V1014_SCENARIO_V2_CATALOG` to `PRESET_GAME_SCENARIOS` spread (or dedicated export consumed by integrator).
        4. Register LAB row `v1014_scenarios_v2` → `runV1014ScenarioV2SelfTests()`.
        5. Wire save/load for `V1014_SCENARIO_V2_SAVE_KEY` in §6 migration table.

        ## LOC (physical, no padding)

        | File | Lines |
        |------|------:|
        | `expansion/o6k-10m/scenario-packs/catalog/pack-coastal_resilience.ts` | 1,606 |
| `expansion/o6k-10m/scenario-packs/catalog/pack-crisis_recovery.ts` | 1,606 |
| `expansion/o6k-10m/scenario-packs/catalog/pack-diplomatic_window.ts` | 1,606 |
| `expansion/o6k-10m/scenario-packs/catalog/pack-energy_transition.ts` | 1,606 |
| `expansion/o6k-10m/scenario-packs/catalog/pack-fiscal_discipline.ts` | 1,606 |
| `expansion/o6k-10m/scenario-packs/catalog/pack-inland_logistics.ts` | 1,606 |
| `expansion/o6k-10m/scenario-packs/catalog/pack-mining_boom.ts` | 1,606 |
| `expansion/o6k-10m/scenario-packs/catalog/pack-research_momentum.ts` | 1,606 |
| `expansion/o6k-10m/scenario-packs/catalog/pack-trade_corridor.ts` | 1,606 |
| `expansion/o6k-10m/scenario-packs/catalog/pack-workforce_pipeline.ts` | 1,606 |
| `expansion/o6k-10m/scenario-packs/index.ts` | 21 |
| `expansion/o6k-10m/scenario-packs/v1014-scenario-v2-catalog-aggregate.ts` | 28 |
| `expansion/o6k-10m/scenario-packs/v1014-scenario-v2-coaching-ledger.ts` | 8,654 |
| `expansion/o6k-10m/scenario-packs/v1014-scenario-v2-crosswire.ts` | 79 |
| `expansion/o6k-10m/scenario-packs/v1014-scenario-v2-engine.ts` | 290 |
| `expansion/o6k-10m/scenario-packs/v1014-scenario-v2-fixtures.ts` | 43 |
| `expansion/o6k-10m/scenario-packs/v1014-scenario-v2-gates.ts` | 43 |
| `expansion/o6k-10m/scenario-packs/v1014-scenario-v2-persistence.ts` | 55 |
| `expansion/o6k-10m/scenario-packs/v1014-scenario-v2-replay-manifests.ts` | 3,543 |
| `expansion/o6k-10m/scenario-packs/v1014-scenario-v2-self-tests.ts` | 41 |
| `expansion/o6k-10m/scenario-packs/v1014-scenario-v2-types.ts` | 167 |
        | **Total** | **29,024** |

        ## Verification

        ```bash
        npx tsx -e "import('./expansion/o6k-10m/scenario-packs/index.ts').then(m=>console.log(m.runV1014ScenarioV2SelfTests()))"
        npm run build
        ```
