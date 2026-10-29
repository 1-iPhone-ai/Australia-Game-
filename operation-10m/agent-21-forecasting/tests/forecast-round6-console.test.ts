import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound6Console } from '../forecast-round6-console.tsx';

test('round 6 console renders convergence, brief, playbook test ids', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound6Console, { seed: 19 }));
  assert.match(html, /data-testid="ag21-round6-console"/);
  assert.match(html, /data-testid="ag21-round6-convergence"/);
  assert.match(html, /data-testid="ag21-round6-brief"/);
  assert.match(html, /data-testid="ag21-round6-playbook"/);
});
