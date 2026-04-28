// Copyright (c) 2026 Chu Ling
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from 'vitest';
import { RXX_PATTERN, todayISO, slugify, isValidSlug } from '../src/ids.mjs';

describe('RXX_PATTERN', () => {
  it('matches R-1 through R-9999', () => {
    const re = new RegExp(RXX_PATTERN.source, 'g');
    const matches = 'R-1 and R-99 and R-999 and R-9999'.match(re);
    expect(matches).toEqual(['R-1', 'R-99', 'R-999', 'R-9999']);
  });

  it('does not match R- with no digits', () => {
    const re = new RegExp(RXX_PATTERN.source, 'g');
    expect('R-X'.match(re)).toBeNull();
  });

  it('does not match R-12345 (5 digits)', () => {
    const re = new RegExp(RXX_PATTERN.source, 'g');
    // word boundary: R-12345 should not be matched as R-1234 with extra digit
    expect('R-12345'.match(re)).toBeNull();
  });
});

describe('todayISO', () => {
  it('returns a string matching YYYY-MM-DD', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('month is zero-padded', () => {
    const result = todayISO();
    const parts = result.split('-');
    expect(parts[1].length).toBe(2);
  });

  it('day is zero-padded', () => {
    const result = todayISO();
    const parts = result.split('-');
    expect(parts[2].length).toBe(2);
  });
});

describe('slugify', () => {
  it('lowercases and trims', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });

  it('converts spaces to hyphens', () => {
    expect(slugify('my sprint name')).toBe('my-sprint-name');
  });

  it('strips special characters', () => {
    expect(slugify('Use React (v18) & Vite!')).toBe('use-react-v18-vite');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('foo  --  bar')).toBe('foo-bar');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugify('---hello---')).toBe('hello');
  });

  it('returns empty string for all-special input', () => {
    expect(slugify('!!!')).toBe('');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles unicode (strips non-ascii)', () => {
    // Non-latin letters get stripped
    expect(slugify('café latte')).toBe('caf-latte');
  });

  it('preserves digits', () => {
    expect(slugify('version 42 final')).toBe('version-42-final');
  });
});

describe('isValidSlug', () => {
  it('returns true for valid kebab slug', () => {
    expect(isValidSlug('my-sprint')).toBe(true);
  });

  it('returns true for single word', () => {
    expect(isValidSlug('hello')).toBe(true);
  });

  it('returns false for slug with uppercase', () => {
    expect(isValidSlug('My-Sprint')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidSlug('')).toBe(false);
  });

  it('returns false for slug with underscore', () => {
    expect(isValidSlug('bad_slug')).toBe(false);
  });
});
