import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound21Console } from '../forecast-round21-console.tsx';

test('round 21 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound21Console, { seed: 13 }));
  assert.match(html, /data-testid="ag21-round21-console"/);
  assert.match(html, /data-testid="ag21-round21-prior"/);
  assert.match(html, /data-testid="ag21-round21-projection"/);
  assert.match(html, /data-testid="ag21-round21-handoff"/);
});
