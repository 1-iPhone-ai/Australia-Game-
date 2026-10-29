import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound10Console } from '../forecast-round10-console.tsx';

test('round 10 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound10Console, { seed: 41 }));
  assert.match(html, /data-testid="ag21-round10-console"/);
  assert.match(html, /data-testid="ag21-round10-readiness"/);
  assert.match(html, /data-testid="ag21-round10-signoff"/);
  assert.match(html, /data-testid="ag21-round10-staging"/);
});
