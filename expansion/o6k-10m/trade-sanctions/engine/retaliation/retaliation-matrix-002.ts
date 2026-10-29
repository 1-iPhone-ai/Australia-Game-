/** Automatic retaliation matrix shard 002. */
import { clampTradeDepth } from '../engine/trade-depth-utils';

export const V1014_TRADE_DEPTH_RETALIATION_002_RULES = [
  { id: 'rule_2_0', threshold: 0.100, apply: (p) => clampTradeDepth(p + 0.0200, 0, 1) },
  { id: 'rule_2_1', threshold: 0.120, apply: (p) => clampTradeDepth(p + 0.0230, 0, 1) },
  { id: 'rule_2_2', threshold: 0.140, apply: (p) => clampTradeDepth(p + 0.0260, 0, 1) },
  { id: 'rule_2_3', threshold: 0.160, apply: (p) => clampTradeDepth(p + 0.0290, 0, 1) },
  { id: 'rule_2_4', threshold: 0.180, apply: (p) => clampTradeDepth(p + 0.0320, 0, 1) },
  { id: 'rule_2_5', threshold: 0.200, apply: (p) => clampTradeDepth(p + 0.0350, 0, 1) },
  { id: 'rule_2_6', threshold: 0.220, apply: (p) => clampTradeDepth(p + 0.0380, 0, 1) },
  { id: 'rule_2_7', threshold: 0.240, apply: (p) => clampTradeDepth(p + 0.0410, 0, 1) },
  { id: 'rule_2_8', threshold: 0.260, apply: (p) => clampTradeDepth(p + 0.0440, 0, 1) },
  { id: 'rule_2_9', threshold: 0.280, apply: (p) => clampTradeDepth(p + 0.0470, 0, 1) },
  { id: 'rule_2_10', threshold: 0.300, apply: (p) => clampTradeDepth(p + 0.0500, 0, 1) },
  { id: 'rule_2_11', threshold: 0.320, apply: (p) => clampTradeDepth(p + 0.0530, 0, 1) },
  { id: 'rule_2_12', threshold: 0.340, apply: (p) => clampTradeDepth(p + 0.0560, 0, 1) },
  { id: 'rule_2_13', threshold: 0.360, apply: (p) => clampTradeDepth(p + 0.0590, 0, 1) },
  { id: 'rule_2_14', threshold: 0.380, apply: (p) => clampTradeDepth(p + 0.0620, 0, 1) },
  { id: 'rule_2_15', threshold: 0.400, apply: (p) => clampTradeDepth(p + 0.0650, 0, 1) },
  { id: 'rule_2_16', threshold: 0.420, apply: (p) => clampTradeDepth(p + 0.0680, 0, 1) },
  { id: 'rule_2_17', threshold: 0.440, apply: (p) => clampTradeDepth(p + 0.0710, 0, 1) },
  { id: 'rule_2_18', threshold: 0.460, apply: (p) => clampTradeDepth(p + 0.0740, 0, 1) },
  { id: 'rule_2_19', threshold: 0.480, apply: (p) => clampTradeDepth(p + 0.0770, 0, 1) },
  { id: 'rule_2_20', threshold: 0.500, apply: (p) => clampTradeDepth(p + 0.0800, 0, 1) },
  { id: 'rule_2_21', threshold: 0.520, apply: (p) => clampTradeDepth(p + 0.0830, 0, 1) },
  { id: 'rule_2_22', threshold: 0.540, apply: (p) => clampTradeDepth(p + 0.0860, 0, 1) },
  { id: 'rule_2_23', threshold: 0.560, apply: (p) => clampTradeDepth(p + 0.0890, 0, 1) },
  { id: 'rule_2_24', threshold: 0.580, apply: (p) => clampTradeDepth(p + 0.0920, 0, 1) },
  { id: 'rule_2_25', threshold: 0.600, apply: (p) => clampTradeDepth(p + 0.0950, 0, 1) },
  { id: 'rule_2_26', threshold: 0.620, apply: (p) => clampTradeDepth(p + 0.0980, 0, 1) },
  { id: 'rule_2_27', threshold: 0.640, apply: (p) => clampTradeDepth(p + 0.1010, 0, 1) },
  { id: 'rule_2_28', threshold: 0.660, apply: (p) => clampTradeDepth(p + 0.1040, 0, 1) },
  { id: 'rule_2_29', threshold: 0.680, apply: (p) => clampTradeDepth(p + 0.1070, 0, 1) },
  { id: 'rule_2_30', threshold: 0.700, apply: (p) => clampTradeDepth(p + 0.1100, 0, 1) },
  { id: 'rule_2_31', threshold: 0.720, apply: (p) => clampTradeDepth(p + 0.1130, 0, 1) },
  { id: 'rule_2_32', threshold: 0.740, apply: (p) => clampTradeDepth(p + 0.1160, 0, 1) },
  { id: 'rule_2_33', threshold: 0.760, apply: (p) => clampTradeDepth(p + 0.1190, 0, 1) },
  { id: 'rule_2_34', threshold: 0.780, apply: (p) => clampTradeDepth(p + 0.1220, 0, 1) },
  { id: 'rule_2_35', threshold: 0.800, apply: (p) => clampTradeDepth(p + 0.1250, 0, 1) },
  { id: 'rule_2_36', threshold: 0.820, apply: (p) => clampTradeDepth(p + 0.1280, 0, 1) },
  { id: 'rule_2_37', threshold: 0.840, apply: (p) => clampTradeDepth(p + 0.1310, 0, 1) },
  { id: 'rule_2_38', threshold: 0.860, apply: (p) => clampTradeDepth(p + 0.1340, 0, 1) },
  { id: 'rule_2_39', threshold: 0.880, apply: (p) => clampTradeDepth(p + 0.1370, 0, 1) }
] as const;

export function V1014_TRADE_DEPTH_RETALIATION_002_evaluate(basePressure: number): number {
  let p = basePressure;
  for (const rule of V1014_TRADE_DEPTH_RETALIATION_002_RULES) {
    if (p >= rule.threshold) p = rule.apply(p);
  }
  return clampTradeDepth(p, 0, 1);
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_00(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 0 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_01(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 1 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_02(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 2 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_03(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 3 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_04(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 4 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_05(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 5 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_06(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 6 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_07(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 7 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_08(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 8 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_09(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 9 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_10(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 10 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_11(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 11 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_12(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 12 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_13(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 13 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_14(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 14 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_15(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 15 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_16(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 16 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_17(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 17 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_18(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 18 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_19(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 19 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_20(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 20 * 0.0005, 0, 1));
}

export function V1014_TRADE_DEPTH_RETALIATION_002_path_21(turn: number, trust: number): number {
  return V1014_TRADE_DEPTH_RETALIATION_002_evaluate(clampTradeDepth(0.15 + turn * 0.01 - trust * 0.002 + 21 * 0.0005, 0, 1));
}
