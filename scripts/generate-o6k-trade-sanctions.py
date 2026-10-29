#!/usr/bin/env python3
"""Generate substantive V1014_TRADE_DEPTH expansion modules (T6-6)."""
from __future__ import annotations

import os
from pathlib import Path

ROOT = Path("/workspace/expansion/o6k-10m/trade-sanctions")

PARTNERS = [
    ("asia_pacific", "Asia-Pacific bloc"),
    ("india_ocean", "India–Oceania corridor"),
    ("north_america", "North America"),
    ("europe", "European Union aggregate"),
    ("domestic_premium", "Domestic premium market"),
    ("china", "China"),
    ("japan", "Japan"),
    ("indonesia", "Indonesia"),
    ("south_korea", "South Korea"),
    ("united_kingdom", "United Kingdom"),
    ("singapore", "Singapore"),
    ("new_zealand", "New Zealand"),
]

COMMODITIES = [
    "iron_ore", "coal", "lng", "wheat", "beef", "aluminium", "services", "manufacturing",
    "rare_earths", "lithium_battery", "education_exports", "tourism_services",
]

DEAL_PHASES = [
    "dormant", "scoping", "negotiating", "ratifying", "active", "review", "escalating",
    "retaliating", "cooling", "suspended", "terminated",
]


def w(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def gen_bilateral_pair(idx: int, left: str, right: str, llabel: str, rlabel: str) -> None:
    sym = f"V1014_TRADE_DEPTH_BILAT_{left.upper()}_{right.upper()}"
    transitions: list[str] = []
    for pi, phase in enumerate(DEAL_PHASES):
        nxt = DEAL_PHASES[(pi + 1) % len(DEAL_PHASES)]
        transitions.append(
            f"  {{ from: '{phase}', event: 'advance_turn', to: '{nxt}', "
            f"guard: (ctx) => ctx.turn >= {pi + idx} && ctx.trustScore >= {10 + pi} }}"
        )
    trans_block = ",\n".join(transitions)

    lines: list[str] = [
        f"/** Bilateral deal state machine: {llabel} ↔ {rlabel} (T6-6 shard {idx:02d}). */",
        f"import type {{ V1014TradeDepthBilateralContext, V1014TradeDepthDealPhase }} from '../types/core';",
        f"import {{ clampTradeDepth, tradeDepthHash }} from '../engine/trade-depth-utils';",
        "",
        f"export const {sym}_PAIR_ID = '{left}__{right}' as const;",
        "",
        f"export interface {sym}State {{",
        f"  pairId: typeof {sym}_PAIR_ID;",
        f"  phase: V1014TradeDepthDealPhase;",
        f"  trustScore: number;",
        f"  tariffPressure: number;",
        f"  sanctionsIntensity: number;",
        f"  capitalControlLeakage: number;",
        f"  lastTransitionTurn: number;",
        f"  retaliationDebt: number;",
        f"  evidence: string[];",
        f"}}",
        "",
        f"export const {sym}_TRANSITIONS = [",
        trans_block,
        "] as const;",
        "",
        f"export function {sym}_initialState(turn: number): {sym}State {{",
        f"  return {{",
        f"    pairId: {sym}_PAIR_ID,",
        f"    phase: 'dormant',",
        f"    trustScore: 55 + ({idx} % 7),",
        f"    tariffPressure: 0.12 + ({idx} * 0.003),",
        f"    sanctionsIntensity: 0,",
        f"    capitalControlLeakage: 0.04,",
        f"    lastTransitionTurn: turn,",
        f"    retaliationDebt: 0,",
        f"    evidence: ['init:{left}:{right}'],",
        f"  }};",
        f"}}",
        "",
        f"export function {sym}_applyRetaliation(state: {sym}State, magnitude: number): {sym}State {{",
        f"  const m = clampTradeDepth(magnitude, 0, 1);",
        f"  return {{",
        f"    ...state,",
        f"    phase: m > 0.55 ? 'retaliating' : 'escalating',",
        f"    trustScore: clampTradeDepth(state.trustScore - m * 22, 0, 100),",
        f"    tariffPressure: clampTradeDepth(state.tariffPressure + m * 0.18, 0, 1),",
        f"    retaliationDebt: state.retaliationDebt + m * 8,",
        f"    evidence: [...state.evidence.slice(-12), `retaliation:${{m.toFixed(3)}}`],",
        f"  }};",
        f"}}",
        "",
        f"export function {sym}_tick(",
        f"  state: {sym}State,",
        f"  ctx: V1014TradeDepthBilateralContext,",
        f"): {{ state: {sym}State; events: string[] }} {{",
        f"  let next = {{ ...state }};",
        f"  const events: string[] = [];",
        f"  for (const tr of {sym}_TRANSITIONS) {{",
        f"    if (next.phase !== tr.from) continue;",
        f"    if (!tr.guard({{ ...ctx, trustScore: next.trustScore }})) continue;",
        f"    next = {{ ...next, phase: tr.to as V1014TradeDepthDealPhase, lastTransitionTurn: ctx.turn }};",
        f"    events.push(`${{tr.from}}->${{tr.to}}@${{ctx.turn}}`);",
        f"    break;",
        f"  }}",
        f"  const tradeVolume = ctx.baselineVolume * (1 - next.tariffPressure * 0.6);",
        f"  next.trustScore = clampTradeDepth(",
        f"    next.trustScore + (tradeVolume > ctx.baselineVolume * 0.7 ? 0.4 : -0.9),",
        f"    0,",
        f"    100,",
        f"  );",
        f"  if (ctx.counterpartySanctionsActive) {{",
        f"    next = {sym}_applyRetaliation(next, 0.15 + ({idx} % 5) * 0.02);",
        f"    events.push('auto_retaliation');",
        f"  }}",
        f"  next.evidence = [...next.evidence.slice(-14), tradeDepthHash({{ pair: {sym}_PAIR_ID, turn: ctx.turn, vol: tradeVolume }})];",
        f"  return {{ state: next, events }};",
        f"}}",
        "",
        f"export function {sym}_exportPressure(state: {sym}State): number {{",
        f"  return clampTradeDepth(",
        f"    state.tariffPressure * 0.5 + state.sanctionsIntensity * 0.35 + state.retaliationDebt * 0.02,",
        f"    0,",
        f"    1,",
        f"  );",
        f"}}",
    ]

    for ci, comm in enumerate(COMMODITIES[:8]):
        ccomm = comm.strip().replace(" ", "_")
        lines.extend([
            "",
            f"export function {sym}_commodityTariff_{ccomm}(state: {sym}State, baseRate: number): number {{",
            f"  const bias = ({ci + idx} % 9) * 0.004;",
            f"  const phaseMul = state.phase === 'active' ? 0.85 : state.phase === 'retaliating' ? 1.35 : 1;",
            f"  return clampTradeDepth(baseRate * phaseMul + state.tariffPressure * 0.2 + bias, 0, 0.95);",
            f"}}",
        ])

    for hi in range(10):
        lines.extend([
            "",
            f"export function {sym}_historyReducer_{hi:02d}(state: {sym}State, event: string): {sym}State {{",
            f"  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;",
            f"  return {{ ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + {hi} * 0.0001, 0, 1) }};",
            f"}}",
        ])

    w(ROOT / f"bilateral-deals/pair-{idx:02d}-{left}-{right}.ts", "\n".join(lines) + "\n")


def gen_tariff_ladder(idx: int, partner: str, plabel: str) -> None:
    sym = f"V1014_TRADE_DEPTH_TARIFF_{partner.upper()}"
    rungs: list[str] = []
    for r in range(24):
        rate = 0.02 + r * 0.015 + (idx * 0.001)
        rungs.append(
            f"  {{ rung: {r}, label: '{plabel} tier {r}', rate: {rate:.4f}, "
            f"triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > {0.15 + r * 0.02:.2f} && ctx.diplomaticTrust < {70 - r} }}"
        )
    rung_block = ",\n".join(rungs)

    content = f"""/**
 * Tariff escalation ladder for {plabel} (T6-6 ladder {idx:02d}).
 * Automatic retaliation couples to bilateral deal machines and GTEL access bands.
 */
import {{ clampTradeDepth }} from '../engine/trade-depth-utils';
import type {{ V1014TradeDepthTariffContext }} from '../types/core';

export const {sym}_PARTNER = '{partner}' as const;

export interface {sym}Rung {{
  rung: number;
  label: string;
  rate: number;
  triggerEscalationIf: (ctx: V1014TradeDepthTariffContext) => boolean;
}}

export const {sym}_LADDER: readonly {sym}Rung[] = [
{rung_block}
] as const;

export interface {sym}State {{
  partnerId: typeof {sym}_PARTNER;
  currentRung: number;
  cooldownTurns: number;
  autoRetaliationEnabled: boolean;
  history: Array<{{ turn: number; rung: number; reason: string }}>;
}}

export function {sym}_initial(): {sym}State {{
  return {{
    partnerId: {sym}_PARTNER,
    currentRung: 0,
    cooldownTurns: 0,
    autoRetaliationEnabled: true,
    history: [],
  }};
}}

export function {sym}_resolveRung(ctx: V1014TradeDepthTariffContext, state: {sym}State): {sym}State {{
  if (state.cooldownTurns > 0) {{
    return {{ ...state, cooldownTurns: state.cooldownTurns - 1 }};
  }}
  let target = state.currentRung;
  for (const rung of {sym}_LADDER) {{
    if (rung.rung <= state.currentRung) continue;
    if (rung.triggerEscalationIf(ctx)) target = rung.rung;
  }}
  if (target === state.currentRung) return state;
  return {{
    ...state,
    currentRung: target,
    cooldownTurns: 2 + (target % 3),
    history: [...state.history.slice(-40), {{ turn: ctx.turn, rung: target, reason: 'auto_escalation' }}],
  }};
}}

export function {sym}_effectiveRate(state: {sym}State): number {{
  const rung = {sym}_LADDER.find(r => r.rung === state.currentRung);
  return rung ? clampTradeDepth(rung.rate, 0, 0.95) : 0;
}}

export function {sym}_deescalate(state: {sym}State, steps: number): {sym}State {{
  return {{
    ...state,
    currentRung: Math.max(0, state.currentRung - Math.max(1, steps)),
    cooldownTurns: 3,
  }};
}}
"""
    for extra in range(30):
        content += f"""
export function {sym}_scenarioModifier_{extra:02d}(ctx: V1014TradeDepthTariffContext, state: {sym}State): number {{
  const base = {sym}_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + {extra} * 0.0007, 0, 0.95);
}}
"""
    w(ROOT / f"tariffs/ladders/ladder-{idx:02d}-{partner}.ts", content)


def gen_sanctions_package(idx: int) -> None:
    sym = f"V1014_TRADE_DEPTH_SANCTIONS_PKG_{idx:03d}"
    measures: list[str] = []
    for m in range(20):
        measures.append(
            f"    {{ id: 'measure_{idx}_{m}', kind: 'export_control', severity: {(m % 5) + 1}, "
            f"targetSectors: ['sector_{m % 7}'], complianceCost: {0.02 + m * 0.008:.3f} }}"
        )
    meas_block = ",\n".join(measures)

    content = f"""/**
 * Sanctions package {idx:03d}: composable export/financial measures with enforcement scoring.
 */
import {{ clampTradeDepth }} from '../engine/trade-depth-utils';
import type {{ V1014TradeDepthSanctionsMeasure, V1014TradeDepthSanctionsState }} from '../types/core';

export const {sym}_ID = 'sanctions_pkg_{idx:03d}' as const;

export const {sym}_MEASURES: readonly V1014TradeDepthSanctionsMeasure[] = [
{meas_block}
] as const;

export function {sym}_initial(turn: number): V1014TradeDepthSanctionsState {{
  return {{
    packageId: {sym}_ID,
    active: false,
    enforcementScore: 0,
    leakScore: 0.15,
    measuresApplied: [],
    startedTurn: turn,
    expiryTurn: null,
    waivers: [],
  }};
}}

export function {sym}_activate(state: V1014TradeDepthSanctionsState, turn: number): V1014TradeDepthSanctionsState {{
  return {{
    ...state,
    active: true,
    startedTurn: turn,
    measuresApplied: {sym}_MEASURES.map(m => m.id),
    enforcementScore: clampTradeDepth(0.35 + ({idx} % 10) * 0.04, 0, 1),
  }};
}}

export function {sym}_enforce(state: V1014TradeDepthSanctionsState, compliance: number): V1014TradeDepthSanctionsState {{
  const c = clampTradeDepth(compliance, 0, 1);
  return {{
    ...state,
    enforcementScore: clampTradeDepth(state.enforcementScore * 0.7 + c * 0.3, 0, 1),
    leakScore: clampTradeDepth(state.leakScore + (1 - c) * 0.04, 0, 1),
  }};
}}

export function {sym}_pressureOnTrade(): number {{
  return clampTradeDepth(0.08 + ({idx} % 7) * 0.015, 0, 0.75);
}}
"""
    for r in range(32):
        content += f"""
export function {sym}_retaliationRule_{r:02d}(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {{
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth({sym}_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + {r} * 0.002, 0, 1);
}}
"""
    w(ROOT / f"sanctions/packages/package-{idx:03d}.ts", content)


def gen_capital_regime(idx: int, partner: str) -> None:
    sym = f"V1014_TRADE_DEPTH_CAPITAL_{partner.upper()}_{idx:02d}"
    content = f"""/**
 * Capital controls + remittance shock regime ({partner}, shard {idx}).
 */
import {{ clampTradeDepth }} from '../engine/trade-depth-utils';
import type {{ V1014TradeDepthCapitalState, V1014TradeDepthRemittanceShock }} from '../types/core';

export const {sym}_REGIME_ID = 'capital_{partner}_{idx:02d}' as const;

export function {sym}_initial(turn: number): V1014TradeDepthCapitalState {{
  return {{
    regimeId: {sym}_REGIME_ID,
    outflowLimit: 0.65 - ({idx} * 0.008),
    remittanceCap: 0.55,
    flightRisk: 0.12,
    fxPressure: 0.08,
    lastTurn: turn,
    shocks: [],
  }};
}}

export function {sym}_applyRemittanceShock(
  state: V1014TradeDepthCapitalState,
  shock: V1014TradeDepthRemittanceShock,
): V1014TradeDepthCapitalState {{
  return {{
    ...state,
    remittanceCap: clampTradeDepth(state.remittanceCap - shock.severity * 0.15, 0.05, 1),
    flightRisk: clampTradeDepth(state.flightRisk + shock.severity * 0.2, 0, 1),
    fxPressure: clampTradeDepth(state.fxPressure + shock.severity * 0.12, 0, 1),
    shocks: [...state.shocks.slice(-20), shock],
  }};
}}
"""
    for t in range(38):
        content += f"""
export function {sym}_flightModel_{t:02d}(state: V1014TradeDepthCapitalState, tradeStress: number): number {{
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + {t} * 0.001, 0, 1);
}}
"""
    w(ROOT / f"capital-controls/regimes/regime-{idx:02d}-{partner}.ts", content)


def gen_fixture(idx: int) -> None:
    sym = f"V1014_TRADE_DEPTH_FIXTURE_{idx:03d}"
    content = f"""/**
 * Deterministic trade-war escalation fixture {idx:03d} for LAB / self-tests.
 */
import type {{ V1014TradeDepthTurnInput, V1014TradeDepthTurnResult }} from '../types/core';
import {{ runV1014TradeDepthTurn }} from '../engine/trade-depth-orchestrator';

export const {sym}_SEED = {1000 + idx};

export function {sym}_buildInput(turn: number): V1014TradeDepthTurnInput {{
  return {{
    turn,
    seed: {sym}_SEED,
    gtelAccessBand: turn % 4 === 0 ? 'restricted' : 'normal',
    diplomacyTrust: 62 - (turn % 7) * 3,
    tradeDeficitIndex: 0.18 + (turn % 5) * 0.04,
    fiscalPressureBand: turn > 8 ? 'stressed' : 'healthy',
    householdSentiment: 0.58 - turn * 0.01,
    investmentClimateScore: 54 - turn,
    counterpartySanctionsActive: turn >= 3 && turn <= 12,
    bilateralPairIds: ['asia_pacific__china', 'europe__north_america'],
    activeSanctionPackages: turn >= 5 ? ['sanctions_pkg_{idx:03d}'] : [],
    capitalRegimeIds: ['capital_asia_pacific_{idx % 6:02d}'],
  }};
}}

export function {sym}_runTurns(count: number): V1014TradeDepthTurnResult[] {{
  const out: V1014TradeDepthTurnResult[] = [];
  let persisted = null as V1014TradeDepthTurnResult['persisted'] | null;
  for (let t = 1; t <= count; t++) {{
    const input = {sym}_buildInput(t);
    const r = runV1014TradeDepthTurn({{ ...input, persisted }});
    persisted = r.persisted;
    out.push(r);
  }}
  return out;
}}

export function {sym}_expectMonotonicEscalation(): boolean {{
  const trace = {sym}_runTurns(6);
  const pressures = trace.map(r => r.state.aggregateTariffPressure);
  return pressures[pressures.length - 1] >= pressures[0];
}}
"""
    w(ROOT / f"fixtures/trade-war-fixture-{idx:03d}.ts", content)


def gen_retaliation_matrix(idx: int) -> None:
    sym = f"V1014_TRADE_DEPTH_RETALIATION_{idx:03d}"
    rules: list[str] = []
    for r in range(40):
        rules.append(
            f"  {{ id: 'rule_{idx}_{r}', threshold: {0.1 + r * 0.02:.3f}, "
            f"apply: (p) => clampTradeDepth(p + {0.02 + r * 0.003:.4f}, 0, 1) }}"
        )
    block = ",\n".join(rules)
    content = f"""/** Automatic retaliation matrix shard {idx:03d}. */
import {{ clampTradeDepth }} from '../engine/trade-depth-utils';

export const {sym}_RULES = [
{block}
] as const;

export function {sym}_evaluate(basePressure: number): number {{
  let p = basePressure;
  for (const rule of {sym}_RULES) {{
    if (p >= rule.threshold) p = rule.apply(p);
  }}
  return clampTradeDepth(p, 0, 1);
}}
"""
    for k in range(22):
        content += f"""
export function {sym}_path_{k:02d}(turn: number, trust: number): number {{
  return {sym}_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + {k} * 0.0005, 0, 1));
}}
"""
    w(ROOT / f"engine/retaliation/retaliation-matrix-{idx:03d}.ts", content)


def gen_ai_persona_shard(idx: int) -> None:
    sym = f"V1014_TRADE_DEPTH_AI_PERSONA_{idx:03d}"
    personas = ["economic", "aggressive", "cooperative", "balanced", "opportunistic"]
    content = f"""/** AI diplomatic read shard {idx:03d} — persona-specific trade interpretations. */
import {{ clampTradeDepth }} from '../engine/trade-depth-utils';
import type {{ V1014TradeDepthTurnInput }} from '../types/core';

export const {sym}_PERSONAS = {personas!r} as const;

export function {sym}_interpret(input: V1014TradeDepthTurnInput, persona: string): string {{
  const t = input.tradeDeficitIndex;
  const base = `persona=${{persona}} turn=${{input.turn}} deficit=${{t.toFixed(2)}}`;
  return base + ' ' + persona.slice(0, 3) + '_{idx}';
}}
"""
    for p in personas:
        for v in range(18):
            content += f"""
export function {sym}_{p}_score_{v:02d}(tariff: number, sanctions: number): number {{
  return clampTradeDepth(tariff * {1 + v * 0.01:.2f} + sanctions * {0.8 + v * 0.008:.3f} + {idx} * 0.001, 0, 2);
}}
"""
    w(ROOT / f"ai/personas/persona-shard-{idx:03d}.ts", content)


def main() -> None:
    pairs = []
    for i in range(len(PARTNERS) - 1):
        for j in range(i + 1, min(i + 4, len(PARTNERS))):
            pairs.append((PARTNERS[i][0], PARTNERS[j][0], PARTNERS[i][1], PARTNERS[j][1]))
    seen = set()
    unique_pairs = []
    for p in pairs:
        if p[0] + p[1] in seen:
            continue
        seen.add(p[0] + p[1])
        unique_pairs.append(p)
    for idx, (l, r, ll, rl) in enumerate(unique_pairs[:26], start=1):
        gen_bilateral_pair(idx, l, r, ll, rl)

    for idx, (pid, plabel) in enumerate(PARTNERS[:11], start=1):
        gen_tariff_ladder(idx, pid, plabel)

    for idx in range(1, 14):
        gen_sanctions_package(idx)

    for idx in range(1, 13):
        gen_capital_regime(idx, PARTNERS[idx % len(PARTNERS)][0])

    for idx in range(1, 22):
        gen_fixture(idx)

    for idx in range(1, 8):
        gen_retaliation_matrix(idx)

    for idx in range(1, 6):
        gen_ai_persona_shard(idx)

    print("Generated modules under", ROOT)


if __name__ == "__main__":
    main()
