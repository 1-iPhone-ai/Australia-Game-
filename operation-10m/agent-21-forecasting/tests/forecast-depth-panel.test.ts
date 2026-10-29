import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastDepthPanel } from '../forecast-depth-panel.tsx';

test('forecast depth panel renders depth test ids', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastDepthPanel, { compact: true }));
  assert.match(html, /data-testid="ag21-forecast-depth-panel"/);
  assert.match(html, /data-testid="ag21-depth-metrics"/);
  assert.match(html, /non-authoritative/i);
});
