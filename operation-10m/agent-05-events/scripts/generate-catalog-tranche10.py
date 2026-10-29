#!/usr/bin/env python3
"""Tranche 10 — post-stabilization closure / digest-latch gated chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche10.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

# archetype, theme, category, sector_a, sector_b, signal_gate
CLOSURE_ARCHETYPES: list[tuple[str, str, str, str, str, str]] = [
    ("closure_after_calm", "governance", "political", "governance", "finance", "closure"),
    ("digest_latch_wave", "technology", "technological", "technology", "research", "latch"),
    ("stabilization_closure", "logistics", "infrastructure", "logistics", "trade", "stab_closure"),
    ("calm_digest_harmony", "manufacturing", "economic", "manufacturing", "logistics", "calm_latch"),
    ("queue_closure_echo", "finance", "economic", "finance", "trade", "closure_latch"),
    ("attention_closure", "energy", "infrastructure", "energy", "renewables", "latch"),
    ("narrative_closure", "trade", "economic", "trade", "logistics", "closure"),
    ("deferred_closure_lattice", "water", "environmental", "agriculture", "agriculture", "stab_latch"),
]


def chain_id(region: str, archetype: str, tier: int, idx: int) -> str:
    return f"op10m_t10_{region.lower()}_{archetype}_t{tier}_{idx}"


def signal_extra(signal_gate: str, tier: int) -> str:
    if signal_gate == "closure":
        return "{ k: 'stabilization_closure_wave' }, "
    if signal_gate == "latch":
        return "{ k: 'digest_closure_latch' }, "
    if signal_gate == "stab_closure":
        return "{ k: 'pending_stabilization_wave' }, { k: 'stabilization_closure_wave' }, "
    if signal_gate == "calm_latch":
        return "{ k: 'post_queue_calm' }, { k: 'digest_closure_latch' }, "
    if signal_gate == "closure_latch":
        return "{ k: 'stabilization_closure_wave' }, { k: 'digest_closure_latch' }, "
    if signal_gate == "stab_latch":
        return "{ k: 'pending_stabilization_wave' }, { k: 'digest_closure_latch' }, "
    return "{ k: 'stabilization_closure_wave' }, "


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
    min_day = 60 + tier * 4
    min_a = 28 + tier * 2
    min_b = 26 + tier * 2
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
        if signal_gate in ("closure", "closure_latch", "stab_closure"):
            gate = "{ k: 'stabilization_closure_wave' }, { k: 'post_queue_calm' }"
        elif signal_gate in ("latch", "calm_latch", "stab_latch"):
            gate = "{ k: 'digest_closure_latch' }, { k: 'pending_stabilization_wave' }"
        else:
            gate = "{ k: 'stabilization_closure_wave' }, { k: 'digest_closure_latch' }"
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{gate}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        latch_gate = (
            "{ k: 'digest_closure_latch' }"
            if signal_gate in ("latch", "calm_latch", "stab_latch", "closure_latch")
            else "{ k: 'stabilization_closure_wave' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'min_deferred_queue', min: {1 + tier // 4} }}, "
            f"{latch_gate}, "
            f"{{ k: 'money', min: {10200 + tier * 2400} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = (
            f"[{{ k: 'chain_phase', phase: 'recovery' }}, "
            f"{{ k: 'stabilization_closure_wave' }}, {{ k: 'digest_closure_latch' }}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes + 1} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )

    stab = {"signal": -1, "pressure": -4, "rupture": -6, "recovery": 7}[phase]
    cost = {"signal": 850, "pressure": 1900, "rupture": 3700, "recovery": 2200}[phase]
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
            f"spawnModifier: {{ description: '{archetype} closure strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: -160, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {archetype} — {phase} (t{tier})',
          narrative: 'Post-stabilization closure lattice {archetype}: {phase} gated by digest latch and closure waves.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Commit closure pass',
              description: 'Latch digest closure with narrative recovery eligibility.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold closure pass',
              description: 'Defer post-stabilization closure coordination.',
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
        for archetype, theme, category, sector_a, sector_b, signal_gate in CLOSURE_ARCHETYPES:
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
                        24 + tier,
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
        "// AUTO-GENERATED — scripts/generate-catalog-tranche10.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE10_STATS = {",
        "  regions: 8,",
        "  closureLatticeArchetypes: 8,",
        "  tiersPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE10: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
