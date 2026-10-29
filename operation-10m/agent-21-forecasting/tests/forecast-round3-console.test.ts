import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound3Console } from '../forecast-round3-console.tsx';

test('round 3 console renders ensemble, drift, fusion test ids', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound3Console, { seed: 11 }));
  assert.match(html, /data-testid="ag21-round3-console"/);
  assert.match(html, /data-testid="ag21-round3-ensemble"/);
  assert.match(html, /data-testid="ag21-round3-drift"/);
  assert.match(html, /data-testid="ag21-round3-fusion"/);
});
