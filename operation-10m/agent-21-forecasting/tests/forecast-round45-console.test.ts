import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound45Console } from '../forecast-round45-console.tsx';

test('round 45 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound45Console, { seed: 50 }));
  assert.match(html, /data-testid="ag21-round45-console"/);
  assert.match(html, /data-testid="ag21-round45-prior"/);
  assert.match(html, /data-testid="ag21-round45-projection"/);
  assert.match(html, /data-testid="ag21-round45-handoff"/);
});
