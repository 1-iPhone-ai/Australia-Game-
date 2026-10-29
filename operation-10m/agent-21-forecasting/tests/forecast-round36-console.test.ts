import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound36Console } from '../forecast-round36-console.tsx';

test('round 36 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound36Console, { seed: 41 }));
  assert.match(html, /data-testid="ag21-round36-console"/);
  assert.match(html, /data-testid="ag21-round36-prior"/);
  assert.match(html, /data-testid="ag21-round36-projection"/);
  assert.match(html, /data-testid="ag21-round36-handoff"/);
});
