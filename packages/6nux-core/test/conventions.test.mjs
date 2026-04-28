// Copyright (c) 2026 Chu Ling
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from 'vitest';
import { KEBAB_RE, DATE_SLUG_RE, VALID_DATE_RE, STATUSES, PATHS, SCHEMAS } from '../src/conventions.mjs';

describe('KEBAB_RE', () => {
  it('matches simple single-word slug', () => {
    expect(KEBAB_RE.test('hello')).toBe(true);
  });

  it('matches multi-word kebab slug', () => {
    expect(KEBAB_RE.test('my-sprint-1')).toBe(true);
  });

  it('matches slug with digits', () => {
    expect(KEBAB_RE.test('v0-4-2')).toBe(true);
  });

  it('rejects slug with uppercase letters', () => {
    expect(KEBAB_RE.test('My-Sprint')).toBe(false);
  });

  it('rejects slug with underscores', () => {
    expect(KEBAB_RE.test('my_sprint')).toBe(false);
  });

  it('rejects slug with leading hyphen', () => {
    expect(KEBAB_RE.test('-bad')).toBe(false);
  });

  it('rejects slug with trailing hyphen', () => {
    expect(KEBAB_RE.test('bad-')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(KEBAB_RE.test('')).toBe(false);
  });

  it('rejects slug with consecutive hyphens', () => {
    expect(KEBAB_RE.test('bad--slug')).toBe(false);
  });
});

describe('DATE_SLUG_RE', () => {
  it('matches a valid date-slug folder name', () => {
    expect(DATE_SLUG_RE.test('2026-04-28_my-sprint')).toBe(true);
  });

  it('captures date and slug parts', () => {
    const m = DATE_SLUG_RE.exec('2026-04-28_my-sprint');
    expect(m).not.toBeNull();
    expect(m[1]).toBe('2026-04-28');
    expect(m[2]).toBe('my-sprint');
  });

  it('does not match folder without date prefix', () => {
    expect(DATE_SLUG_RE.test('my-sprint')).toBe(false);
  });

  it('does not match folder with wrong separator', () => {
    expect(DATE_SLUG_RE.test('2026-04-28-my-sprint')).toBe(false);
  });
});

describe('VALID_DATE_RE', () => {
  it('matches a valid YYYY-MM-DD string', () => {
    expect(VALID_DATE_RE.test('2026-04-27')).toBe(true);
  });

  it('rejects a date with slashes', () => {
    expect(VALID_DATE_RE.test('2026/04/27')).toBe(false);
  });

  it('rejects incomplete date', () => {
    expect(VALID_DATE_RE.test('2026-04')).toBe(false);
  });
});

describe('STATUSES', () => {
  it('contains all 7 known statuses', () => {
    expect(STATUSES).toHaveLength(7);
    expect(STATUSES).toContain('DONE');
    expect(STATUSES).toContain('BLOCKED');
    expect(STATUSES).toContain('PARTIAL');
    expect(STATUSES).toContain('NOT STARTED');
    expect(STATUSES).toContain('DECLINED');
    expect(STATUSES).toContain('DEFERRED');
    expect(STATUSES).toContain('FAKE');
  });
});

describe('PATHS', () => {
  it('exposes requirements path', () => {
    expect(PATHS.requirements).toBe('requirements/REQUIREMENTS.md');
  });

  it('exposes risksDir and risks as separate keys', () => {
    expect(PATHS.risksDir).toBe('requirements/risks');
    expect(PATHS.risks).toBe('requirements/risks/risks.md');
  });

  it('exposes sprint-log path', () => {
    expect(PATHS.sprintLog).toBe('sprint-log/');
  });
});

describe('SCHEMAS', () => {
  it('has rxx v1', () => {
    expect(SCHEMAS.rxx).toBe('v1');
  });
  it('has rtm v1', () => {
    expect(SCHEMAS.rtm).toBe('v1');
  });
});
