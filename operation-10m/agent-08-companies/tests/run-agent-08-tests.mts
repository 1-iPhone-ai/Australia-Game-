import { runAgent08ModuleSelfTests, runAgent08TaxLaborSelfTests } from '../index.ts';

function main() {
  const tax = runAgent08TaxLaborSelfTests();
  const failedTax = tax.filter(t => !t.passed);
  if (failedTax.length) {
    console.error('Agent 08 tax/labor tests failed:', failedTax);
    process.exit(1);
  }
  console.log(`Agent 08 tax/labor: ${tax.length} passed`);

  const moduleTests = runAgent08ModuleSelfTests();
  const failed = moduleTests.filter(t => !t.passed);
  if (failed.length) {
    console.error('Agent 08 module smoke tests failed:', failed);
    process.exit(1);
  }
  console.log(`Agent 08 module smoke: ${moduleTests.length} passed`);
}

main();
