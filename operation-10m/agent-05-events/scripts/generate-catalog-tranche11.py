#!/usr/bin/env python3
"""Tranche 11 — integration sync gate / closure-seal gated chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche11.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

# archetype, theme, category, sector_a, sector_b, signal_gate
SYNC_ARCHETYPES: list[tuple[str, str, str, str, str, str]] = [
    ("sync_after_closure", "governance", "political", "governance", "finance", "sync_gate"),
    ("seal_ready_wave", "technology", "technological", "technology", "research", "seal_ready"),
    ("integration_closure", "logistics", "infrastructure", "logistics", "trade", "sync_seal"),
    ("calm_sync_harmony", "manufacturing", "economic", "manufacturing", "logistics", "gate_seal"),
    ("queue_sync_echo", "finance", "economic", "finance", "trade", "sync_latch"),
    ("attention_sync", "energy", "infrastructure", "energy", "renewables", "seal_ready"),
    ("narrative_sync", "trade", "economic", "trade", "logistics", "sync_gate"),
    ("deferred_sync_lattice", "water", "environmental", "agriculture", "agriculture", "gate_latch"),
]


def chain_id(region: str, archetype: str, tier: int, idx: int) -> str:
    return f"op10m_t11_{region.lower()}_{archetype}_t{tier}_{idx}"


def signal_extra(signal_gate: str, tier: int) -> str:
    if signal_gate == "sync_gate":
        return "{ k: 'integration_sync_gate' }, "
    if signal_gate == "seal_ready":
        return "{ k: 'closure_seal_ready' }, "
    if signal_gate == "sync_seal":
        return "{ k: 'integration_sync_gate' }, { k: 'closure_seal_ready' }, "
    if signal_gate == "gate_seal":
        return "{ k: 'stabilization_closure_wave' }, { k: 'integration_sync_gate' }, "
    if signal_gate == "sync_latch":
        return "{ k: 'digest_closure_latch' }, { k: 'integration_sync_gate' }, "
    if signal_gate == "gate_latch":
        return "{ k: 'closure_seal_ready' }, { k: 'compute_drift_settled' }, "
    return "{ k: 'integration_sync_gate' }, "


def emit_phase(
    phase: str,
    region: str,
    archetype: str,
    sector_a: str,
    sector_b: str,
    tier: int,
    exit_flag: str,
    cooldown: int,
    signal_gate: str,
) -> str:
    min_day = 65 + tier * 4
    min_a = 30 + tier * 2
    min_b = 28 + tier * 2
    min_passes = 3 + tier // 2

    if phase == "signal":
        requires = (
            f"[{{ k: 'min_day', day: {min_day} }}, "
            f"{{ k: 'combined_sector', sectors: [{{ sector: '{sector_a}', min: {min_a} }}, {{ sector: '{sector_b}', min: {min_b} }}] }}, "
            f"{signal_extra(signal_gate, tier)}"
            f"{{ k: 'turn_compute_digest_set' }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "pressure":
        if signal_gate in ("sync_gate", "sync_latch", "gate_seal"):
            gate = "{ k: 'integration_sync_gate' }, { k: 'digest_closure_latch' }"
        elif signal_gate in ("seal_ready", "gate_latch"):
            gate = "{ k: 'closure_seal_ready' }, { k: 'compute_drift_settled' }"
        else:
            gate = "{ k: 'integration_sync_gate' }, { k: 'closure_seal_ready' }"
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{gate}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        sync_gate = (
            "{ k: 'closure_seal_ready' }"
            if signal_gate in ("seal_ready", "gate_latch", "sync_seal")
            else "{ k: 'integration_sync_gate' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'min_deferred_queue', min: {1 + tier // 4} }}, "
            f"{sync_gate}, "
            f"{{ k: 'money', min: {10600 + tier * 2500} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = (
            f"[{{ k: 'chain_phase', phase: 'recovery' }}, "
            f"{{ k: 'integration_sync_gate' }}, {{ k: 'closure_seal_ready' }}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes + 1} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )

    stab = {"signal": -1, "pressure": -4, "rupture": -6, "recovery": 7}[phase]
    cost = {"signal": 900, "pressure": 2000, "rupture": 3800, "recovery": 2300}[phase]
    nxt = {"signal": "pressure", "pressure": "rupture", "rupture": "recovery"}.get(phase)
    esc = "undefined" if not nxt else f"'{nxt}'"
    if phase == "recovery":
        resolve_fields = f"resolveChain: true, setFlags: {{ '{exit_flag}': true }}, incrementActiveCrises: -1,"
    else:
        resolve_fields = f"setFlags: {{ '{exit_flag}_{phase}': true }},"

    passive = ""
    if phase == "pressure":
        passive = (
            f"passiveTick: {{ stabilityDelta: -1, "
            f"spawnModifier: {{ description: '{archetype} integration sync strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: -170, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {archetype} — {phase} (t{tier})',
          narrative: 'Integration sync lattice {archetype}: {phase} gated by sync gate and closure seal.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Commit sync pass',
              description: 'Align integration sync gate with Agent 25 assembly eligibility.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold sync pass',
              description: 'Defer post-closure integration sync coordination.',
              costMoney: 0,
              onSelect: {{ stabilityDelta: {stab - 2}, incrementActiveCrises: {1 if phase != 'signal' else 0} }},
            }},
          ],
        }}"""
    ).strip()


def main() -> None:
    entries: list[str] = []
    idx = 0
    for region in REGIONS:
        for archetype, theme, category, sector_a, sector_b, signal_gate in SYNC_ARCHETYPES:
            for tier in range(5):
                cid = chain_id(region, archetype, tier, idx)
                exit_flag = f"{cid}_resolved"
                phases = ",\n".join(
                    emit_phase(
                        p,
                        region,
                        archetype,
                        sector_a,
                        sector_b,
                        tier,
                        exit_flag,
                        26 + tier,
                        signal_gate,
                    )
                    for p in ("signal", "pressure", "rupture", "recovery")
                )
                block = textwrap.dedent(
                    f"""
                    {{
                      chainId: '{cid}',
                      region: '{region}',
                      theme: '{theme}',
                      category: '{category}',
                      entryFlag: '{cid}_entered',
                      exitFlag: '{exit_flag}',
                      phases: [
                    {phases}
                      ],
                    }}"""
                ).strip()
                entries.append(block)
                idx += 1

    lines = [
        "// AUTO-GENERATED — scripts/generate-catalog-tranche11.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE11_STATS = {",
        "  regions: 8,",
        "  integrationSyncLatticeArchetypes: 8,",
        "  tiersPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE11: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
