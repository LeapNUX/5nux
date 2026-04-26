// Copyright (c) 2026 Testing Hub Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * src/commands/discover.mjs
 *
 * Implements `testing-hub discover <url>`.
 *
 * v0.1 STUB — this command describes what the v0.2 LLM agent will do and
 * guides the user through the manual equivalent. No LLM calls are made.
 *
 * v0.2 plan:
 *   1. Launch a headless Chromium via Playwright.
 *   2. Navigate to <url>.
 *   3. Serialize the full DOM + ARIA tree + computed styles snapshot.
 *   4. Send to Claude (claude-sonnet-4-6) with the prompt template below.
 *   5. Stream the response into scenarios.md in the cwd.
 *   6. Append a [VERIFY] footer reminding the human to review all generated TCs.
 *
 * Cost estimate (v0.2): ~$0.15–$0.40 per page depending on DOM size.
 * Requires: CLAUDE_API_KEY environment variable.
 *
 * =============================================================================
 * V0.2 PROMPT TEMPLATE (for implementers):
 * =============================================================================
 *
 * SYSTEM:
 *   You are a senior QA engineer specializing in regulated web applications.
 *   You write test cases in Given/When/Then format following ISTQB and OWASP
 *   ASVS 4.0 testing principles. Every test case you produce is tagged:
 *     - Priority: P0 (smoke/blocker), P1 (critical path), P2 (edge case)
 *     - Category: FUNCTIONAL | SECURITY | ACCESSIBILITY | PERFORMANCE | ERROR-HANDLING
 *     - Standards: list applicable NIST, OWASP, WCAG references
 *   You ALWAYS add [VERIFY] to LLM-generated content that requires human confirmation.
 *   You NEVER invent behavior. If you are uncertain, emit a [VERIFY] marker.
 *
 * USER:
 *   I am auditing the page at: {{url}}
 *
 *   Below is the DOM snapshot (ARIA tree + interactive elements):
 *   ```
 *   {{dom_snapshot}}
 *   ```
 *
 *   TASK: Generate a comprehensive set of test scenarios for this page.
 *
 *   For EACH interactive element (inputs, buttons, links, dropdowns, modals,
 *   accordions, tooltips, file uploads, date pickers, infinite scroll areas):
 *
 *     1. Write a TC-XX entry in this exact format:
 *
 *        ## TC-01 — [Short title]
 *        **Priority**: P0 | P1 | P2
 *        **Category**: FUNCTIONAL | SECURITY | ACCESSIBILITY | PERFORMANCE | ERROR-HANDLING
 *        **Standards**: [e.g. OWASP ASVS 2.1.1, WCAG 2.2 SC 1.3.1, NIST SP 800-63B 5.1]
 *
 *        **Given** [precondition: user role, auth state, data state]
 *        **When** [specific action — be precise about input values and sequences]
 *        **Then** [expected outcome — be specific about UI state, API calls, data changes]
 *
 *        > [VERIFY] Confirm behavior matches product specification before execution.
 *
 *   2. Cover ALL of these test categories before moving to the next element:
 *      - Happy path (P0/P1)
 *      - Boundary values (P1/P2)
 *      - Invalid/error inputs (P1)
 *      - Empty/null states (P1)
 *      - Permission edge cases (P0 if auth-gated)
 *      - Accessibility: keyboard navigation, screen reader, focus management (P1)
 *      - Security: XSS input, SQL injection attempt, CSRF token presence (P1 for forms)
 *
 *   3. After all per-element scenarios, add a GLOBAL section:
 *      ## Global Scenarios
 *      - Page load performance (P0)
 *      - Browser back/forward navigation (P1)
 *      - Mobile viewport (375px) layout (P1)
 *      - Session expiry while on page (P0 if authenticated)
 *      - Network error / 500 response handling (P1)
 *
 *   OUTPUT FORMAT: Pure markdown. Start with a YAML frontmatter block:
 *   ---
 *   slug: {{slug}}
 *   url: {{url}}
 *   generated_by: testing-hub discover v0.2
 *   generated_at: {{timestamp}}
 *   tc_count: [total number of TCs]
 *   review_required: true
 *   ---
 *
 *   Then emit each TC in order. No introductory prose. Just the frontmatter + TCs.
 *
 * =============================================================================
 */

import path from 'path';
import fs from 'fs';

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * @param {string} url  Target page URL
 * @param {{
 *   slug:  string | undefined,
 *   out:   string | undefined,
 *   json:  boolean,
 * }} opts
 */
