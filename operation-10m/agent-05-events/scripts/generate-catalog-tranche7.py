#!/usr/bin/env python3
"""Tranche 7 — compute drift settle / gap-ack gated chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche7.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

# archetype, theme, category, sector_a, sector_b, signal_gate
DRIFT_ARCHETYPES: list[tuple[str, str, str, str, str, str]] = [
    ("drift_remediation_wave", "technology", "technological", "technology", "research", "drift"),
    ("digest_resync_storm", "governance", "political", "finance", "governance", "drift"),
    ("ledger_gap_echo", "logistics", "infrastructure", "logistics", "trade", "gap"),
    ("settle_surge", "manufacturing", "economic", "manufacturing", "logistics", "settled"),
    ("turn_skew_recovery", "finance", "economic", "finance", "trade", "gap"),
    ("eligibility_rebind", "energy", "infrastructure", "energy", "renewables", "settled"),
    ("compute_footprint", "trade", "economic", "trade", "logistics", "drift"),
    ("narrative_resettle", "water", "environmental", "agriculture", "agriculture", "settled"),
]


def chain_id(region: str, archetype: str, tier: int, idx: int) -> str:
    return f"op10m_t7_{region.lower()}_{archetype}_t{tier}_{idx}"


def signal_extra(signal_gate: str) -> str:
    if signal_gate == "drift":
        return "{ k: 'compute_turn_drift' }, "
    if signal_gate == "settled":
        return "{ k: 'compute_drift_settled' }, "
    return "{ k: 'compute_turn_gap_ack' }, "


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
    min_day = 45 + tier * 4
    min_a = 22 + tier * 2
    min_b = 20 + tier * 2
    min_passes = 2 + tier // 2
    min_compute_turn = 2 + tier

    if phase == "signal":
        requires = (
            f"[{{ k: 'min_day', day: {min_day} }}, "
            f"{{ k: 'combined_sector', sectors: [{{ sector: '{sector_a}', min: {min_a} }}, {{ sector: '{sector_b}', min: {min_b} }}] }}, "
            f"{signal_extra(signal_gate)}"
            f"{{ k: 'turn_compute_digest_set' }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "pressure":
        if signal_gate == "drift":
            gate = (
                f"{{ k: 'compute_turn_drift' }}, "
                f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}, "
                f"{{ k: 'min_compute_turn', min: {min_compute_turn} }}"
            )
        elif signal_gate == "settled":
            gate = (
                f"{{ k: 'compute_drift_settled' }}, "
                f"{{ k: 'no_compute_turn_drift' }}, "
                f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}"
            )
        else:
            gate = (
                f"{{ k: 'compute_turn_gap_ack' }}, "
                f"{{ k: 'min_compute_turn', min: {min_compute_turn} }}, "
                f"{{ k: 'no_compute_turn_drift' }}"
            )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{gate}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        drift_req = "{ k: 'compute_turn_drift' }" if signal_gate == "drift" else "{ k: 'compute_turn_gap_ack' }"
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'min_deferred_queue', min: {1 + tier // 4} }}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes + 1} }}, "
            f"{drift_req}, "
            f"{{ k: 'money', min: {9000 + tier * 2500} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        settle_gate = (
            "{ k: 'compute_drift_settled' }"
            if signal_gate in ("settled", "drift")
            else "{ k: 'no_compute_turn_drift' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'recovery' }}, "
            f"{settle_gate}, "
            f"{{ k: 'min_compute_turn', min: {min_compute_turn + 1} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )

    stab = {"signal": -2, "pressure": -5, "rupture": -7, "recovery": 6}[phase]
    cost = {"signal": 700, "pressure": 1600, "rupture": 3400, "recovery": 1900}[phase]
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
            f"spawnModifier: {{ description: '{archetype} drift settle strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: -150, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {archetype} — {phase} (t{tier})',
          narrative: 'Compute drift settle {archetype}: {phase} gated by drift, gap ack, and settlement flags.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Settle compute drift',
              description: 'Align drift settlement with narrative eligibility.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold settlement',
              description: 'Defer drift settlement pass.',
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
        for archetype, theme, category, sector_a, sector_b, signal_gate in DRIFT_ARCHETYPES:
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
                        19 + tier,
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
        "// AUTO-GENERATED — scripts/generate-catalog-tranche7.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE7_STATS = {",
        "  regions: 8,",
        "  driftSettleArchetypes: 8,",
        "  tiersPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE7: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
