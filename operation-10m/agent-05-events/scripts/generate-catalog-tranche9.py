#!/usr/bin/env python3
"""Tranche 9 — post-clear stabilization / calm gated chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche9.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

# archetype, theme, category, sector_a, sector_b, signal_gate
STABILIZATION_ARCHETYPES: list[tuple[str, str, str, str, str, str]] = [
    ("calm_after_clear", "governance", "political", "governance", "finance", "calm"),
    ("stabilization_wave", "technology", "technological", "technology", "research", "stabilization"),
    ("queue_digest_harmony", "logistics", "infrastructure", "logistics", "trade", "clear"),
    ("expiry_then_calm", "manufacturing", "economic", "manufacturing", "logistics", "expired_calm"),
    ("backlog_release_echo", "finance", "economic", "finance", "trade", "no_backlog_calm"),
    ("attention_recovery", "energy", "infrastructure", "energy", "renewables", "stabilization"),
    ("narrative_equilibrium", "trade", "economic", "trade", "logistics", "calm"),
    ("deferred_calm_lattice", "water", "environmental", "agriculture", "agriculture", "clear"),
]


def chain_id(region: str, archetype: str, tier: int, idx: int) -> str:
    return f"op10m_t9_{region.lower()}_{archetype}_t{tier}_{idx}"


def signal_extra(signal_gate: str, tier: int) -> str:
    if signal_gate == "calm":
        return "{ k: 'post_queue_calm' }, "
    if signal_gate == "stabilization":
        return "{ k: 'pending_stabilization_wave' }, "
    if signal_gate == "clear":
        return "{ k: 'pending_queue_clear' }, "
    if signal_gate == "expired_calm":
        return "{ k: 'no_pending_backlog' }, { k: 'post_queue_calm' }, "
    if signal_gate == "no_backlog_calm":
        return "{ k: 'no_pending_backlog' }, { k: 'pending_stabilization_wave' }, "
    return "{ k: 'post_queue_calm' }, "


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
    min_day = 55 + tier * 4
    min_a = 26 + tier * 2
    min_b = 24 + tier * 2
    min_passes = 2 + tier // 2

    if phase == "signal":
        requires = (
            f"[{{ k: 'min_day', day: {min_day} }}, "
            f"{{ k: 'combined_sector', sectors: [{{ sector: '{sector_a}', min: {min_a} }}, {{ sector: '{sector_b}', min: {min_b} }}] }}, "
            f"{signal_extra(signal_gate, tier)}"
            f"{{ k: 'turn_compute_digest_set' }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "pressure":
        if signal_gate in ("calm", "expired_calm", "no_backlog_calm"):
            gate = "{ k: 'post_queue_calm' }, { k: 'no_pending_backlog' }"
        elif signal_gate == "stabilization":
            gate = "{ k: 'pending_stabilization_wave' }, { k: 'compute_drift_settled' }"
        elif signal_gate == "clear":
            gate = "{ k: 'pending_queue_clear' }, { k: 'pending_stabilization_wave' }"
        else:
            gate = "{ k: 'post_queue_calm' }, { k: 'pending_stabilization_wave' }"
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{gate}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        stab_gate = (
            "{ k: 'pending_stabilization_wave' }"
            if signal_gate in ("stabilization", "no_backlog_calm", "clear")
            else "{ k: 'post_queue_calm' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'min_deferred_queue', min: {1 + tier // 4} }}, "
            f"{stab_gate}, "
            f"{{ k: 'money', min: {9800 + tier * 2300} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = (
            f"[{{ k: 'chain_phase', phase: 'recovery' }}, "
            f"{{ k: 'post_queue_calm' }}, {{ k: 'pending_stabilization_wave' }}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes + 1} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )

    stab = {"signal": -1, "pressure": -4, "rupture": -6, "recovery": 7}[phase]
    cost = {"signal": 800, "pressure": 1800, "rupture": 3600, "recovery": 2100}[phase]
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
            f"spawnModifier: {{ description: '{archetype} stabilization strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: -150, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {archetype} — {phase} (t{tier})',
          narrative: 'Post-clear stabilization lattice {archetype}: {phase} gated by calm and stabilization waves.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Commit stabilization pass',
              description: 'Align queue calm with narrative recovery eligibility.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold stabilization pass',
              description: 'Defer post-clear coordination pass.',
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
        for archetype, theme, category, sector_a, sector_b, signal_gate in STABILIZATION_ARCHETYPES:
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
                        22 + tier,
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
        "// AUTO-GENERATED — scripts/generate-catalog-tranche9.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE9_STATS = {",
        "  regions: 8,",
        "  stabilizationLatticeArchetypes: 8,",
        "  tiersPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE9: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
