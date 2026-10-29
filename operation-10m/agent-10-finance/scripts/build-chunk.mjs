#!/usr/bin/env node
/**
 * Bundles agent-10-finance sources into operation-10m/modules/agent-10-finance/chunk.tsx
 * (no top-level import lines — inline-ready for Agent 25 / OP10M assembly).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-10-finance/src');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-10-finance');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'definitions/types.ts',
  'definitions/constants.ts',
  'definitions/glossary.ts',
  'compute/math.ts',
  'credit/bands.ts',
  'credit/actor-leverage.ts',
  'rates/reference-rate.ts',
  'prices/boundary.ts',
  'prices/market-dynamics.ts',
  'shocks/catalog.ts',
  'shocks/scenario-runner.ts',
  'inflation/pass-through.ts',
  'inflation/wage-price-spiral.ts',
  'inflation/cpi-basket.ts',
  'inflation/expectations-anchor.ts',
  'inflation/phillips-slack.ts',
  'inflation/core-headline-spread.ts',
  'inflation/supply-demand-shock.ts',
  'rates/monetary-reaction.ts',
  'rates/inflation-target-breach.ts',
  'rates/real-rate-gap.ts',
  'rates/term-premium-inflation-signal.ts',
  'fiscal/fiscal-dominance.ts',
  'credit/credit-inflation-feedback.ts',
  'inflation/inflation-momentum.ts',
  'inflation/disinflation-sacrifice.ts',
  'inflation/import-price-pass-through.ts',
  'inflation/energy-price-pass-through.ts',
  'inflation/shelter-rent-inflation.ts',
  'inflation/food-grocery-pass-through.ts',
  'inflation/transport-logistics-inflation.ts',
  'inflation/healthcare-services-inflation.ts',
  'inflation/insurance-premium-pass-through.ts',
  'inflation/education-tuition-inflation.ts',
  'inflation/communications-services-inflation.ts',
  'inflation/recreation-leisure-inflation.ts',
  'inflation/professional-services-fee-inflation.ts',
  'inflation/childcare-services-inflation.ts',
  'inflation/government-charges-inflation.ts',
  'inflation/water-utilities-inflation.ts',
  'inflation/domestic-travel-inflation.ts',
  'inflation/construction-materials-inflation.ts',
  'inflation/retail-trade-margin-inflation.ts',
  'inflation/financial-services-fee-inflation.ts',
  'inflation/agricultural-farmgate-inflation.ts',
  'inflation/public-utilities-grid-tariff-inflation.ts',
  'inflation/ui-inflation-salience-pass-through.ts',
  'inflation/housing-mortgage-essential-inflation.ts',
  'inflation/macro-transmission-merge-inflation.ts',
  'inflation/dynamic-events-inflation-spillover.ts',
  'inflation/dashboard-map-inflation-overlay.ts',
  'inflation/public-finance-debt-service-inflation.ts',
  'inflation/population-labor-wage-inflation.ts',
  'inflation/wholesale-energy-transition-inflation.ts',
  'inflation/urban-rent-dispersion-inflation.ts',
  'inflation/corporate-pricing-pass-through-inflation.ts',
  'inflation/trade-exchange-import-inflation.ts',
  'inflation/guardian-inflation-intervention-inflation.ts',
  'inflation/team-intelligence-consensus-inflation.ts',
  'inflation/strategic-geopolitical-inflation-premium.ts',
  'inflation/ai-memory-inflation-recall-inflation.ts',
  'inflation/calendar-season-inflation-carryover.ts',
  'inflation/automation-autopilot-inflation-drift.ts',
  'inflation/research-productivity-inflation-offset.ts',
  'inflation/scenario-sandbox-inflation-bias.ts',
  'inflation/events-narrative-inflation-persistence.ts',
  'inflation/macro-demand-overheat-inflation-slippage.ts',
  'inflation/freight-logistics-inflation-congestion.ts',
  'inflation/housing-wellbeing-inflation-essential-stress.ts',
  'inflation/command-center-inflation-fusion-escalation.ts',
  'inflation/ui-player-inflation-salience-nudge.ts',
  'inflation/fiscal-indexation-inflation-anchor-breach.ts',
  'inflation/household-wage-inflation-deanchoring.ts',
  'inflation/corporate-markup-inflation-cascade.ts',
  'inflation/trade-tariff-import-inflation-pipeline.ts',
  'inflation/metro-urban-rent-inflation-surge.ts',
  'inflation/wholesale-grid-energy-inflation-cascade.ts',
  'inflation/guardian-guardrail-inflation-escalation.ts',
  'inflation/team-consensus-inflation-briefing-drift.ts',
  'inflation/memory-commonwealth-inflation-recall-gate.ts',
  'inflation/automation-synthesis-inflation-cascade-drift.ts',
  'inflation/ui-shell-inflation-salience-escalation.ts',
  'inflation/dashboard-heatmap-inflation-overlay-cascade.ts',
  'inflation/command-center-inflation-fusion-latch.ts',
  'inflation/transport-freight-inflation-congestion-cascade.ts',
  'inflation/events-staged-inflation-shock-persistence.ts',
  'inflation/modes-sandbox-inflation-stress-cascade.ts',
  'inflation/fiscal-appropriation-inflation-pressure-latch.ts',
  'inflation/household-budget-inflation-stress-cascade.ts',
  'inflation/corporate-survival-pricing-inflation-latch.ts',
  'inflation/trade-tariff-exchange-inflation-escalation.ts',
  'credit/loan-pricing.ts',
  'investment/climate-link.ts',
  'transmission/channels.ts',
  'persistence/validate-state.ts',
  'catalog/fiscal-inflation-scenarios.ts',
  'compute/national-macro-financial.ts',
  'integration/query-co-pilot.ts',
  'integration/regression-harness.ts',
  'integration/save-bridge.ts',
  'integration/agent06-macro-bridge.ts',
  'integration/agent07-fiscal-bridge.ts',
  'integration/agent09-household-bridge.ts',
  'integration/agent15-trade-bridge.ts',
  'integration/agent08-corporate-bridge.ts',
  'integration/agent11-cities-bridge.ts',
  'integration/agent13-energy-bridge.ts',
  'integration/agent14-housing-bridge.ts',
  'integration/agent12-transport-bridge.ts',
  'integration/agent03-research-bridge.ts',
  'integration/agent05-events-bridge.ts',
  'integration/agent04-modes-bridge.ts',
  'integration/agent16-guardian-bridge.ts',
  'integration/agent17-command-bridge.ts',
  'integration/agent18-team-bridge.ts',
  'integration/agent02-turns-bridge.ts',
  'integration/agent20-automation-bridge.ts',
  'integration/agent01-strategic-bridge.ts',
  'integration/agent19-memory-bridge.ts',
  'integration/agent22-ui-bridge.ts',
  'integration/agent23-dashboards-bridge.ts',
  'integration/inflation-forecast.ts',
  'integration/inflation-regime-tracker.ts',
  'integration/agent21-forecast-bridge.ts',
  'credit/tier-spreads.ts',
  'self-tests.ts',
  'react/FinanceConditionsLab.tsx',
  'react/FinanceTransmissionPanel.tsx',
  'react/InflationDiagnosticsPanel.tsx',
  'react/InflationRegimePanel.tsx',
  'react/InflationMomentumPanel.tsx',
  'react/ImportInflationPanel.tsx',
  'react/UrbanEnergyInflationPanel.tsx',
  'react/TransportFoodInflationPanel.tsx',
  'react/HealthcareInsuranceInflationPanel.tsx',
  'react/EducationCommunicationsInflationPanel.tsx',
  'react/RecreationProfessionalInflationPanel.tsx',
  'react/ChildcareGovernmentInflationPanel.tsx',
  'react/WaterTravelStrategicInflationPanel.tsx',
  'react/ConstructionRetailDashboardInflationPanel.tsx',
  'react/FinancialServicesFarmgateCommandInflationPanel.tsx',
  'react/UiUtilitiesGridInflationPanel.tsx',
  'react/HousingMacroMergeInflationPanel.tsx',
  'react/EventsDashboardInflationPanel.tsx',
  'react/FiscalLaborInflationPanel.tsx',
  'react/EnergyCitiesInflationPanel.tsx',
  'react/CorporateTradeInflationPanel.tsx',
  'react/GuardianTeamInflationPanel.tsx',
  'react/StrategicMemoryInflationPanel.tsx',
  'react/TurnsAutomationInflationPanel.tsx',
  'react/ResearchModesInflationPanel.tsx',
  'react/EventsMacroInflationPanel.tsx',
  'react/TransportHousingInflationPanel.tsx',
  'react/CommandUiInflationPanel.tsx',
  'react/FiscalHouseholdInflationPanel.tsx',
  'react/MarkupTariffInflationPanel.tsx',
  'react/MetroGridInflationPanel.tsx',
  'react/GuardianBriefingInflationPanel.tsx',
  'react/MemoryAutomationInflationPanel.tsx',
  'react/UiDashboardInflationPanel.tsx',
  'react/CommandTransportInflationPanel.tsx',
  'react/EventsModesInflationPanel.tsx',
  'react/FiscalHouseholdBudgetInflationPanel.tsx',
  'react/CorporateTradeWaveInflationPanel.tsx',
];

function stripModulePreamble(source) {
  return source
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (t.startsWith('import ')) return false;
      if (t.startsWith('export * from')) return false;
      return true;
    })
    .join('\n');
}

const parts = [
  '// OP10M_MODULE_BEGIN agent-10-finance',
  '// Agent 10 — V10.14 macro-financial conditions (generated; source: operation-10m/agent-10-finance/src/)',
  '',
];

for (const rel of FILES) {
  const abs = path.join(srcRoot, rel);
  if (!fs.existsSync(abs)) {
    console.error('Missing source file:', rel);
    process.exit(1);
  }
  parts.push(`// --- source: ${rel} ---`);
  parts.push(stripModulePreamble(fs.readFileSync(abs, 'utf8')));
  parts.push('');
}

parts.push('// OP10M_MODULE_END agent-10-finance');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
