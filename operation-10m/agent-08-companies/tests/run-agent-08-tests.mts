import { runAgent08ModuleSelfTests, runAgent08SectorDepthSelfTests, runAgent08SupplyChainSelfTests, runAgent08TaxLaborSelfTests } from '../index.ts';

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

  const moduleTests = runAgent08ModuleSelfTests();
  const failed = moduleTests.filter(t => !t.passed);
  if (failed.length) {
    console.error('Agent 08 module smoke tests failed:', failed);
    process.exit(1);
  }
  console.log(`Agent 08 module smoke: ${moduleTests.length} passed`);
}

main();
