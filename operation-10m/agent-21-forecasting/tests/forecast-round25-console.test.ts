import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound25Console } from '../forecast-round25-console.tsx';

test('round 25 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound25Console, { seed: 21 }));
  assert.match(html, /data-testid="ag21-round25-console"/);
  assert.match(html, /data-testid="ag21-round25-prior"/);
  assert.match(html, /data-testid="ag21-round25-projection"/);
  assert.match(html, /data-testid="ag21-round25-handoff"/);
});
