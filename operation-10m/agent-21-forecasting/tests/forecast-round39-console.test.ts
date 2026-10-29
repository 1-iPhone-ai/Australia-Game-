import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound39Console } from '../forecast-round39-console.tsx';

test('round 39 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound39Console, { seed: 44 }));
  assert.match(html, /data-testid="ag21-round39-console"/);
  assert.match(html, /data-testid="ag21-round39-prior"/);
  assert.match(html, /data-testid="ag21-round39-projection"/);
  assert.match(html, /data-testid="ag21-round39-handoff"/);
});
