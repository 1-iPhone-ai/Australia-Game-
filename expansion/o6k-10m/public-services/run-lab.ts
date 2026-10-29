import { runV1014PublicServicesV2SelfTests } from './src/self-tests/kpi-regression-suite.ts';

async function runGeneratedScenarioSmoke(): Promise<{ passed: number; failed: number }> {
  const gen = await import('./src/generated/index.ts');
  let passed = 0;
  let failed = 0;
  for (let i = 0; i < 185; i++) {
    const mod = String(i).padStart(3, '0');
    const fnName = `V1014_PUBSVC_KPI_SCENARIO_${mod}_regressionAssert` as keyof typeof gen;
    const fn = gen[fnName] as ((turn: number) => boolean) | undefined;
    if (!fn) {
      failed++;
      continue;
    }
    if (fn(3) && fn(7)) passed++;
    else failed++;
  }
  return { passed, failed };
}

const report = runV1014PublicServicesV2SelfTests();
const smoke = await runGeneratedScenarioSmoke();

console.log(JSON.stringify({ kpi: report, generatedSmoke: smoke }, null, 2));

if (report.failed > 0 || report.total < 45) {
  process.exitCode = 1;
}
