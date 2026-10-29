import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound41Console } from '../forecast-round41-console.tsx';

test('round 41 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound41Console, { seed: 46 }));
  assert.match(html, /data-testid="ag21-round41-console"/);
  assert.match(html, /data-testid="ag21-round41-prior"/);
  assert.match(html, /data-testid="ag21-round41-projection"/);
  assert.match(html, /data-testid="ag21-round41-handoff"/);
});
