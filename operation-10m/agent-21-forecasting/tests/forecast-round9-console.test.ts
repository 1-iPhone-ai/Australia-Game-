import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound9Console } from '../forecast-round9-console.tsx';

test('round 9 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound9Console, { seed: 29 }));
  assert.match(html, /data-testid="ag21-round9-console"/);
  assert.match(html, /data-testid="ag21-round9-coherence"/);
  assert.match(html, /data-testid="ag21-round9-runbook"/);
  assert.match(html, /data-testid="ag21-round9-handoff"/);
});
