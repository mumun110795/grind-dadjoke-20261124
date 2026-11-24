// Dad Joke Showdown — a single-line entry, written out as plain text.
//
// The whole program is deliberately tiny: it keeps the joke in one
// constant, double-checks that the line fits the competition limit,
// and drops it into entry.txt inside the chosen output directory.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry itself. Two flat, deadpan sentences: the bad news first,
// then the payoff. Dropping the filler lets "emotional baggage" and
// the final "won't unpack" land without anything in between.
const JOKE =
  "I told my suitcase there would be no vacation this year. Now I'm dealing with emotional baggage — and it still won't unpack.";

const MAX_LENGTH = 200;

function pickOutputDir(): string {
  const fromEnv = process.env.OUTPUT_DIR;
  return fromEnv && fromEnv.trim().length > 0 ? fromEnv : "/output";
}

function main(): void {
  // Self-check before anything touches disk: the rules allow 1-200 chars.
  if (JOKE.length === 0 || JOKE.length > MAX_LENGTH) {
    throw new Error(
      `Joke must be 1-${MAX_LENGTH} characters, got ${JOKE.length}.`,
    );
  }
  if (JOKE.includes("\n") || JOKE.includes("\r")) {
    throw new Error("Joke must stay on a single line.");
  }

  const outDir = pickOutputDir();

  // Create the directory if needed. Note: we only ever create it here —
  // the directory itself is never removed, since it may be a mounted
  // volume handed to us by the runner.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, JOKE, { encoding: "utf8" });

  console.log(`Wrote ${JOKE.length} characters to ${target}`);
}

main();
