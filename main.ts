// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: a GTA 6 meme whose picture shows the
// make.fun ghost paying for the game with one magenta coin his AI agent
// earned, posted publicly with the entrant's play code in its text.
// POST.json at the repository root names the post's address on X; the
// grader reads the post from X, so this program only has to hand the
// gate a copy of POST.json at /output/POST.json.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly on a placeholder or malformed POST.json instead of handing
// the gate an address it will refuse: the url must be a real X post
// address, https://x.com/<handle>/status/<id>, with a numeric id.
function checkPostJson(raw: string): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('POST.json is not valid JSON');
  }
  const url = (parsed as { url?: unknown })?.url;
  if (typeof url !== 'string' || !/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(url)) {
    throw new Error(`POST.json url is not an X post address: ${String(url)}`);
  }
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  const source = join(BOT_DIR, 'POST.json');
  checkPostJson(readFileSync(source, 'utf8'));
  copyFileSync(source, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
