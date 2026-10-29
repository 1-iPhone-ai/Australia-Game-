import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound4Console } from '../forecast-round4-console.tsx';

test('round 4 console renders backtest, regret, gates test ids', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound4Console, { seed: 13 }));
  assert.match(html, /data-testid="ag21-round4-console"/);
  assert.match(html, /data-testid="ag21-round4-backtest"/);
  assert.match(html, /data-testid="ag21-round4-regret"/);
  assert.match(html, /data-testid="ag21-round4-gates"/);
});
