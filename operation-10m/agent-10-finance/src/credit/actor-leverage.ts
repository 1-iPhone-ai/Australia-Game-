import { finClamp, finRound } from '../compute/math.js';

/** Aggregate actor leverage signal — mirrors buildMacroFinancialInputs in V9.4. */
export function computeActorCreditStressIndex(
  player: { money?: number; loans?: Array<{ remaining?: number; amount?: number }> } | null | undefined,
  aiPlayer: { money?: number; loans?: Array<{ remaining?: number; amount?: number }> } | null | undefined,
): number {
  const sumDebt = (actor: typeof player) =>
    Number(
      actor?.loans?.reduce?.((s, l) => s + Number(l.remaining ?? l.amount ?? 0), 0) ?? 0,
    );
  const debtPlayer = sumDebt(player);
  const debtAi = sumDebt(aiPlayer);
  const cashPlayer = Number(player?.money ?? 0);
  const cashAi = Number(aiPlayer?.money ?? 0);
  const stressPlayer =
    cashPlayer > 0 ? finClamp(debtPlayer / (cashPlayer + debtPlayer + 1), 0, 1) : debtPlayer > 0 ? 1 : 0;
  const stressAi =
    cashAi > 0 ? finClamp(debtAi / (cashAi + debtAi + 1), 0, 1) : debtAi > 0 ? 1 : 0;
  return finRound((stressPlayer + stressAi) / 2, 3);
}

export function creditSpreadMultiplierFromScore(creditScore: number, min: number, max: number): number {
  return finClamp(1 + (55 - creditScore) / 90, min, max);
}

export function loanAffordabilityIndex(creditScore: number, stabilityScore: number): number {
  return finClamp(creditScore * 0.6 + stabilityScore * 0.4, 0, 100);
}
