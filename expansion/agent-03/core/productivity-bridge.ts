/**
 * Productivity bridge — aggregates V10.5-style capability modifiers + commercialization bonuses.
 * Used by Agent 03 self-tests; canonical merge routes through innovationCapabilityModifiers + this layer.
 */

import { AGENT03_EFFECT_CAP, type CapabilityMaturity, type ProductivityModifier, type RegionCode } from '../types';
import { commercializationIndustryBonus, type CommercializationStage } from './commercialization-pathways';

export interface CapabilityEffectStub {
  capabilityId: string;
  maturity: CapabilityMaturity;
  operational: boolean;
  effects: Array<{
    kind: 'industry_efficiency' | 'network_efficiency';
    targetKey: string;
    magnitude: number;
    perSectorBound?: string;
    regionIds: RegionCode[];
  }>;
}

export interface ProductivityBridgeInput {
  capabilityEffects: CapabilityEffectStub[];
  commercializationStage: CommercializationStage;
  sectorByRegion: Partial<Record<RegionCode, Partial<Record<string, number>>>>;
}

const clamp = (n: number, cap = AGENT03_EFFECT_CAP) => Math.max(-cap, Math.min(cap, Math.round(n * 100) / 100));

export function applyProductivityBridge(input: ProductivityBridgeInput): ProductivityModifier[] {
  const mods: ProductivityModifier[] = [];

  input.capabilityEffects.forEach(cap => {
    if (!cap.operational) return;
    cap.effects.forEach(eff => {
      eff.regionIds.forEach(regionId => {
        let delta = eff.magnitude;
        if (eff.perSectorBound) {
          const base = Number(input.sectorByRegion[regionId]?.[eff.perSectorBound] || 0);
          delta = Math.sign(delta) * Math.min(Math.abs(delta), Math.max(0, base) * 0.06);
        }
        delta = clamp(delta);
        if (!delta) return;
        if (eff.kind === 'industry_efficiency') {
          mods.push({
            regionId,
            industry: eff.targetKey as ProductivityModifier['industry'],
            delta,
            source: cap.capabilityId,
            bounded: Math.abs(delta) <= AGENT03_EFFECT_CAP,
          });
        } else {
          mods.push({
            regionId,
            network: eff.targetKey as ProductivityModifier['network'],
            delta,
            source: cap.capabilityId,
            bounded: Math.abs(delta) <= AGENT03_EFFECT_CAP,
          });
        }
      });
    });
  });

  const commSectors = ['research', 'technology', 'manufacturing', 'finance'] as const;
  commSectors.forEach(sector => {
    const bonus = commercializationIndustryBonus(input.commercializationStage, sector);
    if (bonus <= 0) return;
    (Object.keys(input.sectorByRegion) as RegionCode[]).forEach(regionId => {
      const base = Number(input.sectorByRegion[regionId]?.[sector] || 0);
      if (base < 25) return;
      mods.push({
        regionId,
        industry: sector,
        delta: clamp(bonus),
        source: `commercialization:${input.commercializationStage}`,
        bounded: true,
      });
    });
  });

  return mergeProductivityModifiers(mods);
}

export function mergeProductivityModifiers(mods: ProductivityModifier[]): ProductivityModifier[] {
  const map = new Map<string, ProductivityModifier>();
  mods.forEach(m => {
    const key = `${m.regionId}:${m.industry || ''}:${m.network || ''}:${m.source}`;
    const prev = map.get(key);
    if (!prev) map.set(key, { ...m });
    else {
      prev.delta = clamp(prev.delta + m.delta);
      prev.bounded = Math.abs(prev.delta) <= AGENT03_EFFECT_CAP;
    }
  });
  return [...map.values()];
}

/** Simulates V105 ic17 — automated mining raises WA mining strength modestly with energy drag. */
export function simulateAutomatedMiningProductivity(sectorByRegion: ProductivityBridgeInput['sectorByRegion']): {
  miningDelta: number;
  energyDelta: number;
} {
  const bridge = applyProductivityBridge({
    capabilityEffects: [
      {
        capabilityId: 'automated_mining',
        maturity: 'operational',
        operational: true,
        effects: [
          { kind: 'industry_efficiency', targetKey: 'mining', magnitude: 5, regionIds: ['WA'] },
          { kind: 'network_efficiency', targetKey: 'energy', magnitude: -2, regionIds: ['WA'] },
        ],
      },
    ],
    commercializationStage: 'latent',
    sectorByRegion,
  });
  const miningDelta = bridge.find(m => m.regionId === 'WA' && m.industry === 'mining')?.delta ?? 0;
  const energyDelta = bridge.find(m => m.regionId === 'WA' && m.network === 'energy')?.delta ?? 0;
  return { miningDelta, energyDelta };
}

export function simulateResearchCommercializationProductivity(
  stage: CommercializationStage,
  sectorByRegion: ProductivityBridgeInput['sectorByRegion'],
): number {
  const bridge = applyProductivityBridge({
    capabilityEffects: [],
    commercializationStage: stage,
    sectorByRegion,
  });
  return bridge
    .filter(m => m.source.startsWith('commercialization:'))
    .reduce((s, m) => s + m.delta, 0);
}
