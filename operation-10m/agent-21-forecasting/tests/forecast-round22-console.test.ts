import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound22Console } from '../forecast-round22-console.tsx';

test('round 22 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound22Console, { seed: 15 }));
  assert.match(html, /data-testid="ag21-round22-console"/);
  assert.match(html, /data-testid="ag21-round22-prior"/);
  assert.match(html, /data-testid="ag21-round22-projection"/);
  assert.match(html, /data-testid="ag21-round22-handoff"/);
});
