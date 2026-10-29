import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound26Console } from '../forecast-round26-console.tsx';

test('round 26 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound26Console, { seed: 23 }));
  assert.match(html, /data-testid="ag21-round26-console"/);
  assert.match(html, /data-testid="ag21-round26-prior"/);
  assert.match(html, /data-testid="ag21-round26-projection"/);
  assert.match(html, /data-testid="ag21-round26-handoff"/);
});
