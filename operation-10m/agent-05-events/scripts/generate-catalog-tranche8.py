#!/usr/bin/env python3
"""Tranche 8 — pending backlog / expiry / arbitration gated chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche8.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

# archetype, theme, category, sector_a, sector_b, signal_gate
PENDING_ARCHETYPES: list[tuple[str, str, str, str, str, str]] = [
    ("backlog_surge_wave", "governance", "political", "finance", "governance", "backlog"),
    ("arbitration_storm", "technology", "technological", "technology", "research", "arbitration"),
    ("dilemma_depth_echo", "logistics", "infrastructure", "logistics", "trade", "queue"),
    ("expiry_cascade", "manufacturing", "economic", "manufacturing", "logistics", "expiry"),
    ("queue_clearance", "finance", "economic", "finance", "trade", "cleared"),
    ("attention_tax_relief", "energy", "infrastructure", "energy", "renewables", "no_backlog"),
    ("response_lattice", "trade", "economic", "trade", "logistics", "backlog"),
    ("narrative_deferral", "water", "environmental", "agriculture", "agriculture", "expiry"),
]


def chain_id(region: str, archetype: str, tier: int, idx: int) -> str:
    return f"op10m_t8_{region.lower()}_{archetype}_t{tier}_{idx}"


def signal_extra(signal_gate: str, tier: int) -> str:
    if signal_gate == "backlog":
        return "{ k: 'pending_backlog' }, "
    if signal_gate == "arbitration":
        return "{ k: 'pending_arbitration' }, "
    if signal_gate == "queue":
        return f"{{ k: 'min_pending_responses', min: {3 + tier // 2} }}, "
    if signal_gate == "expiry":
        return "{ k: 'pending_expiry_wave' }, "
    if signal_gate == "cleared":
        return "{ k: 'pending_queue_clear' }, "
    return "{ k: 'no_pending_backlog' }, "


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
    min_day = 50 + tier * 4
    min_a = 24 + tier * 2
    min_b = 22 + tier * 2
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
        if signal_gate == "backlog":
            gate = "{ k: 'pending_backlog' }, { k: 'min_pending_responses', min: 4 }"
        elif signal_gate == "arbitration":
            gate = "{ k: 'pending_arbitration' }, { k: 'min_pending_responses', min: 3 }"
        elif signal_gate == "queue":
            gate = f"{{ k: 'min_pending_responses', min: {4 + tier // 2} }}, {{ k: 'pending_backlog' }}"
        elif signal_gate == "expiry":
            gate = "{ k: 'pending_expiry_wave' }, { k: 'no_pending_backlog' }"
        elif signal_gate == "cleared":
            gate = "{ k: 'pending_queue_clear' }, { k: 'no_pending_backlog' }"
        else:
            gate = "{ k: 'no_pending_backlog' }, { k: 'compute_drift_settled' }"
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{gate}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        backlog_req = (
            "{ k: 'pending_backlog' }"
            if signal_gate in ("backlog", "queue", "arbitration")
            else "{ k: 'pending_expiry_wave' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'min_deferred_queue', min: {1 + tier // 4} }}, "
            f"{backlog_req}, "
            f"{{ k: 'money', min: {9500 + tier * 2400} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        clear_gate = (
            "{ k: 'pending_queue_clear' }"
            if signal_gate in ("cleared", "expiry", "no_backlog")
            else "{ k: 'no_pending_backlog' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'recovery' }}, "
            f"{clear_gate}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes + 1} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )

    stab = {"signal": -2, "pressure": -5, "rupture": -7, "recovery": 6}[phase]
    cost = {"signal": 750, "pressure": 1700, "rupture": 3500, "recovery": 2000}[phase]
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
            f"spawnModifier: {{ description: '{archetype} pending strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: -175, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {archetype} — {phase} (t{tier})',
          narrative: 'Pending response lattice {archetype}: {phase} gated by backlog, expiry, and arbitration flags.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Resolve pending lattice',
              description: 'Align dilemma backlog with narrative eligibility.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold pending pass',
              description: 'Defer pending coordination pass.',
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
        for archetype, theme, category, sector_a, sector_b, signal_gate in PENDING_ARCHETYPES:
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
                        20 + tier,
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
        "// AUTO-GENERATED — scripts/generate-catalog-tranche8.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE8_STATS = {",
        "  regions: 8,",
        "  pendingLatticeArchetypes: 8,",
        "  tiersPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE8: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
