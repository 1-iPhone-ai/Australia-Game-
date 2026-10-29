#!/usr/bin/env python3
"""Tranche 14 — module manifest anchor / chunk-inline-ready gated chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche14.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

ANCHOR_ARCHETYPES: list[tuple[str, str, str, str, str, str]] = [
    ("anchor_after_seal", "governance", "political", "governance", "finance", "anchor"),
    ("inline_ready_wave", "technology", "technological", "technology", "research", "inline"),
    ("manifest_anchor", "logistics", "infrastructure", "logistics", "trade", "anchor_inline"),
    ("calm_anchor_harmony", "manufacturing", "economic", "manufacturing", "logistics", "seal_anchor"),
    ("queue_anchor_echo", "finance", "economic", "finance", "trade", "anchor_latch"),
    ("attention_anchor", "energy", "infrastructure", "energy", "renewables", "inline"),
    ("narrative_anchor", "trade", "economic", "trade", "logistics", "anchor"),
    ("deferred_anchor_lattice", "water", "environmental", "agriculture", "agriculture", "inline_latch"),
]


def chain_id(region: str, archetype: str, tier: int, idx: int) -> str:
    return f"op10m_t14_{region.lower()}_{archetype}_t{tier}_{idx}"


def signal_extra(signal_gate: str, tier: int) -> str:
    if signal_gate == "anchor":
        return "{ k: 'module_manifest_anchor' }, "
    if signal_gate == "inline":
        return "{ k: 'chunk_inline_ready' }, "
    if signal_gate == "anchor_inline":
        return "{ k: 'module_manifest_anchor' }, { k: 'chunk_inline_ready' }, "
    if signal_gate == "seal_anchor":
        return "{ k: 'chunk_assembly_seal' }, { k: 'module_manifest_anchor' }, "
    if signal_gate == "anchor_latch":
        return "{ k: 'handoff_manifest_commit' }, { k: 'module_manifest_anchor' }, "
    if signal_gate == "inline_latch":
        return "{ k: 'chunk_inline_ready' }, { k: 'handoff_manifest_commit' }, "
    return "{ k: 'module_manifest_anchor' }, "


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
    min_day = 80 + tier * 4
    min_a = 36 + tier * 2
    min_b = 34 + tier * 2
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
        if signal_gate in ("anchor", "anchor_latch", "seal_anchor"):
            gate = "{ k: 'module_manifest_anchor' }, { k: 'chunk_assembly_seal' }"
        elif signal_gate in ("inline", "inline_latch"):
            gate = "{ k: 'chunk_inline_ready' }, { k: 'handoff_manifest_commit' }"
        else:
            gate = "{ k: 'module_manifest_anchor' }, { k: 'chunk_inline_ready' }"
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{gate}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        anchor_gate = (
            "{ k: 'chunk_inline_ready' }"
            if signal_gate in ("inline", "inline_latch", "anchor_inline")
            else "{ k: 'module_manifest_anchor' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'min_deferred_queue', min: {1 + tier // 4} }}, "
            f"{anchor_gate}, "
            f"{{ k: 'money', min: {11800 + tier * 2800} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = (
            f"[{{ k: 'chain_phase', phase: 'recovery' }}, "
            f"{{ k: 'module_manifest_anchor' }}, {{ k: 'chunk_inline_ready' }}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes + 1} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )

    stab = {"signal": -1, "pressure": -4, "rupture": -6, "recovery": 7}[phase]
    cost = {"signal": 1050, "pressure": 2300, "rupture": 4100, "recovery": 2600}[phase]
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
            f"spawnModifier: {{ description: '{archetype} manifest anchor strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: -200, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {archetype} — {phase} (t{tier})',
          narrative: 'Module manifest anchor lattice {archetype}: {phase} gated by anchor and inline readiness.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Commit anchor pass',
              description: 'Anchor module manifest for Agent 25 inline chunk readiness.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold anchor pass',
              description: 'Defer post-seal module manifest anchor coordination.',
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
        for archetype, theme, category, sector_a, sector_b, signal_gate in ANCHOR_ARCHETYPES:
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
                        32 + tier,
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
        "// AUTO-GENERATED — scripts/generate-catalog-tranche14.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE14_STATS = {",
        "  regions: 8,",
        "  moduleManifestAnchorLatticeArchetypes: 8,",
        "  tiersPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE14: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
