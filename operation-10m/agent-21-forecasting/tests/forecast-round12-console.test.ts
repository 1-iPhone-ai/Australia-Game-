import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound12Console } from '../forecast-round12-console.tsx';

test('round 12 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound12Console, { seed: 47 }));
  assert.match(html, /data-testid="ag21-round12-console"/);
  assert.match(html, /data-testid="ag21-round12-attestation"/);
  assert.match(html, /data-testid="ag21-round12-manifest"/);
  assert.match(html, /data-testid="ag21-round12-seal"/);
});
