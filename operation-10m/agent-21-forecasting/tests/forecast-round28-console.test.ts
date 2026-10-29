import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound28Console } from '../forecast-round28-console.tsx';

test('round 28 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound28Console, { seed: 27 }));
  assert.match(html, /data-testid="ag21-round28-console"/);
  assert.match(html, /data-testid="ag21-round28-prior"/);
  assert.match(html, /data-testid="ag21-round28-projection"/);
  assert.match(html, /data-testid="ag21-round28-handoff"/);
});
