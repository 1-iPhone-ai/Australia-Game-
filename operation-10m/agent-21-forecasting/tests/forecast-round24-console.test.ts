import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound24Console } from '../forecast-round24-console.tsx';

test('round 24 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound24Console, { seed: 19 }));
  assert.match(html, /data-testid="ag21-round24-console"/);
  assert.match(html, /data-testid="ag21-round24-prior"/);
  assert.match(html, /data-testid="ag21-round24-projection"/);
  assert.match(html, /data-testid="ag21-round24-handoff"/);
});
