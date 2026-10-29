import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import { TAX_EXPENDITURE_CATALOG } from './catalog/measures';
import type { TaxExpenditureLine, TaxExpenditureStatement } from './types';
import { TAX_EXPENDITURE_SCHEMA } from './types';

function materialityBand(forgone: number, threshold: number): TaxExpenditureLine['band'] {
  if (forgone >= threshold * 1.5) return 'material';
  if (forgone >= threshold * 0.6) return 'moderate';
  return 'minor';
}

export function buildTaxExpenditureStatement(
  turn: number,
  v1012: V1012FiscalSnapshot
): TaxExpenditureStatement {
  const grossStructuralCapacity = v1012.revenueCapacity;
  const materialityThreshold = Math.max(1.5, grossStructuralCapacity * 0.04);
  const pressureScale = v1012.pressure === 'critical' ? 1.05 : v1012.pressure === 'strained' ? 1.02 : 1;

  const lines: TaxExpenditureLine[] = TAX_EXPENDITURE_CATALOG.map(measure => {
    const active = measure.sunsetTurn === null || turn <= measure.sunsetTurn;
    const forgonePoints = active
      ? Math.round(measure.structuralForgonePoints * pressureScale * 10) / 10
      : 0;
    return {
      measureId: measure.id,
      code: measure.code,
      forgonePoints,
      band: materialityBand(forgonePoints, materialityThreshold),
      reviewDue: measure.sunsetTurn !== null && turn >= measure.sunsetTurn - 2,
      explanation: active ? measure.description : `Sunset reached turn ${measure.sunsetTurn}.`
    };
  });

  const totalForgone = Math.round(lines.reduce((s, l) => s + l.forgonePoints, 0) * 10) / 10;
  const netStructuralCapacity = Math.max(0, Math.round((grossStructuralCapacity - totalForgone * 0.35) * 10) / 10);

  const warnings: string[] = [];
  const material = lines.filter(l => l.band === 'material');
  if (material.length >= 3) {
    warnings.push(`${material.length} material tax expenditures — review base-broadening options.`);
  }
  if (totalForgone > grossStructuralCapacity * 0.25) {
    warnings.push('Aggregate tax expenditure exceeds 25% of structural capacity (normalized).');
  }
  if (lines.some(l => l.reviewDue)) {
    warnings.push('Sunsetting measures require parliamentary renewal review.');
  }

  return {
    schemaVersion: TAX_EXPENDITURE_SCHEMA,
    turn,
    grossStructuralCapacity,
    totalForgone,
    netStructuralCapacity,
    lines,
    materialityThreshold,
    warnings
  };
}

export function countTaxExpenditureMeasures(): number {
  return TAX_EXPENDITURE_CATALOG.length;
}
