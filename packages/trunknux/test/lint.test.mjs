import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { lint } from '../src/commands/lint.mjs';

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'trunknux-lint-'));
  vi.spyOn(process, 'exit').mockImplementation((code) => {
    throw Object.assign(new Error(`process.exit(${code})`), { exitCode: code });
  });
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  vi.restoreAllMocks();
});

function run(opts = {}) {
  return lint({ cwd: tmpDir, ...opts });
}

function makeSprintFolder(name, readme = true, frontmatter = true) {
  const dir = path.join(tmpDir, 'sprint-log', name);
  fs.mkdirSync(dir, { recursive: true });
  if (readme) {
    const slug = name.replace(/^\d{4}-\d{2}-\d{2}_/, '');
    const date = name.slice(0, 10);
    const fm = frontmatter
      ? `---\nsprint: ${slug}\ndate: ${date}\nstatus: in-progress\n---\n`
      : '';
    fs.writeFileSync(path.join(dir, 'README.md'), `${fm}# Sprint: ${slug}\n`, 'utf8');
  }
  return dir;
}

describe('lint: no sprint-log directory', () => {
  it('exits 2 with helpful message', () => {
    expect(() => run()).toThrow(/process\.exit\(2\)/);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('No sprint-log directory found')
    );
  });

  it('outputs JSON with error when --json', () => {
    let output;
    vi.spyOn(console, 'log').mockImplementation((s) => { output = s; });
    expect(() => run({ json: true })).toThrow(/process\.exit\(2\)/);
    const parsed = JSON.parse(output);
    expect(parsed.ok).toBe(false);
  });
});

describe('lint: clean case', () => {
  it('exits 0 when all folders are valid', () => {
    makeSprintFolder('2026-04-27_my-sprint');
    makeSprintFolder('2026-04-28_another-sprint');
    expect(() => run()).toThrow(/process\.exit\(0\)/);
  });

  it('prints OK summary', () => {
    makeSprintFolder('2026-04-27_clean-sprint');
    expect(() => run()).toThrow(/process\.exit\(0\)/);
    const calls = (console.log).mock.calls.flat().join(' ');
    expect(calls).toMatch(/OK/);
  });

  it('--json output is ok:true with no errors', () => {
    makeSprintFolder('2026-04-27_json-clean');
    let output;
    vi.spyOn(console, 'log').mockImplementation((s) => { output = s; });
    expect(() => run({ json: true })).toThrow(/process\.exit\(0\)/);
    const parsed = JSON.parse(output);
    expect(parsed.ok).toBe(true);
    expect(parsed.errors).toHaveLength(0);
  });
});

describe('lint: invalid folder names', () => {
  it('errors on folder with no date prefix', () => {
    fs.mkdirSync(path.join(tmpDir, 'sprint-log', 'no-date-prefix'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'sprint-log', 'no-date-prefix', 'README.md'), '# x\n');
    expect(() => run()).toThrow(/process\.exit\(1\)/);
    const calls = (console.error).mock.calls.flat().join(' ');
    expect(calls).toMatch(/invalid-folder-name|does not match/i);
  });

  it('errors on folder with invalid date (month 13)', () => {
    fs.mkdirSync(path.join(tmpDir, 'sprint-log', '2026-13-01_bad-date'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'sprint-log', '2026-13-01_bad-date', 'README.md'), '# x\n');
    expect(() => run()).toThrow(/process\.exit\(1\)/);
  });

  it('errors on folder with non-kebab slug (underscore)', () => {
    fs.mkdirSync(path.join(tmpDir, 'sprint-log', '2026-04-27_bad_slug'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'sprint-log', '2026-04-27_bad_slug', 'README.md'), '# x\n');
    expect(() => run()).toThrow(/process\.exit\(1\)/);
    const calls = (console.error).mock.calls.flat().join(' ');
    expect(calls).toMatch(/invalid-slug|invalid slug/i);
  });
});

describe('lint: missing README', () => {
  it('errors when README.md is absent', () => {
    makeSprintFolder('2026-04-27_no-readme', false);
    expect(() => run()).toThrow(/process\.exit\(1\)/);
    const calls = (console.error).mock.calls.flat().join(' ');
    expect(calls).toMatch(/missing.*README|README.*missing/i);
  });
});

