#!/usr/bin/env node
// Copyright (c) 2026 Chu Ling
// SPDX-License-Identifier: Apache-2.0

/**
 * bin/testing-hub.mjs
 *
 * CLI entry point for Testing Hub.
 *
 * Verbs:
 *   init <slug>      — scaffold a per-page test-pass folder from templates
 *   report <folder>  — generate XLSX + self-contained HTML report
 *   validate <folder>— lint markdown frontmatter, check R-XX format consistency
 *   demo             — run bundled demo against examples/demo-dashboard/
 *   doctor           — preflight checks for Playwright, Node, Supabase config
 *
 * Exit codes:
 *   0  success
 *   1  generic error
 *   2  missing or invalid input
 *   3  parse error (malformed markdown / frontmatter)
 *   4  render failed (XLSX or HTML generation error)
 *
 * Global flags:
 *   --json           — emit all output as newline-delimited JSON records
 *   --help           — show help for any command
 */

import { Command } from 'commander';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(__dirname, '..', 'package.json');
let version = '0.1.0';
try {
  version = JSON.parse(readFileSync(pkgPath, 'utf-8')).version ?? version;
} catch {
  // package.json not present during development — use default
}

// ── Command imports ──────────────────────────────────────────────────────────

const { runInit } = await import('../src/commands/init.mjs');
const { runReport } = await import('../src/commands/report.mjs');
const { runValidate } = await import('../src/commands/validate.mjs');
const { runDemo } = await import('../src/commands/demo.mjs');
const { runDoctor } = await import('../src/commands/doctor.mjs');

// ── Root program ─────────────────────────────────────────────────────────────

const program = new Command();

program
  .name('testing-hub')
  .description('Testing Hub — structured test-pass documentation for regulated web apps')
  .version(version)
  .option('--json', 'emit all output as newline-delimited JSON records');

// ── init ─────────────────────────────────────────────────────────────────────

program
  .command('init <slug>')
  .description(
    'Scaffold a per-page test-pass folder using templates. ' +
    'Creates testing-log/<date>_<slug>/ with test-plan.md, spec.ts, README.md, evidence/.',
  )
  .option('--industry <industry>', 'industry profile to use for standards alignment', 'general')
  .option('--out <dir>', 'output root (default: ./testing-log/)', './testing-log')
  .action(async (slug, opts, cmd) => {
    const global = cmd.parent.opts();
    try {
      await runInit(slug, { industry: opts.industry, outDir: opts.out, json: global.json });
    } catch (err) {
      emit(global.json, { error: err.message });
      process.exit(err.exitCode ?? 1);
    }
  });

// ── report ───────────────────────────────────────────────────────────────────

program
  .command('report <folder>')
  .description(
    'Generate XLSX + self-contained HTML report from test-plan.md + execution-log.md ' +
    'inside <folder>. Writes report.xlsx and report.html alongside the source files.',
  )
  .option('--plan-only', 'render without execution results (PLAN ONLY badge in header)')
  .option('--open', 'open the generated HTML in the default browser after rendering')
  .action(async (folder, opts, cmd) => {
    const global = cmd.parent.opts();
    try {
      await runReport(folder, { planOnly: opts.planOnly, open: opts.open, json: global.json });
    } catch (err) {
      emit(global.json, { error: err.message });
      process.exit(err.exitCode ?? 4);
    }
  });

// ── validate ─────────────────────────────────────────────────────────────────

program
  .command('validate <folder>')
  .description(
    'Lint markdown frontmatter in <folder>: check required keys, R-XX format, TC-ID ' +
    'consistency, industry field, status taxonomy. Exits non-zero if errors found.',
  )
  .option('--strict', 'treat warnings as errors')
  .action(async (folder, opts, cmd) => {
    const global = cmd.parent.opts();
    try {
      await runValidate(folder, { strict: opts.strict, json: global.json });
    } catch (err) {
      emit(global.json, { error: err.message });
      process.exit(err.exitCode ?? 3);
    }
  });

// ── demo ─────────────────────────────────────────────────────────────────────

program
  .command('demo')
  .description(
    'Run the bundled demo test suite against examples/demo-dashboard/. ' +
    'Opens the resulting HTML report in your default browser. ' +
    'The fastest path to "aha" for first-time users.',
  )
  .action(async (_opts, cmd) => {
    const global = cmd.parent.opts();
    try {
      await runDemo({ json: global.json });
    } catch (err) {
      emit(global.json, { error: err.message });
      process.exit(err.exitCode ?? 1);
    }
  });

// ── doctor ───────────────────────────────────────────────────────────────────

program
  .command('doctor')
  .description(
    'Preflight checks: Node version, Playwright browsers, .env.local variables, ' +
    'Supabase MFA toggle mismatch (Enroll vs Verify), prod-build vs dev-server detection.',
  )
  .option('--check <check>', 'run only a specific check (node|playwright|env|supabase)')
  .option('--project-ref <ref>', 'Supabase project ref (required for --check supabase)')
  .action(async (opts, cmd) => {
    const global = cmd.parent.opts();
    try {
      await runDoctor({
        check: opts.check,
        projectRef: opts.projectRef,
        json: global.json,
      });
    } catch (err) {
      emit(global.json, { error: err.message });
      process.exit(err.exitCode ?? 1);
    }
  });

// ── helpers ──────────────────────────────────────────────────────────────────

function emit(isJson, payload) {
  if (isJson) {
    process.stdout.write(JSON.stringify(payload) + '\n');
  }
}

// ── parse ────────────────────────────────────────────────────────────────────

program.parseAsync(process.argv).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
