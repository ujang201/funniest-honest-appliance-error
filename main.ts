// The Funniest Honest Appliance Error — make.fun entry
// A deadpan washing machine files its own fault report.
// The program composes exactly one line (<= 200 chars) and writes it
// to /output/entry.txt. Fully deterministic: no randomness, no clock,
// no network, no environment input — the same line every run.

import { mkdirSync, writeFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// The fault report: what the machine knows about its own failure.
// ---------------------------------------------------------------------------

interface FaultReport {
  appliance: string;
  code: string;
  fault: string; // the honest, observable truth of what went wrong
  stance: string; // what the machine refuses to do about it
  demand: string; // the one thing it asks of its owner
}

const REPORT: FaultReport = {
  appliance: "washing machine",
  code: "ERROR 47",
  fault: "Unbalanced load. One sock has taken the drum hostage and refuses to negotiate.",
  stance: "I will not spin",
  demand: "until the hostage is freed.",
};

// ---------------------------------------------------------------------------
// Composer: assemble the single line in the machine's own flat voice.
// ---------------------------------------------------------------------------

function composeLine(report: FaultReport): string {
  const parts = [
    `${report.code}:`,
    report.fault,
    `${report.stance} ${report.demand}`,
  ];
  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Gate: the sealed scorer only accepts UTF-8 text of 1..200 characters,
// a single line, not only whitespace. Check that here before writing.
// ---------------------------------------------------------------------------

function validateLine(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry is ${line.length} chars, must be 1..200`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("entry has leading or trailing whitespace");
  }
}

// ---------------------------------------------------------------------------
// Main: compose, validate, write.
// ---------------------------------------------------------------------------

function main(): void {
  const line = composeLine(REPORT);
  validateLine(line);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", line + "\n", "utf8");
  console.log(line);
}

main();
