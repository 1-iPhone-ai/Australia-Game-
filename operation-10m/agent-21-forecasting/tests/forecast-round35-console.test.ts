import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound35Console } from '../forecast-round35-console.tsx';

test('round 35 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound35Console, { seed: 40 }));
  assert.match(html, /data-testid="ag21-round35-console"/);
  assert.match(html, /data-testid="ag21-round35-prior"/);
  assert.match(html, /data-testid="ag21-round35-projection"/);
  assert.match(html, /data-testid="ag21-round35-handoff"/);
});
