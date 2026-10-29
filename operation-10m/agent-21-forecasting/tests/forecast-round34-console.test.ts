import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound34Console } from '../forecast-round34-console.tsx';

test('round 34 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound34Console, { seed: 39 }));
  assert.match(html, /data-testid="ag21-round34-console"/);
  assert.match(html, /data-testid="ag21-round34-prior"/);
  assert.match(html, /data-testid="ag21-round34-projection"/);
  assert.match(html, /data-testid="ag21-round34-handoff"/);
});
