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
});

test('module manifest references chunk path', () => {
  const manifest = JSON.parse(
    readFileSync(new URL('../../modules/agent-21-forecasting/module.manifest.json', import.meta.url), 'utf8')
  );
  assert.equal(manifest.moduleId, 'agent-21-forecasting');
  assert.equal(manifest.chunkPath, 'operation-10m/modules/agent-21-forecasting/chunk.tsx');
  assert.match(manifest.contentSha256, /^[a-f0-9]{64}$/);
});
