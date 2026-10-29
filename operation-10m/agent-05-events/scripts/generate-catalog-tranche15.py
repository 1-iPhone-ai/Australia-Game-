#!/usr/bin/env python3
"""Tranche 15 — inline assembly lock / agent25-slot-ready gated chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche15.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

LOCK_ARCHETYPES: list[tuple[str, str, str, str, str, str]] = [
    ("lock_after_anchor", "governance", "political", "governance", "finance", "lock"),
    ("slot_ready_wave", "technology", "technological", "technology", "research", "slot"),
    ("inline_assembly_lock", "logistics", "infrastructure", "logistics", "trade", "lock_slot"),
    ("calm_lock_harmony", "manufacturing", "economic", "manufacturing", "logistics", "anchor_lock"),
    ("queue_lock_echo", "finance", "economic", "finance", "trade", "lock_latch"),
    ("attention_lock", "energy", "infrastructure", "energy", "renewables", "slot"),
    ("narrative_lock", "trade", "economic", "trade", "logistics", "lock"),
    ("deferred_lock_lattice", "water", "environmental", "agriculture", "agriculture", "slot_latch"),
]


def chain_id(region: str, archetype: str, tier: int, idx: int) -> str:
    return f"op10m_t15_{region.lower()}_{archetype}_t{tier}_{idx}"


def signal_extra(signal_gate: str, tier: int) -> str:
    if signal_gate == "lock":
        return "{ k: 'inline_assembly_lock' }, "
    if signal_gate == "slot":
        return "{ k: 'agent25_slot_ready' }, "
    if signal_gate == "lock_slot":
        return "{ k: 'inline_assembly_lock' }, { k: 'agent25_slot_ready' }, "
    if signal_gate == "anchor_lock":
        return "{ k: 'module_manifest_anchor' }, { k: 'inline_assembly_lock' }, "
    if signal_gate == "lock_latch":
        return "{ k: 'chunk_inline_ready' }, { k: 'inline_assembly_lock' }, "
    if signal_gate == "slot_latch":
        return "{ k: 'agent25_slot_ready' }, { k: 'module_manifest_anchor' }, "
    return "{ k: 'inline_assembly_lock' }, "


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
    min_day = 85 + tier * 4
    min_a = 38 + tier * 2
    min_b = 36 + tier * 2
    min_passes = 5 + tier // 2

    if phase == "signal":
        requires = (
            f"[{{ k: 'min_day', day: {min_day} }}, "
            f"{{ k: 'combined_sector', sectors: [{{ sector: '{sector_a}', min: {min_a} }}, {{ sector: '{sector_b}', min: {min_b} }}] }}, "
            f"{signal_extra(signal_gate, tier)}"
            f"{{ k: 'turn_compute_digest_set' }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "pressure":
        if signal_gate in ("lock", "lock_latch", "anchor_lock"):
            gate = "{ k: 'inline_assembly_lock' }, { k: 'module_manifest_anchor' }"
        elif signal_gate in ("slot", "slot_latch"):
            gate = "{ k: 'agent25_slot_ready' }, { k: 'chunk_inline_ready' }"
        else:
            gate = "{ k: 'inline_assembly_lock' }, { k: 'agent25_slot_ready' }"
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{gate}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        lock_gate = (
            "{ k: 'agent25_slot_ready' }"
            if signal_gate in ("slot", "slot_latch", "lock_slot")
            else "{ k: 'inline_assembly_lock' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'min_deferred_queue', min: {1 + tier // 4} }}, "
            f"{lock_gate}, "
            f"{{ k: 'money', min: {12200 + tier * 2900} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = (
            f"[{{ k: 'chain_phase', phase: 'recovery' }}, "
            f"{{ k: 'inline_assembly_lock' }}, {{ k: 'agent25_slot_ready' }}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes + 1} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )

    stab = {"signal": -1, "pressure": -4, "rupture": -6, "recovery": 7}[phase]
    cost = {"signal": 1100, "pressure": 2400, "rupture": 4200, "recovery": 2700}[phase]
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
            f"spawnModifier: {{ description: '{archetype} inline lock strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: -210, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {archetype} — {phase} (t{tier})',
          narrative: 'Inline assembly lock lattice {archetype}: {phase} gated by assembly lock and Agent 25 slot readiness.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Commit lock pass',
              description: 'Lock inline assembly for Agent 25 post-crisis-chains slot.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold lock pass',
              description: 'Defer post-anchor inline assembly lock coordination.',
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
        for archetype, theme, category, sector_a, sector_b, signal_gate in LOCK_ARCHETYPES:
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
                        34 + tier,
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
        "// AUTO-GENERATED — scripts/generate-catalog-tranche15.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE15_STATS = {",
        "  regions: 8,",
        "  inlineAssemblyLockLatticeArchetypes: 8,",
        "  tiersPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE15: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
