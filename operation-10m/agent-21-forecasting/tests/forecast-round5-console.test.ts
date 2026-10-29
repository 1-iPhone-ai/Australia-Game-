import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound5Console } from '../forecast-round5-console.tsx';

test('round 5 console renders volatility, attribution, scorecard test ids', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound5Console, { seed: 17 }));
  assert.match(html, /data-testid="ag21-round5-console"/);
  assert.match(html, /data-testid="ag21-round5-volatility"/);
  assert.match(html, /data-testid="ag21-round5-attribution"/);
  assert.match(html, /data-testid="ag21-round5-scorecard"/);
});
