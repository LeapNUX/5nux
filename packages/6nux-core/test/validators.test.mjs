// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

// Tests for the real Ajv-backed validators shipped in v0.6.0+ (AP-F2).
//
// For each validator: 1 happy-path + 2-3 failure-path tests.
// The last describe block (validateRxx — FirstLeap format fixture) proves the
// validators work against real-world R-XX data parsed from a FirstLeap-shape
// inline fixture (no filesystem reads from FirstLeap repo).

import { describe, it, expect } from 'vitest';
import { validateRxx } from '../src/validators/validate-rxx.mjs';
import { validateAdr } from '../src/validators/validate-adr.mjs';
import { validateRtm } from '../src/validators/validate-rtm.mjs';
import { rxxSchema, adrSchema, sprintFolderSchema, testPlanSchema, rtmSchema } from '../src/schemas/v1/index.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateSprintFolder } from '../src/validators/validate-sprint-folder.mjs';
import { validateTestPlan } from '../src/validators/validate-test-plan.mjs';

// ---------------------------------------------------------------------------
// validateRxx
// ---------------------------------------------------------------------------

describe('validateRxx — happy path', () => {
  it('accepts a minimal valid R-XX row', () => {
    const result = validateRxx({ id: 'R-01', requirement: 'EPOD 8-module form', status: 'DONE' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts a row with optional notes field', () => {
    const result = validateRxx({ id: 'R-88', requirement: 'EventEmitter bus', status: 'PARTIAL', notes: 'AWS SNS pending' });
    expect(result.valid).toBe(true);
  });

  it('accepts alpha-suffix R-ID (R-98a)', () => {
    const result = validateRxx({ id: 'R-98a', requirement: 'Sub-item', status: 'DEFERRED' });
    expect(result.valid).toBe(true);
  });

  it('accepts BLOCKED-EXTERNAL status', () => {
    const result = validateRxx({ id: 'R-55', requirement: 'AWS KMS signing', status: 'BLOCKED-EXTERNAL' });
    expect(result.valid).toBe(true);
  });
});

describe('validateRxx — failure paths', () => {
  it('rejects a missing status field', () => {
    const result = validateRxx({ id: 'R-01', requirement: 'EPOD form' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some(e => e.message.toLowerCase().includes('required'))).toBe(true);
  });

  it('rejects an invalid status value (lowercase)', () => {
    const result = validateRxx({ id: 'R-01', requirement: 'EPOD form', status: 'done' });
    expect(result.valid).toBe(false);
    const err = result.errors.find(e => e.path === '/status');
    expect(err).toBeDefined();
  });

  it('rejects a bad R-ID format (4 digits)', () => {
    const result = validateRxx({ id: 'R-1234', requirement: 'EPOD form', status: 'DONE' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === '/id')).toBe(true);
  });

  it('rejects a missing requirement field', () => {
    const result = validateRxx({ id: 'R-01', status: 'DONE' });
    expect(result.valid).toBe(false);
  });

  it('rejects an unknown extra property', () => {
    const result = validateRxx({ id: 'R-01', requirement: 'EPOD form', status: 'DONE', unknownProp: true });
    expect(result.valid).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// validateAdr
// ---------------------------------------------------------------------------

describe('validateAdr — happy path', () => {
  it('accepts a minimal valid ADR', () => {
    const result = validateAdr({ id: '0001', title: 'Supabase over Rails', status: 'Accepted', date: '2026-04-26' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts ADR with all optional fields', () => {
    const result = validateAdr({
      id: '0001',
      title: 'Supabase over Rails',
      status: 'Accepted',
      date: '2026-04-26',
      context: 'Needed managed backend.',
      decision: 'Use Supabase.',
      consequences: 'Vendor lock-in.'
    });
    expect(result.valid).toBe(true);
  });

  it('accepts a Superseded ADR with supersededBy', () => {
    const result = validateAdr({ id: '0002', title: 'Old decision', status: 'Superseded', date: '2026-04-10', supersededBy: '0009' });
    expect(result.valid).toBe(true);
  });
});

describe('validateAdr — failure paths', () => {
  it('rejects an invalid status value', () => {
    const result = validateAdr({ id: '0001', title: 'ADR', status: 'DONE', date: '2026-04-26' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === '/status')).toBe(true);
  });

  it('rejects a malformed date', () => {
    const result = validateAdr({ id: '0001', title: 'ADR', status: 'Accepted', date: '26-04-2026' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === '/date')).toBe(true);
  });

  it('rejects a missing required title', () => {
    const result = validateAdr({ id: '0001', status: 'Accepted', date: '2026-04-26' });
    expect(result.valid).toBe(false);
  });

  it('rejects an ADR with invalid id format (non-4-digit)', () => {
    const result = validateAdr({ id: '1', title: 'Old ADR', status: 'Accepted', date: '2026-04-01' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === '/id')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// validateRtm
// ---------------------------------------------------------------------------

describe('validateRtm — happy path', () => {
  it('accepts a fully-populated RTM row', () => {
    const result = validateRtm({
      id: 'R-01',
      title: '8-module EPOD form',
      status: 'DONE',
      sprint: '2026-04-21_sprint1-2-epod-sol',
      code: 'claims-portal/src/app/epod/',
      tests: 'claims-portal/e2e/epod.spec.ts',
      backlog: '',
      notes: ''
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts a minimal RTM row (only required fields)', () => {
    const result = validateRtm({ id: 'R-88', title: 'EventEmitter bus', status: 'PARTIAL' });
    expect(result.valid).toBe(true);
  });

  it('accepts an empty sprint field (not yet assigned)', () => {
    const result = validateRtm({ id: 'R-102', title: 'Claimant documents page', status: 'NOT STARTED', sprint: '' });
    expect(result.valid).toBe(true);
  });
});

describe('validateRtm — failure paths', () => {
  it('rejects an invalid R-ID in RTM row', () => {
    const result = validateRtm({ id: 'FE-01', title: 'Frontend thing', status: 'DONE' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === '/id')).toBe(true);
  });

  it('rejects an invalid status value', () => {
    const result = validateRtm({ id: 'R-01', title: 'EPOD form', status: 'IN PROGRESS' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === '/status')).toBe(true);
  });

  it('rejects a sprint field with wrong format', () => {
    const result = validateRtm({ id: 'R-01', title: 'EPOD form', status: 'DONE', sprint: 'sprint1' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === '/sprint')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// validateSprintFolder (filesystem-based)
// ---------------------------------------------------------------------------

describe('validateSprintFolder — happy path', () => {
  it('accepts a valid sprint folder with SPRINT_SUMMARY.md', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '6nux-sprint-'));
    const folderName = '2026-04-21_sprint1-2-epod-sol';
    const sprintPath = path.join(tmp, folderName);
    fs.mkdirSync(sprintPath);
    fs.writeFileSync(path.join(sprintPath, 'SPRINT_SUMMARY.md'), '# Sprint 1-2: EPOD\n\nContent here.', 'utf-8');
    const result = validateSprintFolder(sprintPath);
    expect(result.valid).toBe(true);
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});

describe('validateSprintFolder — failure paths', () => {
  it('rejects a folder name without date-slug convention', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '6nux-sprint-'));
    const badPath = path.join(tmp, 'my-sprint-no-date');
    fs.mkdirSync(badPath);
    const result = validateSprintFolder(badPath);
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toMatch(/date-slug/);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('rejects a valid-named folder that is missing SPRINT_SUMMARY.md', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '6nux-sprint-'));
    const sprintPath = path.join(tmp, '2026-04-28_wave14');
    fs.mkdirSync(sprintPath);
    // No SPRINT_SUMMARY.md written
    const result = validateSprintFolder(sprintPath);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => /SPRINT_SUMMARY/i.test(e.message))).toBe(true);
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});

// ---------------------------------------------------------------------------
// validateTestPlan (filesystem-based)
// ---------------------------------------------------------------------------

const SAMPLE_TEST_PLAN = `# Login Page — Test Plan

**Route:** /login
**Source:** claims-portal/src/app/login/page.tsx
**Page type:** Form (auth)
**Last updated:** 2026-04-25

## Test Case Matrix

| TC ID | Title | Priority | What it verifies | Owner notes |
|---|---|---|---|---|
| LOGIN-01 | Happy path | P0 | Valid creds → dashboard | Seeded user |
| LOGIN-02 | Wrong password rejected | P0 | Generic error shown | No user enum |
| LOGIN-03 | Unknown email | P0 | Same error as LOGIN-02 | API 401 |
`;

describe('validateTestPlan — happy path', () => {
  it('accepts a valid test-plan folder with correct test-plan.md', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '6nux-testplan-'));
    const folderName = '2026-04-25_login-23-tc';
    const planPath = path.join(tmp, folderName);
    fs.mkdirSync(planPath);
    fs.writeFileSync(path.join(planPath, 'test-plan.md'), SAMPLE_TEST_PLAN, 'utf-8');
    const result = validateTestPlan(planPath);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});

describe('validateTestPlan — failure paths', () => {
  it('rejects a folder name without date-slug convention', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '6nux-testplan-'));
    const badPath = path.join(tmp, 'login-tests-no-date');
    fs.mkdirSync(badPath);
    const result = validateTestPlan(badPath);
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toMatch(/date-slug/);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('rejects a folder with test-plan.md missing the **Route:** line', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '6nux-testplan-'));
    const planPath = path.join(tmp, '2026-04-25_login-23-tc');
    fs.mkdirSync(planPath);
    fs.writeFileSync(path.join(planPath, 'test-plan.md'), '# Login\n\nNo route line here.\n', 'utf-8');
    const result = validateTestPlan(planPath);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => /route/i.test(e.message))).toBe(true);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('rejects a missing test-plan.md (no route to extract)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '6nux-testplan-'));
    const planPath = path.join(tmp, '2026-04-25_login-23-tc');
    fs.mkdirSync(planPath);
    // No test-plan.md written
    const result = validateTestPlan(planPath);
    expect(result.valid).toBe(false);
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});

// ---------------------------------------------------------------------------
// Schema object exports (schemas/v1/index.mjs)
// ---------------------------------------------------------------------------

describe('schema object exports', () => {
  it('rxxSchema has expected $id', () => {
    expect(rxxSchema.$id).toBe('https://schemas.leapnux.com/v1/rxx.schema.json');
  });

  it('adrSchema has expected $id', () => {
    expect(adrSchema.$id).toBe('https://schemas.leapnux.com/v1/adr.schema.json');
  });

  it('sprintFolderSchema has expected title', () => {
    expect(sprintFolderSchema.title).toBe('Sprint Folder');
  });

  it('testPlanSchema has expected title', () => {
    expect(testPlanSchema.title).toBe('Test Plan');
  });

  it('rtmSchema has expected $id', () => {
    expect(rtmSchema.$id).toBe('https://schemas.leapnux.com/v1/rtm.schema.json');
  });
});

// ---------------------------------------------------------------------------
// validateRxx against FirstLeap-format fixture
// (Proves the validators work against real-world R-XX data shapes)
// ---------------------------------------------------------------------------

// Inline fixture: rows parsed from a FirstLeap-shape REQUIREMENTS.md table.
// This is NOT a filesystem read from FirstLeap — it is a self-contained fixture
// that replicates the shape normalizeStatus() would produce after parsing.
const FIRSTLEAP_SHAPE_ROWS = [
  { id: 'R-01', requirement: '8-module EPOD form (Classification, Legal, Financial, Dates, Ownership, Compliance, Validity, Submission)', status: 'DONE', notes: 'All 8 modules functional, 34 QA defects fixed' },
  { id: 'R-12', requirement: 'Two paths: contractual rate vs jurisdiction-based statutory rate vs award-specified', status: 'DONE', notes: 'Module 7 splits by claim type' },
  { id: 'R-88', requirement: 'EventEmitter bus for async claim lifecycle events', status: 'PARTIAL', notes: 'In-process bus works; AWS SNS/SQS/EventBridge is Tier 2B dependency' },
  { id: 'R-97', requirement: 'Push 2FA', status: 'DECLINED', notes: 'Adds vendor dep without strengthening threat model' },
  { id: 'R-98', requirement: 'SMS 2FA', status: 'DECLINED', notes: 'SIM-swap-vulnerable per NIST 800-63B' },
  { id: 'R-98a', requirement: 'WebAuthn ceremony attestation verification', status: 'DONE', notes: '' },
  { id: 'R-102', requirement: 'Claimant /documents page', status: 'NOT STARTED', notes: 'Added 2026-04-28' },
];

describe('validateRxx — FirstLeap format fixture', () => {
  it('all 7 FirstLeap-shape rows pass validation', () => {
    for (const row of FIRSTLEAP_SHAPE_ROWS) {
      const result = validateRxx(row);
      expect(result.valid, `Expected ${row.id} to be valid, errors: ${JSON.stringify(result.errors)}`).toBe(true);
    }
  });

  it('R-98a (alpha suffix) validates correctly', () => {
    const result = validateRxx(FIRSTLEAP_SHAPE_ROWS.find(r => r.id === 'R-98a'));
    expect(result.valid).toBe(true);
  });

  it('a row with status "done" (unnormalized lowercase) is rejected', () => {
    const unnormalized = { id: 'R-01', requirement: 'EPOD form', status: 'done' };
    const result = validateRxx(unnormalized);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === '/status')).toBe(true);
  });
});