export async function runDiscover(url, opts = {}) {
  const { slug = deriveSlug(url), out = '.', json = false } = opts;

  log(json, { event: 'discover.stub', url, slug, version: 'v0.1' });

  if (!json) {
    console.log('');
    console.log('  testing-hub discover — v0.1 stub');
    console.log('  ─────────────────────────────────────────────────────────');
    console.log(`  URL   : ${url}`);
    console.log(`  Slug  : ${slug}`);
    console.log('');
    console.log('  In v0.2, this command will:');
    console.log('    1. Launch headless Chromium and navigate to the URL.');
    console.log('    2. Serialize the DOM + ARIA tree (interactive elements,');
    console.log('       states, error paths, keyboard navigation graph).');
    console.log('    3. Send the snapshot to Claude with a structured prompt');
    console.log('       (see the prompt template in src/commands/discover.mjs).');
    console.log('    4. Stream the response into scenarios.md — one TC-XX');
    console.log('       entry per element per category (functional, security,');
    console.log('       accessibility, error-handling).');
    console.log('    5. Append [VERIFY] markers on every LLM-generated cell.');
    console.log('    6. Cost: ~$0.15–$0.40 per page. Requires CLAUDE_API_KEY.');
    console.log('');
    console.log('  For now, manually create scenarios.md:');
    console.log('');

    // Write a template scenarios.md for the user to fill in
    const scenariosPath = path.resolve(out, `${slug}-scenarios.md`);
    if (!fs.existsSync(scenariosPath)) {
      fs.writeFileSync(scenariosPath, buildScenariosTemplate(url, slug), 'utf-8');
      console.log(`  Template written: ${scenariosPath}`);
      console.log('');
      console.log('  Next steps:');
      console.log(`    1. Open ${scenariosPath}`);
      console.log(`    2. Fill in TC-01..TC-0N for each interactive element`);
      console.log(`    3. Run: testing-hub plan ${slug}`);
    } else {
      console.log(`  Template already exists: ${scenariosPath} — not overwritten`);
    }

    console.log('');
    console.log('  Upgrade to v0.2 for automatic TC generation.');
    console.log('  Set CLAUDE_API_KEY and watch this stub become live.');
    console.log('');
  } else {
    process.stdout.write(
      JSON.stringify({
        event: 'discover.stub.done',
        url,
        slug,
        message: 'v0.1 stub — see v0.2 roadmap for LLM-powered TC generation',
      }) + '\n',
    );
  }
}

// ── Template builder ─────────────────────────────────────────────────────────

function buildScenariosTemplate(url, slug) {
  const date = new Date().toISOString().slice(0, 10);
  return `---
slug: ${slug}
url: ${url}
generated_by: testing-hub discover v0.1 (manual template)
generated_at: ${date}
tc_count: 0
review_required: true
status: DRAFT
---

# Scenarios: ${slug}

> Fill in each TC-XX below. In v0.2, \`testing-hub discover ${url}\` will
> generate these automatically using a Claude LLM agent.
>
> All LLM-generated content will carry a [VERIFY] marker until human-attested.

<!-- ─── INTERACTIVE ELEMENTS ─────────────────────────────────────────────── -->

## TC-01 — [Short descriptive title]

**Priority**: P0 | P1 | P2  _(delete two)_
**Category**: FUNCTIONAL | SECURITY | ACCESSIBILITY | PERFORMANCE | ERROR-HANDLING  _(delete all but one)_
**Standards**: [e.g. OWASP ASVS 2.1.1, WCAG 2.2 SC 1.3.1]

**Given** [precondition — user role, auth state, data state]
**When** [precise action — include specific input values]
**Then** [expected outcome — UI state, API calls, data changes]

<!-- Add more TC-XX blocks following the same pattern. -->

<!-- ─── GLOBAL SCENARIOS ───────────────────────────────────────────────────── -->

## Global Scenarios

### TC-GX-01 — Page load within SLA

**Priority**: P0
**Category**: PERFORMANCE

**Given** the user has a stable broadband connection
**When** they navigate to \`${url}\`
**Then** the page is interactive (LCP) within 2.5 seconds

### TC-GX-02 — Session expiry handling

**Priority**: P0
**Category**: FUNCTIONAL

**Given** the user is authenticated and the session token has expired
**When** they attempt any authenticated action
**Then** they are redirected to /login with a clear session-expired message

### TC-GX-03 — Network error graceful degradation

**Priority**: P1
**Category**: ERROR-HANDLING

**Given** the network request to the API fails (simulate 500)
**When** the page attempts to load data
**Then** an error state is shown (not a blank page or unhandled exception)
`;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function deriveSlug(url) {
  try {
    const u = new URL(url);
    const segments = u.pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
    const slug = segments.length > 0 ? segments.join('-') : u.hostname.replace(/\./g, '-');
    return slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 40) || 'page';
  } catch {
    return 'page';
  }
}

function log(json, payload) {
  if (json) process.stdout.write(JSON.stringify(payload) + '\n');
}
