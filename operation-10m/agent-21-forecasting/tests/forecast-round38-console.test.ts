import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound38Console } from '../forecast-round38-console.tsx';

test('round 38 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound38Console, { seed: 43 }));
  assert.match(html, /data-testid="ag21-round38-console"/);
  assert.match(html, /data-testid="ag21-round38-prior"/);
  assert.match(html, /data-testid="ag21-round38-projection"/);
  assert.match(html, /data-testid="ag21-round38-handoff"/);
});
