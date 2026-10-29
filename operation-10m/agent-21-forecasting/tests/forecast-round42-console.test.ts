import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound42Console } from '../forecast-round42-console.tsx';

test('round 42 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound42Console, { seed: 47 }));
  assert.match(html, /data-testid="ag21-round42-console"/);
  assert.match(html, /data-testid="ag21-round42-prior"/);
  assert.match(html, /data-testid="ag21-round42-projection"/);
  assert.match(html, /data-testid="ag21-round42-handoff"/);
});
