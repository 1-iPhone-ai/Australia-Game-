import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound37Console } from '../forecast-round37-console.tsx';

test('round 37 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound37Console, { seed: 42 }));
  assert.match(html, /data-testid="ag21-round37-console"/);
  assert.match(html, /data-testid="ag21-round37-prior"/);
  assert.match(html, /data-testid="ag21-round37-projection"/);
  assert.match(html, /data-testid="ag21-round37-handoff"/);
});
