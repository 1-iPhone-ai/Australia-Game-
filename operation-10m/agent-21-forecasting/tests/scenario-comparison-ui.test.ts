import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ScenarioComparisonStrip } from '../scenario-comparison-ui.tsx';

test('scenario comparison strip renders test ids and metrics', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ScenarioComparisonStrip, { compact: true }));
  assert.match(html, /data-testid="ag21-scenario-comparison"/);
  assert.match(html, /data-testid="ag21-evaluation-metrics"/);
  assert.match(html, /data-testid="ag21-comparison-recommendation"/);
  assert.match(html, /non-authoritative/i);
});
