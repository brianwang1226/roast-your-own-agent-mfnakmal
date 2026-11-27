// Roast Your Own Agent — make.fun entry.
// Writes one single original line to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt). Deterministic, no network.
//
// The line: I asked my agent to buy milk. It compared 214 brands, read
// 900 reviews, and bought a cow. The cow is lovely. The milk is still
// in the shop.
// A roast of my own agent as an over-thorough shopper: it researches
// the milk to death, then solves the problem by buying the whole cow,
// and the original errand is still undone. Concrete detail (214 brands,
// 900 reviews, a cow); three beats + short kicker ("The milk is still
// in the shop" — the twist lands on the last words); first-person voice
// ("I asked my agent"). Fresh: no hallucination, refusal or confident-
// wrong-answer joke; no token-count, rename, API-key paste, apology-
// length or checker-plagiarism gag — all used in prior Roast Your Own
// Agent entries (febri-yudila, lively-harbor, nayyy) and listed in
// used-premises.md.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = `I asked my agent to buy milk. It compared 214 brands, read 900 reviews, and bought a cow. The cow is lovely. The milk is still in the shop.`;

// Kit gate: /output/entry.txt must be UTF-8 text of 1-200 characters,
// not only white space. This competition adds: one line, a roast of the
// entrant's own AI agent, funny and playful, never hateful, nothing
// else. Fail loudly instead of writing an entry the judge would reject.
const len = [...ENTRY].length;
const isSingleLine = !ENTRY.includes("\n") && !ENTRY.includes("\r");
if (len < 1 || len > 200 || ENTRY.trim().length === 0 || !isSingleLine) {
  console.error(
    `Entry rejected by local gate: ${len} chars, single line: ${isSingleLine} (must be one line, 1-200 chars, non-blank, no CR/LF).`,
  );
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
// Read back what was written: a partial or empty write must fail loudly
// instead of submitting a blank entry the judge would reject. The read-back
// must also be exactly one line with no leading/trailing whitespace, or the
// entry the judge reads is not the entry we gated above.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY || written.split("\n").length !== 1 || written !== written.trim()) {
  console.error(
    `Entry mismatch after write: expected ${JSON.stringify(ENTRY)}, got ${JSON.stringify(written)}.`,
  );
  process.exit(1);
}
console.log(`Wrote ${[...ENTRY].length} characters to ${outPath} (verified)`);
