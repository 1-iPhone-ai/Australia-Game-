#!/usr/bin/env python3
"""Tranche 4 — national escalation lattice chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche4.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

LATTICES: list[tuple[str, str, str, str, str]] = [
    ("federation_stress", "governance", "political", "finance", "finance"),
    ("capital_flight", "finance", "economic", "finance", "trade"),
    ("grid_cascade", "energy", "infrastructure", "energy", "renewables"),
    ("ports_strike", "logistics", "infrastructure", "logistics", "trade"),
    ("drought_belt", "water", "environmental", "agriculture", "agriculture"),
    ("cyber_sweep", "technology", "technological", "technology", "research"),
    ("housing_shock", "tourism", "economic", "tourism", "manufacturing"),
    ("treaty_rupture", "exploration", "political", "mining", "trade"),
]


def chain_id(region: str, lattice: str, tier: int, idx: int) -> str:
    return f"op10m_t4_{region.lower()}_{lattice}_t{tier}_{idx}"


def emit_phase(
    phase: str,
    region: str,
    lattice: str,
    sector_a: str,
    sector_b: str,
    tier: int,
    exit_flag: str,
    cooldown: int,
) -> str:
    min_day = 30 + tier * 5
    min_a = 22 + tier * 2
    min_b = 20 + tier

    if phase == "signal":
        requires = (
            f"[{{ k: 'min_day', day: {min_day} }}, "
            f"{{ k: 'combined_sector', sectors: [{{ sector: '{sector_a}', min: {min_a} }}, {{ sector: '{sector_b}', min: {min_b} }}] }}, "
            f"{{ k: 'stability', max: {65 - tier} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "pressure":
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{{ k: 'min_national_escalation', min: {1 + tier // 2} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'multi_region_contagion', minPerRegion: 1, minRegions: {2 + tier // 3} }}, "
            f"{{ k: 'min_resolved_chains', min: {1 + tier // 2} }}, "
            f"{{ k: 'money', min: {8000 + tier * 2500} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = f"[{{ k: 'chain_phase', phase: 'recovery' }}, {{ k: 'no_flag', key: '{exit_flag}' }}]"

    stab = {"signal": -3, "pressure": -5, "rupture": -7, "recovery": 5}[phase]
    cost = {"signal": 600, "pressure": 1800, "rupture": 3500, "recovery": 2000}[phase]
    nxt = {"signal": "pressure", "pressure": "rupture", "rupture": "recovery"}.get(phase)
    esc = "undefined" if not nxt else f"'{nxt}'"
    if phase == "recovery":
        resolve_fields = f"resolveChain: true, setFlags: {{ '{exit_flag}': true }}, incrementActiveCrises: -1,"
    else:
        resolve_fields = f"setFlags: {{ '{exit_flag}_{phase}': true }},"

    passive = ""
    if phase == "rupture":
        passive = (
            f"passiveTick: {{ stabilityDelta: -2, "
            f"regionalStabilityDelta: {{ '{region}': -2 }}, "
            f"incrementActiveCrises: 0 }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {lattice} — {phase} (t{tier})',
          narrative: 'National lattice {lattice}: {phase} gated by escalation tier, multi-region contagion, and resolved-chain history.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'National response',
              description: 'Coordinate federation-scale intervention.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 6},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Regional hold',
              description: 'Defer national coordination.',
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
        for lattice, theme, category, sector_a, sector_b in LATTICES:
            for tier in range(5):
                cid = chain_id(region, lattice, tier, idx)
                exit_flag = f"{cid}_resolved"
                phases = ",\n".join(
                    emit_phase(
                        p,
                        region,
                        lattice,
                        sector_a,
                        sector_b,
                        tier,
                        exit_flag,
                        18 + tier,
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
        "// AUTO-GENERATED — scripts/generate-catalog-tranche4.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE4_STATS = {",
        "  regions: 8,",
        "  latticeArchetypes: 8,",
        "  tiersPerLattice: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
