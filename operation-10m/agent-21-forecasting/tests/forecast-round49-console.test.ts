import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound49Console } from '../forecast-round49-console.tsx';

test('round 49 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound49Console, { seed: 54 }));
  assert.match(html, /data-testid="ag21-round49-console"/);
  assert.match(html, /data-testid="ag21-round49-prior"/);
  assert.match(html, /data-testid="ag21-round49-projection"/);
  assert.match(html, /data-testid="ag21-round49-handoff"/);
});
