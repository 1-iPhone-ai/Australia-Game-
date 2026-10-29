import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound20Console } from '../forecast-round20-console.tsx';

test('round 20 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound20Console, { seed: 11 }));
  assert.match(html, /data-testid="ag21-round20-console"/);
  assert.match(html, /data-testid="ag21-round20-prior"/);
  assert.match(html, /data-testid="ag21-round20-projection"/);
  assert.match(html, /data-testid="ag21-round20-handoff"/);
});
