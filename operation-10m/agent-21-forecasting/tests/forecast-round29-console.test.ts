import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound29Console } from '../forecast-round29-console.tsx';

test('round 29 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound29Console, { seed: 29 }));
  assert.match(html, /data-testid="ag21-round29-console"/);
  assert.match(html, /data-testid="ag21-round29-prior"/);
  assert.match(html, /data-testid="ag21-round29-projection"/);
  assert.match(html, /data-testid="ag21-round29-handoff"/);
});
