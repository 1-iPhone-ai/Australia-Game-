export {
  O6K_AGENT08_MODULE_ID,
  O6K_AGENT08_MODULE_VERSION,
  V1014_PRIVATE_SCHEMA_VERSION,
  computeNationalPrivateSector,
  buildPrivateSectorInputs,
  createInitialPrivateSectorPersisted,
  runV1014_PRIVATE_PrivateSectorSelfTests,
  privateSectorInputHash,
} from './v1014-private-sector-core';

export {
  AGENT08_TAX_LABOR_SCHEMA_VERSION,
  applyTaxLaborCapacityOverlay,
  buildLaborSlicesFromWorkforce,
  computeTaxLaborCapacityAdjustments,
  inferFiscalSlicesFromNationalSystems,
  runAgent08TaxLaborSelfTests,
} from './tax-labor-capacity-linkage';

export type { Agent08CapacityAdjustment, Agent08TaxLaborInputs } from './tax-labor-capacity-linkage';

import { runV1014_PRIVATE_PrivateSectorSelfTests } from './v1014-private-sector-core';
import { runAgent08TaxLaborSelfTests } from './tax-labor-capacity-linkage';

/** Combined self-test entrypoint for CI and Agent 25 merge verification. */
export function runAgent08ModuleSelfTests(): Array<{ id: string; name?: string; passed: boolean; detail: string }> {
  const core = runV1014_PRIVATE_PrivateSectorSelfTests().map(t => ({
    id: t.id,
    name: t.name,
    passed: t.passed,
    detail: t.detail,
  }));
  const taxLabor = runAgent08TaxLaborSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  return [...core.slice(0, 5), ...taxLabor];
}
