# LeapNuX 6-NUX — Premium

> The OSS gives you the **whole tree** — root, trunk, branch, leaf, fruit. Premium gives you the **soil**: hosting, multi-user backend, account-bound access, and the human time (onboarding, training, advisory) that turns the OSS into an audit-ready program.

This doc covers what LeapNuX 6-NUX premium offers today and the hosted-SaaS tier currently in rollout. For the OSS / Premium split rationale, see [`docs/MOTTO.md`](./MOTTO.md). Free-forever OSS commitments are in [`LICENSE`](../LICENSE).

---

## Two lanes

| Lane | Status | Offering |
|---|---|---|
| **Service engagements** | **Available now** | Onboarding, training, advisory, quarterly review, audit-readiness assessment — delivered by LeapNuX directly |
| **Hosted SaaS** (`leapnux.com`) | **In rollout** | Solo / Pro / Team tiers — hosted Playwright runs, multi-tenant backend, auditor portal, SSO/SCIM |

Pick a service engagement today. Reach out about hosted-SaaS access if you want early-customer pricing as we ramp.

**Contact:** `ccling1998@gmail.com`

---

## What stays free forever

The complete OSS 5-NUX stack stays Apache 2.0, free, and self-hostable forever. This is locked in [`docs/MOTTO.md`](./MOTTO.md) and the project ADRs:

- The full CLI surface across all 5 active NUX packages — `init`, `plan`, `codify`, `report`, `validate`, `rtm`, `sca`, `sca-oscal`, `sign`, `sign-pdf`, `health`, `kb-init`, `adr-new`, `risk-add`, `new-sprint`, `summarize`, `log`, ...
- RTM (Requirements Traceability Matrix) generation
- SCA (Security Control Assessment) generation, markdown + PDF export
- OSCAL 1.1.2 JSON emit (federal interop must remain free)
- All industry bundles + templates + JSON Schemas
- The `[VERIFY]` marker system + HMAC-chained sign-off mechanics
- Local evidence capture and storage
- All documentation, including this file

Premium sells the **layer around** the OSS — hosting, multi-user collaboration, and human time. None of it gates anything that already runs on your machine.

---

## Service engagements (available now)

Delivered by LeapNuX directly. Limited capacity — bookable via `ccling1998@gmail.com`.

### White-glove onboarding (3-day remote engagement)

Compresses the standard 4-week / 5-engineer-day adoption arc into 3 days with us doing the heavy lifting.

- **Day 1** — Requirement extraction → R-XX in `requirements/REQUIREMENTS.md`; RTM scaffold via `branchnux rtm`.
- **Day 2** — Status taxonomy workshop, `UAT_SECRET` setup, first SCA pass, first 5 HMAC-signed attestations.
- **Day 3** — Auditor introduction + 30-min validation call; written onboarding summary handed off.

**Output:** working RTM, validated SCA, 5 signed attestations in `uat-log.jsonl`, OSCAL emit verified, trained team. **Range: $15K–$30K** depending on scope.

### Training engagements

- **"5-NUX for compliance leads"** (4-hour workshop) — what the discipline produces, how to read RTM/SCA, the `[VERIFY]` boundary, the HMAC chain. **$5K.**
- **"5-NUX for engineering teams"** (full day) — R-XX origination, status taxonomy, test plan authoring, Playwright evidence, OSCAL emit, CI integration. **$10K.**
- **"Auditor handoff workshop"** (2-day, includes mock audit) — full simulation of the auditor review cycle, fielding questions, demonstrating the artifact chain. **$15K.**
- Recorded sessions become your internal training library (rights assigned to you). Remote standard; on-site at travel cost.

### Quarterly review ($5K/year, 4 hours/quarter)

- Standard drift-checklist review of your current SCA, RTM, UAT artifacts.
- Flags stale attestations, missing TC coverage, broken HMAC entries, taxonomy violations, unresolved `[VERIFY]` markers.
- Output: 1-page quarterly report committed to your repo as `requirements/QUARTERLY_REVIEW_<date>.md`.

### Annual audit-readiness assessment ($20K–$100K)

4-week engagement timed 6–8 weeks before your scheduled audit. Suitable for SOC 2 Type I/II, NYDFS Section 500, HIPAA, FedRAMP Moderate.

- Week 1 — artifact review + gap identification.
- Week 2 — gap remediation alongside your team.
- Week 3 — auditor pre-brief preparation, evidence-index drafting.
- Week 4 — final readiness scorecard + handoff to your auditor.

