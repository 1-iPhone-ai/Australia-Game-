#!/usr/bin/env node
/**
 * Operation 111 — dev-only helper. Parses SECTION banners in the canonical TSX
 * and prints a markdown table (stdout). Does not modify the game file.
 *
 * Usage: node dev/op111/extract-section-index.mjs [path-to-tsx]
 */
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { resolve } from 'node:path';

const defaultPath = resolve(process.cwd(), '(V9.4) australia-game-with-ai.tsx');
const filePath = resolve(process.argv[2] || defaultPath);

const sections = [];
const rl = createInterface({ input: createReadStream(filePath, { encoding: 'utf8' }), crlfDelay: Infinity });
let lineNo = 0;
for await (const line of rl) {
  lineNo += 1;
  const m = line.trim().match(/^\/\/ SECTION (.+)$/);
  if (m) sections.push({ start: lineNo, name: m[1].trim() });
}

const totalLines = lineNo;
console.log(`<!-- generated from ${filePath} (${totalLines.toLocaleString()} lines) -->`);
console.log('| # | Section | Start | End | Lines |');
console.log('|---|---------|------:|----:|------:|');
sections.forEach((s, i) => {
  const end = i + 1 < sections.length ? sections[i + 1].start - 1 : totalLines;
  const lines = end - s.start + 1;
  const name = s.name.replace(/\|/g, '/');
  console.log(`| ${i + 1} | ${name} | ${s.start} | ${end} | ${lines.toLocaleString()} |`);
});
