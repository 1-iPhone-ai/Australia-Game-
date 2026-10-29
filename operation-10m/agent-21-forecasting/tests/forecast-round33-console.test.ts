import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound33Console } from '../forecast-round33-console.tsx';

test('round 33 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound33Console, { seed: 37 }));
  assert.match(html, /data-testid="ag21-round33-console"/);
  assert.match(html, /data-testid="ag21-round33-prior"/);
  assert.match(html, /data-testid="ag21-round33-projection"/);
  assert.match(html, /data-testid="ag21-round33-handoff"/);
});