Pricing scales with framework scope: $20K (SOC 2 Type I, early-stage) → $100K (FedRAMP Moderate, full program).

### Industry-specific advisory ($5K–$15K/month retainer)

- Quarterly strategy calls (1 hr each).
- Real-time Slack access during active audits or policy drafting.
- Heads-up on regulatory changes (NYDFS amendments, HIPAA / HITECH updates, PCI DSS revisions, DORA, CMMC 2.0).
- Industry-specific SCA template extensions delivered as 5-NUX marker files (compatible with OSS CLI).

---

## Hosted SaaS — `leapnux.com` (in rollout)

The hosted-SaaS tiers replace the "share a Google Doc back-and-forth" pattern with a real multi-user portal. Currently in rollout — early-customer pricing available; contact us for a slot.

### Solo / Pro tier — $99–$499/mo

- **Hosted Playwright execution** — no local browser setup; trigger from CI (`branchnux run --hosted`) or web UI.
- **Cloud evidence vault** — versioned storage of test plans, execution logs, screenshots, SCA documents. Cross-machine sync. 7-year retention default (SOC 2 / NYDFS standard); configurable.
- **Notifications** — weekly digest, Slack/Teams integration, push on attestation staleness.
- **Hosted demo landing page** — auto-deploy from `examples/<slug>/output/`. Public or password-protected. Custom domain at the $199/mo tier.
- **100 page-test-passes/month included**; $0.40/pass overage.

### Team tier — $999–$2,999/mo

Includes everything in Pro, plus:

- **Multi-tenant org structure** — Org → Workspace → Project hierarchy; separate vaults per BU; aggregate dashboards roll up.
- **5-role RBAC** — Owner / Admin / Maintainer / Reviewer / Auditor.
- **SSO + SCIM** — SAML 2.0, OIDC, Okta, Auth0, Google Workspace, Azure AD. SCIM auto-provisioning. Org-level SSO enforcement.
- **Auditor portal** — read-only auditor seats, scoped to engagement (start/end date, auto-expires). Comments versioned + attributed. Compatible with A-LIGN, Schellman, BDO, Coalfire, KPMG.
- **Multiple-reviewer attestations** — N reviewers per control (configurable). Useful for SOC 2 CC6, NYDFS 500.16.
- **White-label HTML reports** — your branding (logo, palette, CSS, domain). Header reads your company name.
- **Priority support** — 24-hour first response, dedicated Slack channel, monthly office hours, audit-critical escalation path.

### Founder-rate

First 3 customers in each tier get **50% off year-one** in exchange for being a named case study + reference customer. Genuine trade — we work closely with you, you let us write about the outcome. First 3 is first 3.

---

## Enterprise needs

Liability cover via insurance partner (Coalition / At-Bay / Resilience), WORM evidence retention, multi-region data residency, custom SLA, white-glove embedded consulting, marketplace bundles for NHS DSP / Australian Privacy Act / Singapore PDPA / DORA — all on the roadmap as the customer base scales. If you're an enterprise compliance lead with specific needs, email and we'll tell you honestly whether we can help today vs whether you should look at Vanta, Drata, or a GRC consultancy. The OSS is free and useful regardless.

---

## How to buy

| Lane | Path |
|---|---|
| **Service engagements** | Statement of work, 2-week kickoff. `ccling1998@gmail.com`. |
| **Hosted SaaS — Solo / Pro** | Reach out for early-customer access during rollout. |
| **Hosted SaaS — Team** | Sales-assisted: intro Zoom + 14-day trial. |

We're solo-founded. Bandwidth is limited. We respond to every email and prioritize procurement teams with a real audit on the calendar.

---

## Pricing principles

1. **Free forever for the local CLI.** Everything that runs on your machine stays free.
2. **Pay for hosting and workflow.** Hosted runs, cloud vault, auditor portal — real infrastructure costs.
3. **Pay for assurance** when those services come online (notarization, WORM retention, liability cover).
4. **Pay for human time.** Consulting, training, advisory — priced transparently, not bundled into SaaS seats to inflate ARR.
5. **No paywalls on commodity generation features.** SCA, RTM, OSCAL — free.
6. **Founder-rate for first 3 in each tier.** We want early customers to succeed.
7. **No lock-in.** No auto-renewal traps. No per-seat creep. No exit fees. Data leaves in Markdown + JSON whenever you want.
