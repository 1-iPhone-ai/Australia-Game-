import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound51Console } from '../forecast-round51-console.tsx';

test('round 50 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound51Console, { seed: 55 }));
  assert.match(html, /data-testid="ag21-round51-console"/);
  assert.match(html, /data-testid="ag21-round51-prior"/);
  assert.match(html, /data-testid="ag21-round51-projection"/);
  assert.match(html, /data-testid="ag21-round51-handoff"/);
});
