import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound27Console } from '../forecast-round27-console.tsx';

test('round 27 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound27Console, { seed: 25 }));
  assert.match(html, /data-testid="ag21-round27-console"/);
  assert.match(html, /data-testid="ag21-round27-prior"/);
  assert.match(html, /data-testid="ag21-round27-projection"/);
  assert.match(html, /data-testid="ag21-round27-handoff"/);
});
