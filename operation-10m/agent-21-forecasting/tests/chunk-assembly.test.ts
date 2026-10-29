import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const CHUNK_PATH = new URL('../../modules/agent-21-forecasting/chunk.tsx', import.meta.url);

test('chunk.tsx publishes OP10M_MODULE_BEGIN/END agent-21-forecasting', () => {
  const src = readFileSync(CHUNK_PATH, 'utf8');
  assert.match(src, /^\/\/ OP10M_MODULE_BEGIN agent-21-forecasting/m);
  assert.match(src, /\/\/ OP10M_MODULE_END agent-21-forecasting\s*$/m);
  assert.match(src, /O10M_AGENT21_INTEGRATION_ANCHOR/);
  assert.match(src, /runAgent21ForecastingChunkSelfTests/);
  assert.match(src, /Ag21ScenarioComparisonStrip/);
  assert.match(src, /Ag21ForecastDepthPanel/);
  assert.match(src, /Ag21ForecastRound3Console/);
  assert.match(src, /buildAg21EnsembleProjection/);
  assert.match(src, /fuseAg21ScenarioTrajectories/);
  assert.match(src, /Ag21ForecastRound4Console/);
  assert.match(src, /runAg21EnsembleResidualBacktest/);
  assert.match(src, /evaluateAg21ReliabilityGates/);
  assert.match(src, /Ag21ForecastRound5Console/);
  assert.match(src, /measureAg21HorizonVolatility/);
  assert.match(src, /buildAg21SurfacingScorecard/);
  assert.match(src, /Ag21ForecastRound6Console/);
  assert.match(src, /measureAg21EnsembleConvergence/);
  assert.match(src, /assembleAg21PlayerForecastBrief/);
  assert.match(src, /buildAg21LabPlaybook/);
  assert.match(src, /Ag21ForecastRound7Console/);
  assert.match(src, /resolveAg21SurfaceDecision/);
  assert.match(src, /collectAg21LabTelemetry/);
  assert.match(src, /buildAg21CrosslinkPacket/);
  assert.match(src, /Ag21ForecastRound8Console/);
  assert.match(src, /validateAg21CrosslinkHandoff/);
  assert.match(src, /resolveAg21OperatorEscalation/);
  assert.match(src, /buildAg21LabReplaySeed/);
  assert.match(src, /Ag21ForecastRound9Console/);
  assert.match(src, /assessAg21ReplayCoherence/);
  assert.match(src, /buildAg21EscalationRunbook/);
  assert.match(src, /buildAg21LabIntegrationHandoff/);
  assert.match(src, /Ag21ForecastRound10Console/);
  assert.match(src, /evaluateAg21HandoffReadiness/);
  assert.match(src, /buildAg21OperatorSignoffRecord/);
  assert.match(src, /buildAg21LabStagingPacket/);
});

test('module manifest references chunk path', () => {
  const manifest = JSON.parse(
    readFileSync(new URL('../../modules/agent-21-forecasting/module.manifest.json', import.meta.url), 'utf8')
  );
  assert.equal(manifest.moduleId, 'agent-21-forecasting');
  assert.equal(manifest.chunkPath, 'operation-10m/modules/agent-21-forecasting/chunk.tsx');
  assert.match(manifest.contentSha256, /^[a-f0-9]{64}$/);
});
