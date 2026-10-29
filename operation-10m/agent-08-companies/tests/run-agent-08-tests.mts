import { runAgent08ModuleSelfTests, runAgent08IntegratedSelfTests, runAgent08RecoverySelfTests, runAgent08StabilizationSelfTests, runAgent08MandateSelfTests, runAgent08CascadeSelfTests, runAgent08SectorDepthSelfTests, runAgent08SupplyChainSelfTests, runAgent08TaxLaborSelfTests } from '../index.ts';

function main() {
  const tax = runAgent08TaxLaborSelfTests();
  const failedTax = tax.filter(t => !t.passed);
  if (failedTax.length) {
    console.error('Agent 08 tax/labor tests failed:', failedTax);
    process.exit(1);
  }
  console.log(`Agent 08 tax/labor: ${tax.length} passed`);

  const supply = runAgent08SupplyChainSelfTests();
  const failedSupply = supply.filter(t => !t.passed);
  if (failedSupply.length) {
    console.error('Agent 08 supply chain tests failed:', failedSupply);
    process.exit(1);
  }
  console.log(`Agent 08 supply chain: ${supply.length} passed`);

  const sector = runAgent08SectorDepthSelfTests();
  const failedSector = sector.filter(t => !t.passed);
  if (failedSector.length) {
    console.error('Agent 08 sector depth tests failed:', failedSector);
    process.exit(1);
  }
  console.log(`Agent 08 sector depth: ${sector.length} passed`);

  const cascade = runAgent08CascadeSelfTests();
  const failedCascade = cascade.filter(t => !t.passed);
  if (failedCascade.length) {
    console.error('Agent 08 cascade tests failed:', failedCascade);
    process.exit(1);
  }
  console.log(`Agent 08 production cascade: ${cascade.length} passed`);

  const integrated = runAgent08IntegratedSelfTests();
  const failedIntegrated = integrated.filter(t => !t.passed);
  if (failedIntegrated.length) {
    console.error('Agent 08 integrated tests failed:', failedIntegrated);
    process.exit(1);
  }
  console.log(`Agent 08 integrated synthesis: ${integrated.length} passed`);

  const recovery = runAgent08RecoverySelfTests();
  const failedRecovery = recovery.filter(t => !t.passed);
  if (failedRecovery.length) {
    console.error('Agent 08 recovery playbook tests failed:', failedRecovery);
    process.exit(1);
  }
  console.log(`Agent 08 recovery playbook: ${recovery.length} passed`);

  const stabilization = runAgent08StabilizationSelfTests();
  const failedStabilization = stabilization.filter(t => !t.passed);
  if (failedStabilization.length) {
    console.error('Agent 08 stabilization outlook tests failed:', failedStabilization);
    process.exit(1);
  }
  console.log(`Agent 08 stabilization outlook: ${stabilization.length} passed`);

  const mandate = runAgent08MandateSelfTests();
  const failedMandate = mandate.filter(t => !t.passed);
  if (failedMandate.length) {
    console.error('Agent 08 coordination mandate tests failed:', failedMandate);
    process.exit(1);
  }
  console.log(`Agent 08 coordination mandate: ${mandate.length} passed`);

  const moduleTests = runAgent08ModuleSelfTests();
  const failed = moduleTests.filter(t => !t.passed);
  if (failed.length) {
    console.error('Agent 08 module smoke tests failed:', failed);
    process.exit(1);
  }
  console.log(`Agent 08 module smoke: ${moduleTests.length} passed`);
}

main();
