import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound16Console } from '../forecast-round16-console.tsx';

test('round 16 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound16Console, { seed: 71 }));
  assert.match(html, /data-testid="ag21-round16-console"/);
  assert.match(html, /data-testid="ag21-round16-readiness"/);
  assert.match(html, /data-testid="ag21-round16-projection"/);
  assert.match(html, /data-testid="ag21-round16-attestation"/);
});