describe('lint: missing frontmatter', () => {
  it('warns when frontmatter is absent but does not error', () => {
    makeSprintFolder('2026-04-27_no-fm', true, false);
    expect(() => run()).toThrow(/process\.exit\(0\)/);
    const warnCalls = (console.warn).mock.calls.flat().join(' ');
    expect(warnCalls).toMatch(/frontmatter|WARN/i);
  });

  it('warns about missing sprint: key in frontmatter', () => {
    const dir = path.join(tmpDir, 'sprint-log', '2026-04-27_partial-fm');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'README.md'),
      '---\ndate: 2026-04-27\n---\n# Sprint\n',
      'utf8'
    );
    expect(() => run()).toThrow(/process\.exit\(0\)/);
    const warnCalls = (console.warn).mock.calls.flat().join(' ');
    expect(warnCalls).toMatch(/sprint/i);
  });
});

describe('lint: empty sprint-log', () => {
  it('exits 0 with empty message when sprint-log exists but has no subdirs', () => {
    fs.mkdirSync(path.join(tmpDir, 'sprint-log'), { recursive: true });
    expect(() => run()).toThrow(/process\.exit\(0\)/);
  });
});

// ── B1: SEC F-07 — file size cap on README.md ────────────────────────────────

describe('lint: file size cap on README (SEC F-07)', () => {
  it('emits a warning (not an error) when README.md is over 10 MB and continues', () => {
    const folderName = '2026-04-27_big-readme';
    const dir = path.join(tmpDir, 'sprint-log', folderName);
    fs.mkdirSync(dir, { recursive: true });
    // Write 11 MB README
    const big = Buffer.alloc(11 * 1024 * 1024, 'a');
    fs.writeFileSync(path.join(dir, 'README.md'), big);

    // Should NOT error (exit 1), just warn and continue — exits 0
    expect(() => run()).toThrow(/process\.exit\(0\)/);
    const warnCalls = (console.warn).mock.calls.flat().join(' ');
    expect(warnCalls).toMatch(/too large|EFILETOOLARGE/i);
  });
});

// ── B1: folder cap warning at > 1000 sprint folders ──────────────────────────

describe('lint: sprint folder cap warning', () => {
  it('emits WARN when sprint-log has > 1000 sprint folders', () => {
    // Create 1001 sprint folders with valid names
    const base = path.join(tmpDir, 'sprint-log');
    // We create 1001 folders but only check that the cap warning fires.
    // Creating 1001 full dirs is slow, so we mock readdirSync instead.
    fs.mkdirSync(base, { recursive: true });

    // Create one real valid folder to pass the "not empty" check
    const realDir = path.join(base, '2026-01-01_real-sprint');
    fs.mkdirSync(realDir, { recursive: true });
    fs.writeFileSync(
      path.join(realDir, 'README.md'),
      '---\nsprint: real-sprint\ndate: 2026-01-01\n---\n# Sprint\n',
      'utf8'
    );

    // Mock readdirSync to return 1001 valid dir entries
    const origReaddir = fs.readdirSync.bind(fs);
    vi.spyOn(fs, 'readdirSync').mockImplementationOnce((_dir) => {
      return Array.from({ length: 1001 }, (_, i) => {
        const dd = String(i + 1).padStart(2, '0');
        return `2026-01-${dd.length === 2 ? dd : '01'}_sprint-${i + 1}`;
      });
    });
    // statSync still needs to return isDirectory: true for the mocked entries
    vi.spyOn(fs, 'statSync').mockImplementation((p) => {
      if (p.includes('sprint-log') && !p.endsWith('.md')) {
        return { isDirectory: () => true };
      }
      return { isDirectory: () => false, size: 100 };
    });

    try {
      run();
    } catch (_) {
      // will throw process.exit(0) or (1) — that's fine
    }

    // Read warn calls BEFORE restoreAllMocks (which happens in afterEach)
    const warnCalls = (console.warn).mock.calls.flat().join(' ');
    vi.restoreAllMocks(); // clean up the fs mocks
    expect(warnCalls).toMatch(/1001|cap|1000/i);
  });
});
