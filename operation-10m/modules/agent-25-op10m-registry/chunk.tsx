// OP10M_MODULE_BEGIN agent-25-op10m-registry
// Operation 10M — assembly registry (Tranche 01). Tracks integrated module ids in canonical.

export const OP10M_ASSEMBLY_REGISTRY_VERSION = 1;

export interface Op10mIntegratedModuleRecord {
  moduleId: string;
  trancheId: string;
}

export const OP10M_INTEGRATED_MODULE_RECORDS: Op10mIntegratedModuleRecord[] = [
  {
    moduleId: 'agent-25-op10m-registry',
    trancheId: 'tranche-01-op10m-registry',
  },
];

export function getOp10mAssemblyRegistrySnapshot(): {
  version: number;
  trancheId: string;
  modules: Op10mIntegratedModuleRecord[];
} {
  return {
    version: OP10M_ASSEMBLY_REGISTRY_VERSION,
    trancheId: 'tranche-01-op10m-registry',
    modules: OP10M_INTEGRATED_MODULE_RECORDS.slice(),
  };
}

export function runOp10mAssemblyRegistrySelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const snap = getOp10mAssemblyRegistrySnapshot();
  results.push({
    id: 'op10m_reg_01',
    name: 'registry version',
    passed: snap.version === OP10M_ASSEMBLY_REGISTRY_VERSION,
  });
  results.push({
    id: 'op10m_reg_02',
    name: 'registry lists self module',
    passed: snap.modules.some((m) => m.moduleId === 'agent-25-op10m-registry'),
  });
  results.push({
    id: 'op10m_reg_03',
    name: 'tranche id recorded',
    passed: snap.modules.every((m) => m.trancheId === 'tranche-01-op10m-registry'),
  });
  const failed = results.filter((r) => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
// OP10M_MODULE_END agent-25-op10m-registry
