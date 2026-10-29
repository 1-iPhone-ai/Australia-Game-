import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound30Console } from '../forecast-round30-console.tsx';

test('round 30 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound30Console, { seed: 31 }));
  assert.match(html, /data-testid="ag21-round30-console"/);
  assert.match(html, /data-testid="ag21-round30-prior"/);
  assert.match(html, /data-testid="ag21-round30-projection"/);
  assert.match(html, /data-testid="ag21-round30-handoff"/);
});
