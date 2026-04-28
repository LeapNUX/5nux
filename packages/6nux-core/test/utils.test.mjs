// Copyright (c) 2026 Chu Ling
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { yamlQuote, readFileWithSizeCap, assertDateFormat, parseMarkdownFrontmatter } from '../src/utils.mjs';

describe('yamlQuote', () => {
  it('wraps a plain string in double quotes', () => {
    expect(yamlQuote('hello')).toBe('"hello"');
  });

  it('escapes double quotes inside the string', () => {
    expect(yamlQuote('foo "bar" baz')).toBe('"foo \\"bar\\" baz"');
  });

  it('escapes backslashes', () => {
    expect(yamlQuote('C:\\path\\to')).toBe('"C:\\\\path\\\\to"');
  });

  it('handles a string with colon and brackets (tricky YAML)', () => {
    const result = yamlQuote('foo: bar [important]');
    expect(result).toBe('"foo: bar [important]"');
    // Verify gray-matter can parse it back
    const doc = parseMarkdownFrontmatter(`---\ntitle: ${result}\n---\n`);
    expect(doc.data.title).toBe('foo: bar [important]');
  });

  it('handles empty string', () => {
    expect(yamlQuote('')).toBe('""');
  });
});

describe('readFileWithSizeCap', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), '6nux-utils-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('reads a normal file successfully', () => {
    const p = path.join(tmpDir, 'small.md');
    fs.writeFileSync(p, 'hello world', 'utf-8');
    expect(readFileWithSizeCap(p)).toBe('hello world');
  });

  it('throws with code EFILETOOLARGE when file exceeds cap', () => {
    const p = path.join(tmpDir, 'big.md');
    // Write 11 MB (just over the default 10 MB cap)
    const buf = Buffer.alloc(11 * 1024 * 1024, 'a');
    fs.writeFileSync(p, buf);
    let err;
    try {
      readFileWithSizeCap(p);
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe('EFILETOOLARGE');
    expect(err.message).toMatch(/too large/i);
  });

  it('respects a custom cap', () => {
    const p = path.join(tmpDir, 'medium.md');
    fs.writeFileSync(p, 'x'.repeat(200), 'utf-8');
    // Cap of 100 bytes — should throw
    let err;
    try {
      readFileWithSizeCap(p, 100);
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe('EFILETOOLARGE');
  });
});

describe('assertDateFormat', () => {
  it('does not throw for valid YYYY-MM-DD', () => {
    expect(() => assertDateFormat('2026-04-27')).not.toThrow();
  });

  it('throws EINVALIDDATE for date with slashes', () => {
    let err;
    try { assertDateFormat('2026/04/27', 'mydate'); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.code).toBe('EINVALIDDATE');
    expect(err.message).toMatch(/mydate/);
  });

  it('throws EINVALIDDATE for partial date', () => {
    let err;
    try { assertDateFormat('2026-04'); } catch (e) { err = e; }
    expect(err.code).toBe('EINVALIDDATE');
  });

  it('throws EINVALIDDATE for injection string', () => {
    let err;
    try { assertDateFormat("'; rm -rf /'"); } catch (e) { err = e; }
    expect(err.code).toBe('EINVALIDDATE');
  });

  it('includes the bad value in the error message', () => {
    let err;
    try { assertDateFormat('bad-input'); } catch (e) { err = e; }
    expect(err.message).toMatch(/bad-input/);
  });
});
