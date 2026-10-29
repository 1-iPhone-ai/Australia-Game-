import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound48Console } from '../forecast-round48-console.tsx';

test('round 48 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound48Console, { seed: 53 }));
  assert.match(html, /data-testid="ag21-round48-console"/);
  assert.match(html, /data-testid="ag21-round48-prior"/);
  assert.match(html, /data-testid="ag21-round48-projection"/);
  assert.match(html, /data-testid="ag21-round48-handoff"/);
});
