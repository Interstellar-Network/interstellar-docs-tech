// src/pages/pohi.tsx
import React, { useEffect, useMemo, useState } from "react";
import Layout from "@theme/Layout";

type NavItem = { id: string; label: string };

export default function PoHIPage() {
  const nav: NavItem[] = useMemo(
    () => [
      { id: "problem", label: "Problem" },
      { id: "primitive", label: "Primitive" },
      { id: "how", label: "How it works" },
      { id: "integrations", label: "Integrations" },
      { id: "use-cases", label: "Use cases" },
      { id: "security", label: "Security" },
      { id: "roadmap", label: "Roadmap" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const [active, setActive] = useState<string>("problem");

  useEffect(() => {
    const els = nav
      .map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, threshold: [0.15, 0.25, 0.35, 0.5], rootMargin: "-12% 0px -70% 0px" }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [nav]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <Layout title="PoHI" description="Proof of Human Intent for Autonomous Finance">
      <div className="pohi-page">
        <style>{css}</style>

        <div className="pohi-bg" aria-hidden="true" />

        <header className="pohi-header">
          <div className="pohi-header-inner">
            <a className="pohi-brand" href="/yc/">
              <span className="pohi-brand-mark" aria-hidden="true" />
              <span className="pohi-brand-text">Interstellar</span>
              <span className="pohi-brand-sep">/</span>
              <span className="pohi-brand-sub">PoHI</span>
            </a>

            <nav className="pohi-nav" aria-label="On-page navigation">
              {nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={scrollTo(n.id)}
                  className={`pohi-nav-link ${active === n.id ? "is-active" : ""}`}
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="pohi-header-cta">
              <a className="pohi-btn pohi-btn-ghost" href="#integrations" onClick={scrollTo("integrations")}>
                See integration
              </a>
              <a className="pohi-btn pohi-btn-primary" href="#contact" onClick={scrollTo("contact")}>
                Request a call
              </a>
            </div>
          </div>
        </header>

        <main className="pohi-main">
          {/* HERO */}
          <section className="pohi-hero">
            <div className="pohi-container">
              <div className="pohi-hero-grid">
                <div className="pohi-hero-left">
                  <div className="pohi-pill">
                    <span className="pohi-pill-dot" aria-hidden="true" />
                    Proof of Human Intent
                  </div>

                  <h1 className="pohi-h1">PoHI for Autonomous Finance</h1>

                  <p className="pohi-lead">
                    When agents can move money, authentication is not enough. PoHI makes human authority a cryptographic
                    primitive: atomic, auditable, enforceable.
                  </p>

                  <div className="pohi-chip-row" role="list" aria-label="Key properties">
                    <span className="pohi-chip" role="listitem">
                      Atomic authorization
                    </span>
                    <span className="pohi-chip" role="listitem">
                      Model-agnostic
                    </span>
                    <span className="pohi-chip" role="listitem">
                      Works with agent kits and smart accounts
                    </span>
                  </div>

                  <div className="pohi-hero-cta">
                    <a className="pohi-btn pohi-btn-primary" href="#contact" onClick={scrollTo("contact")}>
                      Talk to us
                    </a>
                    <a className="pohi-btn pohi-btn-ghost" href="#how" onClick={scrollTo("how")}>
                      How it works
                    </a>
                  </div>

                  <div className="pohi-hero-footnote">
                    Designed for irreversible boundaries, high-frequency execution, and verifiable accountability.
                  </div>
                </div>

                <div className="pohi-hero-right">
                  <div className="pohi-card pohi-card-hero">
                    <div className="pohi-card-title">The missing layer</div>
                    <div className="pohi-card-sub">
                      Between agent execution and financial consequence, enforceable human authority is not optional.
                    </div>

                    <div className="pohi-mini-stack">
                      <div className="pohi-mini-row">
                        <div className="pohi-mini-node">Agent</div>
                        <div className="pohi-mini-arrow" aria-hidden="true" />
                        <div className="pohi-mini-node">Agent Kit</div>
                      </div>

                      <div className="pohi-mini-row">
                        <div className="pohi-mini-node is-accent">PoHI Control Plane</div>
                      </div>

                      <div className="pohi-mini-row">
                        <div className="pohi-mini-node">Smart Account</div>
                        <div className="pohi-mini-arrow" aria-hidden="true" />
                        <div className="pohi-mini-node">Execution</div>
                      </div>
                    </div>

                    <div className="pohi-divider" />

                    <div className="pohi-kv">
                      <div className="pohi-kv-item">
                        <div className="pohi-kv-k">Guarantee</div>
                        <div className="pohi-kv-v">No proof, no execution</div>
                      </div>
                      <div className="pohi-kv-item">
                        <div className="pohi-kv-k">Outcome</div>
                        <div className="pohi-kv-v">Audit-grade authority</div>
                      </div>
                      <div className="pohi-kv-item">
                        <div className="pohi-kv-k">Benefit</div>
                        <div className="pohi-kv-v">Lower attack surface</div>
                      </div>
                    </div>
                  </div>

                  <div className="pohi-callout">
                    <div className="pohi-callout-title">Point of no return</div>
                    <div className="pohi-callout-text">
                      In irreversible systems, intent must be proven before execution, not investigated after.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PROBLEM */}
          <section id="problem" className="pohi-section">
            <div className="pohi-container">
              <div className="pohi-section-head">
                <h2 className="pohi-h2">Autonomy meets irreversibility</h2>
                <p className="pohi-muted">
                  Crypto actions are global and final. Agents multiply execution speed and frequency. The result is a
                  structural gap between identity and authority.
                </p>
              </div>

              <div className="pohi-grid-3">
                <div className="pohi-card">
                  <div className="pohi-card-title">Agents outpace supervision</div>
                  <p className="pohi-card-text">
                    Delegated agents execute continuously. Humans cannot review every action, especially under market
                    pressure and high-throughput conditions.
                  </p>
                </div>
                <div className="pohi-card">
                  <div className="pohi-card-title">MFA proves identity, not intent</div>
                  <p className="pohi-card-text">
                    Today’s flows confirm a session or a device, but rarely produce a cryptographic proof that a specific
                    human intended a specific action at the final boundary.
                  </p>
                </div>
                <div className="pohi-card">
                  <div className="pohi-card-title">Bundled stacks create seams</div>
                  <p className="pohi-card-text">
                    Multiple systems and time steps introduce UI deception, session abuse, policy drift, and ambiguous
                    audit trails across vendors and components.
                  </p>
                </div>
              </div>

              <div className="pohi-quote">
                <div className="pohi-quote-bar" aria-hidden="true" />
                <div>
                  <div className="pohi-quote-text">
                    Execution is scaling. Authority infrastructure has not caught up.
                  </div>
                  <div className="pohi-quote-sub">PoHI is designed for the last irreversible boundary.</div>
                </div>
              </div>
            </div>
          </section>

          {/* PRIMITIVE */}
          <section id="primitive" className="pohi-section">
            <div className="pohi-container">
              <div className="pohi-section-head">
                <h2 className="pohi-h2">Bundle vs primitive</h2>
                <p className="pohi-muted">
                  Modern systems approximate intent by stacking signals. PoHI collapses authentication, confirmation,
                  and authorization into a single atomic cryptographic act.
                </p>
              </div>

              <div className="pohi-split">
                <div className="pohi-card">
                  <div className="pohi-card-title">Today: intent as a bundle</div>
                  <ul className="pohi-list">
                    <li>MFA / 2FA + confirmation screens + policy engines</li>
                    <li>Multiple trust boundaries and timestamps</li>
                    <li>Non-atomic, integration seams, replay and race exposure</li>
                    <li>Audit trails are fragmented across systems</li>
                  </ul>
                  <div className="pohi-mini-caption">Intent is often inferred, not proven.</div>
                </div>

                <div className="pohi-card is-accent">
                  <div className="pohi-card-title">PoHI: intent as a primitive</div>
                  <ul className="pohi-list">
                    <li>One act → one proof → one enforcement point</li>
                    <li>Cryptographically binds human + action + constraints + time</li>
                    <li>Atomic: either proof exists or execution is blocked</li>
                    <li>Simplifies backend heterogeneity and reduces attack surface</li>
                  </ul>
                  <div className="pohi-mini-caption">Intent becomes verifiable and enforceable.</div>
                </div>
              </div>

              <div className="pohi-definition">
                <div className="pohi-definition-title">Definition</div>
                <div className="pohi-definition-text">
                  PoHI is a cryptographic proof that a specific human intentionally authorized a specific action, under
                  explicit constraints, at a specific moment.
                </div>

                <div className="pohi-grid-3">
                  <div className="pohi-mini-card">
                    <div className="pohi-mini-card-title">Atomicity</div>
                    <div className="pohi-mini-card-text">No proof, no execution.</div>
                  </div>
                  <div className="pohi-mini-card">
                    <div className="pohi-mini-card-title">Non-repudiation</div>
                    <div className="pohi-mini-card-text">Audit-grade evidence of authority.</div>
                  </div>
                  <div className="pohi-mini-card">
                    <div className="pohi-mini-card-title">Delegation</div>
                    <div className="pohi-mini-card-text">Bounded autonomy, revocable by design.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how" className="pohi-section">
            <div className="pohi-container">
              <div className="pohi-section-head">
                <h2 className="pohi-h2">How it works</h2>
                <p className="pohi-muted">
                  A simple pre-execution gate for high-risk actions, compatible with agent kits, smart accounts, and
                  programmable money.
                </p>
              </div>

              <div className="pohi-flow">
                {[
                  {
                    n: "01",
                    t: "Agent proposes an action",
                    d: "Trade, transfer, policy change, withdrawal, freeze or override.",
                  },
                  {
                    n: "02",
                    t: "Constraints are computed",
                    d: "Scope, limits, time windows, tool permissions, destinations, thresholds.",
                  },
                  {
                    n: "03",
                    t: "User performs PoHI",
                    d: "One atomic interaction on device at the final decision boundary.",
                  },
                  {
                    n: "04",
                    t: "PoHI proof is produced",
                    d: "A verifiable artifact binding human + action + constraints + time.",
                  },
                  {
                    n: "05",
                    t: "Execution is enforced",
                    d: "Smart account / backend verifier checks proof before the irreversible step.",
                  },
                ].map((s) => (
                  <div key={s.n} className="pohi-step">
                    <div className="pohi-step-n">{s.n}</div>
                    <div className="pohi-step-body">
                      <div className="pohi-step-t">{s.t}</div>
                      <div className="pohi-step-d">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pohi-note">
                <div className="pohi-note-title">Key property</div>
                <div className="pohi-note-text">
                  PoHI is a control plane, not an agent framework. It is model-agnostic and designed to be the final
                  authority gate before irreversible execution.
                </div>
              </div>
            </div>
          </section>

          {/* INTEGRATIONS */}
          <section id="integrations" className="pohi-section">
            <div className="pohi-container">
              <div className="pohi-section-head">
                <h2 className="pohi-h2">Integrations</h2>
                <p className="pohi-muted">
                  Fit existing stacks with minimal disruption: add a pre-execution PoHI gate to the actions that matter.
                </p>
              </div>

              <div className="pohi-grid-3">
                <div className="pohi-card">
                  <div className="pohi-card-title">Agent frameworks</div>
                  <p className="pohi-card-text">
                    PoHI becomes the approval gate for high-risk tools. Agents can operate autonomously within
                    pre-approved constraints, and stop automatically outside the boundary.
                  </p>
                  <div className="pohi-tag-row">
                    <span className="pohi-tag">Tool router</span>
                    <span className="pohi-tag">Policy bound</span>
                    <span className="pohi-tag">Audit trail</span>
                  </div>
                </div>

                <div className="pohi-card">
                  <div className="pohi-card-title">Smart accounts and wallets</div>
                  <p className="pohi-card-text">
                    Attach PoHI proofs to critical operations: transfers, approvals, policy changes, withdrawals, and
                    session delegation. Verification happens at the final execution point.
                  </p>
                  <div className="pohi-tag-row">
                    <span className="pohi-tag">Account abstraction</span>
                    <span className="pohi-tag">Session control</span>
                    <span className="pohi-tag">Non-repudiation</span>
                  </div>
                </div>

                <div className="pohi-card">
                  <div className="pohi-card-title">Stablecoins and compliance hooks</div>
                  <p className="pohi-card-text">
                    Bind human authority to freeze/unfreeze, overrides, recalls, and emergency actions with verifiable
                    mandates and auditable delegation constraints.
                  </p>
                  <div className="pohi-tag-row">
                    <span className="pohi-tag">Mandates</span>
                    <span className="pohi-tag">Overrides</span>
                    <span className="pohi-tag">Emergency control</span>
                  </div>
                </div>
              </div>

              <div className="pohi-surface">
                <div className="pohi-surface-title">Integration surface</div>
                <div className="pohi-surface-grid">
                  <div className="pohi-surface-item">
                    <div className="pohi-surface-k">Client</div>
                    <div className="pohi-surface-v">PoHI SDK for atomic user interaction</div>
                  </div>
                  <div className="pohi-surface-item">
                    <div className="pohi-surface-k">Verifier</div>
                    <div className="pohi-surface-v">Backend / smart account verification before execution</div>
                  </div>
                  <div className="pohi-surface-item">
                    <div className="pohi-surface-k">Policy</div>
                    <div className="pohi-surface-v">Optional constraints: scope, limits, time windows, thresholds</div>
                  </div>
                  <div className="pohi-surface-item">
                    <div className="pohi-surface-k">Audit</div>
                    <div className="pohi-surface-v">Single proof format for reporting and internal review</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* USE CASES */}
          <section id="use-cases" className="pohi-section">
            <div className="pohi-container">
              <div className="pohi-section-head">
                <h2 className="pohi-h2">Use cases</h2>
                <p className="pohi-muted">
                  PoHI is designed for high-impact actions: when a mistake, compromise, or agent overreach becomes
                  immediate loss or liability.
                </p>
              </div>

              <div className="pohi-grid-3">
                <div className="pohi-card">
                  <div className="pohi-card-title">For exchanges and platforms</div>
                  <ul className="pohi-list">
                    <li>Agent trading with bounded authority and hard stops</li>
                    <li>Human-approved withdrawals and whitelist changes</li>
                    <li>Session delegation with explicit limits and expiry</li>
                  </ul>
                </div>
                <div className="pohi-card">
                  <div className="pohi-card-title">For stablecoin issuers</div>
                  <ul className="pohi-list">
                    <li>Authorized freeze/unfreeze and emergency overrides</li>
                    <li>Mandates and delegation for compliance operators</li>
                    <li>Audit-grade proof of legitimacy for sensitive actions</li>
                  </ul>
                </div>
                <div className="pohi-card">
                  <div className="pohi-card-title">For chains and ecosystems</div>
                  <ul className="pohi-list">
                    <li>Standard authority primitive for agentic applications</li>
                    <li>Governance legitimacy for emergency controls</li>
                    <li>Composable “intent receipt” for critical state changes</li>
                  </ul>
                </div>
              </div>

              <div className="pohi-callout is-wide">
                <div className="pohi-callout-title">Consistent principle</div>
                <div className="pohi-callout-text">
                  Whether transactions are irreversible or partially reversible, authority must be provable. PoHI binds
                  execution and overrides to explicit human mandates.
                </div>
              </div>
            </div>
          </section>

          {/* SECURITY */}
          <section id="security" className="pohi-section">
            <div className="pohi-container">
              <div className="pohi-section-head">
                <h2 className="pohi-h2">Security posture</h2>
                <p className="pohi-muted">
                  Atomicity simplifies the system. Simplification reduces failure modes, integration seams, and attack
                  surface.
                </p>
              </div>

              <div className="pohi-split">
                <div className="pohi-card">
                  <div className="pohi-card-title">Why atomic reduces attack surface</div>
                  <ul className="pohi-list">
                    <li>Single enforcement point instead of multi-step flows</li>
                    <li>Less state to exploit: fewer sessions, fewer transitions</li>
                    <li>Less vendor and component heterogeneity in the approval path</li>
                    <li>Clear, verifiable artifact for audits and incident response</li>
                  </ul>
                </div>

                <div className="pohi-card">
                  <div className="pohi-card-title">Threat classes PoHI targets</div>
                  <div className="pohi-badges">
                    <span className="pohi-badge">Session hijack</span>
                    <span className="pohi-badge">UI deception</span>
                    <span className="pohi-badge">Agent overreach</span>
                    <span className="pohi-badge">Policy bypass</span>
                    <span className="pohi-badge">Replay ambiguity</span>
                    <span className="pohi-badge">Override legitimacy</span>
                  </div>
                  <p className="pohi-card-text">
                    PoHI is designed to be checked at the final boundary before execution, where authority must be
                    strongest and most explicit.
                  </p>
                </div>
              </div>

              <div className="pohi-note">
                <div className="pohi-note-title">Practical outcome</div>
                <div className="pohi-note-text">
                  PoHI improves user experience and security simultaneously by collapsing multiple approval steps into one
                  atomic interaction and a single verification path.
                </div>
              </div>
            </div>
          </section>

          {/* ROADMAP */}
          <section id="roadmap" className="pohi-section">
            <div className="pohi-container">
              <div className="pohi-section-head">
                <h2 className="pohi-h2">Roadmap for a pilot</h2>
                <p className="pohi-muted">
                  A lightweight, practical path: prove value on 1–2 high-risk actions, then expand to delegation and
                  policy templates.
                </p>
              </div>

              <div className="pohi-grid-3">
                <div className="pohi-card">
                  <div className="pohi-card-title">Step 1</div>
                  <p className="pohi-card-text">
                    Add a PoHI gate to one irreversible action (withdrawal, transfer, trade execution, freeze/override).
                  </p>
                  <div className="pohi-mini-caption">Fast validation, immediate security impact.</div>
                </div>

                <div className="pohi-card">
                  <div className="pohi-card-title">Step 2</div>
                  <p className="pohi-card-text">
                    Introduce delegation constraints: scope, limits, time windows, tool permissions, thresholds.
                  </p>
                  <div className="pohi-mini-caption">Bounded autonomy for agents and operators.</div>
                </div>

                <div className="pohi-card">
                  <div className="pohi-card-title">Step 3</div>
                  <p className="pohi-card-text">
                    Standardize an audit-ready “intent receipt” format for internal review and reporting workflows.
                  </p>
                  <div className="pohi-mini-caption">Operational clarity and compliance alignment.</div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="pohi-section">
            <div className="pohi-container">
              <div className="pohi-contact">
                <div className="pohi-contact-left">
                  <h2 className="pohi-h2">Start with a focused integration</h2>
                  <p className="pohi-muted">
                    We can scope a pilot around a small number of high-risk actions and ship an end-to-end PoHI proof
                    and verifier path with minimal disruption to your stack.
                  </p>

                  <div className="pohi-contact-actions">
                    <a className="pohi-btn pohi-btn-primary" href="mailto:contact@interstellar.network?subject=PoHI%20integration%20call">
                      Request integration call - waiting list
                    </a>
                    <a className="pohi-btn pohi-btn-ghost" href="mailto:contact@interstellar.?subject=PoHI%20pilot%20outline">
                      Ask for pilot outline
                    </a>
                  </div>

                  <div className="pohi-mini-caption">
                    contact@interstellar.network -Calendly link coming soon-
                  </div>
                </div>

                <div className="pohi-contact-right">
                  <div className="pohi-card">
                    <div className="pohi-card-title">What you get in a pilot</div>
                    <ul className="pohi-list">
                      <li>PoHI gate for one high-risk action</li>
                      <li>Verifier integration at the final boundary</li>
                      <li>Initial policy template (constraints, limits, time)</li>
                      <li>Audit-grade proof artifact</li>
                    </ul>
                    <div className="pohi-divider" />
                    <div className="pohi-kv">
                      <div className="pohi-kv-item">
                        <div className="pohi-kv-k">Design principle</div>
                        <div className="pohi-kv-v">Atomic authority</div>
                      </div>
                      <div className="pohi-kv-item">
                        <div className="pohi-kv-k">Integration posture</div>
                        <div className="pohi-kv-v">Minimal disruption</div>
                      </div>
                      <div className="pohi-kv-item">
                        <div className="pohi-kv-k">Target outcome</div>
                        <div className="pohi-kv-v">Provable legitimacy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="pohi-footer">
                <div className="pohi-footer-inner">
                  <div className="pohi-footer-left">
                    <span className="pohi-footer-dot" aria-hidden="true" />
                    Interstellar PoHI
                  </div>
                  <div className="pohi-footer-right">
                    <a className="pohi-footer-link" href="/pohi-core/">
                      PoHI details and simulation
                    </a>
                    <span className="pohi-footer-sep" aria-hidden="true" />
                    <a className="pohi-footer-link" href="#problem" onClick={scrollTo("problem")}>
                      Top
                    </a>
                  </div>
                </div>
              </footer>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}

const css = `
:root{
  --pohi-bg0: #07060b;
  --pohi-bg1: #0b0713;
  --pohi-card: rgba(255,255,255,0.06);
  --pohi-card2: rgba(255,255,255,0.08);
  --pohi-border: rgba(255,255,255,0.12);
  --pohi-text: rgba(255,255,255,0.92);
  --pohi-muted: rgba(255,255,255,0.68);
  --pohi-dim: rgba(255,255,255,0.56);
  --pohi-accent: #8b5cf6;
  --pohi-accent2: #a78bfa;
  --pohi-good: #22c55e;
  --pohi-shadow: 0 18px 60px rgba(0,0,0,0.55);
  --pohi-radius: 18px;
}

.pohi-page{
  min-height: 100vh;
  background: radial-gradient(1200px 600px at 20% -10%, rgba(139,92,246,0.25), transparent 55%),
              radial-gradient(900px 600px at 85% 10%, rgba(167,139,250,0.16), transparent 55%),
              linear-gradient(180deg, var(--pohi-bg0), var(--pohi-bg1) 60%, #07060b);
  color: var(--pohi-text);
}

.pohi-bg{
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(900px 500px at 40% 110%, rgba(139,92,246,0.14), transparent 60%),
    radial-gradient(900px 500px at 90% 90%, rgba(167,139,250,0.10), transparent 55%);
  filter: blur(0px);
  opacity: 1;
  z-index: 0;
}

.pohi-header{
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(14px);
  background: rgba(7,6,11,0.62);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.pohi-header-inner{
  max-width: 1180px;
  margin: 0 auto;
  padding: 14px 18px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: center;
}

.pohi-brand{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--pohi-text);
  font-weight: 600;
  letter-spacing: 0.2px;
}

.pohi-brand-mark{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--pohi-accent), var(--pohi-accent2));
  box-shadow: 0 0 0 4px rgba(139,92,246,0.14);
}

.pohi-brand-text{ opacity: 0.95; }
.pohi-brand-sep{ opacity: 0.5; }
.pohi-brand-sub{ opacity: 0.9; }

.pohi-nav{
  display: none;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.pohi-nav-link{
  font-size: 12.5px;
  color: rgba(255,255,255,0.68);
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease, color 120ms ease;
}
.pohi-nav-link:hover{
  color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.10);
}
.pohi-nav-link.is-active{
  color: rgba(255,255,255,0.92);
  background: rgba(139,92,246,0.14);
  border-color: rgba(139,92,246,0.28);
}

.pohi-header-cta{
  display: inline-flex;
  justify-content: flex-end;
  gap: 10px;
}

.pohi-btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.88);
  background: rgba(255,255,255,0.06);
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
}
.pohi-btn:hover{
  transform: translateY(-1px);
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.16);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
}

.pohi-btn-primary{
  border-color: rgba(139,92,246,0.40);
  background: linear-gradient(135deg, rgba(139,92,246,0.95), rgba(167,139,250,0.90));
  color: rgba(255,255,255,0.96);
}
.pohi-btn-primary:hover{
  border-color: rgba(139,92,246,0.50);
  box-shadow: 0 18px 60px rgba(139,92,246,0.18);
}

.pohi-btn-ghost{
  background: rgba(255,255,255,0.04);
}

.pohi-main{
  position: relative;
  z-index: 1;
}

.pohi-container{
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 18px;
}

.pohi-hero{
  padding: 58px 0 34px;
}

.pohi-hero-grid{
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.pohi-pill{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.78);
  font-size: 12.5px;
  width: fit-content;
}

.pohi-pill-dot{
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--pohi-good), #a3e635);
  box-shadow: 0 0 0 4px rgba(34,197,94,0.10);
}

.pohi-h1{
  margin: 14px 0 10px;
  font-size: 40px;
  line-height: 1.05;
  letter-spacing: -0.8px;
}

.pohi-lead{
  margin: 0 0 16px;
  font-size: 16.5px;
  line-height: 1.55;
  color: rgba(255,255,255,0.74);
  max-width: 62ch;
}

.pohi-chip-row{
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 14px 0 18px;
}

.pohi-chip{
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  font-size: 12.5px;
  border-radius: 999px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.80);
}

.pohi-hero-cta{
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pohi-hero-footnote{
  margin-top: 14px;
  font-size: 12.5px;
  color: rgba(255,255,255,0.56);
}

.pohi-card{
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--pohi-radius);
  box-shadow: var(--pohi-shadow);
  padding: 16px;
}

.pohi-card-hero{
  padding: 18px;
}

.pohi-card.is-accent{
  border-color: rgba(139,92,246,0.35);
  background: linear-gradient(180deg, rgba(139,92,246,0.16), rgba(255,255,255,0.05));
}

.pohi-card-title{
  font-weight: 700;
  letter-spacing: -0.2px;
  margin-bottom: 8px;
}

.pohi-card-sub{
  color: rgba(255,255,255,0.66);
  line-height: 1.45;
  margin-bottom: 14px;
  font-size: 13.5px;
}

.pohi-card-text{
  margin: 0;
  color: rgba(255,255,255,0.68);
  line-height: 1.55;
  font-size: 13.5px;
}

.pohi-mini-stack{
  display: grid;
  gap: 10px;
}

.pohi-mini-row{
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.pohi-mini-node{
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.80);
  font-size: 12.5px;
  min-width: 140px;
  text-align: center;
}

.pohi-mini-node.is-accent{
  border-color: rgba(139,92,246,0.45);
  background: rgba(139,92,246,0.16);
  color: rgba(255,255,255,0.92);
  box-shadow: 0 18px 60px rgba(139,92,246,0.12);
}

.pohi-mini-arrow{
  width: 28px;
  height: 1px;
  background: rgba(255,255,255,0.20);
  position: relative;
}
.pohi-mini-arrow::after{
  content: "";
  position: absolute;
  right: -2px;
  top: -3px;
  width: 7px;
  height: 7px;
  border-right: 1px solid rgba(255,255,255,0.30);
  border-top: 1px solid rgba(255,255,255,0.30);
  transform: rotate(45deg);
}

.pohi-divider{
  height: 1px;
  background: rgba(255,255,255,0.10);
  margin: 14px 0;
}

.pohi-kv{
  display: grid;
  gap: 10px;
}
.pohi-kv-item{
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 10px;
}
.pohi-kv-k{
  font-size: 12px;
  color: rgba(255,255,255,0.52);
}
.pohi-kv-v{
  font-size: 12.5px;
  color: rgba(255,255,255,0.80);
}

.pohi-callout{
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: var(--pohi-radius);
  border: 1px solid rgba(139,92,246,0.24);
  background: rgba(139,92,246,0.08);
}
.pohi-callout.is-wide{
  margin-top: 16px;
}
.pohi-callout-title{
  font-weight: 700;
  margin-bottom: 6px;
}
.pohi-callout-text{
  color: rgba(255,255,255,0.72);
  line-height: 1.5;
  font-size: 13.5px;
}

.pohi-section{
  padding: 44px 0;
}

.pohi-section-head{
  margin-bottom: 18px;
  max-width: 82ch;
}

.pohi-h2{
  margin: 0 0 8px;
  font-size: 24px;
  letter-spacing: -0.4px;
}

.pohi-muted{
  margin: 0;
  color: rgba(255,255,255,0.66);
  line-height: 1.6;
  font-size: 14px;
}

.pohi-grid-3{
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.pohi-quote{
  margin-top: 16px;
  display: grid;
  grid-template-columns: 6px 1fr;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--pohi-radius);
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
}
.pohi-quote-bar{
  border-radius: 999px;
  background: linear-gradient(180deg, var(--pohi-accent), rgba(255,255,255,0.10));
}
.pohi-quote-text{
  font-weight: 700;
  letter-spacing: -0.2px;
}
.pohi-quote-sub{
  margin-top: 4px;
  color: rgba(255,255,255,0.62);
  font-size: 13px;
}

.pohi-split{
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.pohi-list{
  margin: 0;
  padding-left: 18px;
  color: rgba(255,255,255,0.70);
  line-height: 1.7;
  font-size: 13.5px;
}
.pohi-mini-caption{
  margin-top: 10px;
  color: rgba(255,255,255,0.56);
  font-size: 12.5px;
}

.pohi-definition{
  margin-top: 12px;
  padding: 16px;
  border-radius: var(--pohi-radius);
  border: 1px solid rgba(139,92,246,0.22);
  background: radial-gradient(1200px 420px at 0% 0%, rgba(139,92,246,0.14), transparent 60%),
              rgba(255,255,255,0.04);
}
.pohi-definition-title{
  font-weight: 800;
  margin-bottom: 8px;
}
.pohi-definition-text{
  color: rgba(255,255,255,0.72);
  line-height: 1.6;
  font-size: 14px;
  margin-bottom: 14px;
}

.pohi-mini-card{
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
}
.pohi-mini-card-title{
  font-weight: 700;
  margin-bottom: 6px;
}
.pohi-mini-card-text{
  color: rgba(255,255,255,0.66);
  font-size: 13px;
  line-height: 1.5;
}

.pohi-flow{
  display: grid;
  gap: 10px;
}
.pohi-step{
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--pohi-radius);
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
}
.pohi-step-n{
  width: 48px;
  height: 30px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(139,92,246,0.16);
  border: 1px solid rgba(139,92,246,0.28);
  color: rgba(255,255,255,0.86);
  font-weight: 800;
  font-size: 12px;
}
.pohi-step-t{
  font-weight: 800;
  margin-bottom: 4px;
}
.pohi-step-d{
  color: rgba(255,255,255,0.68);
  line-height: 1.55;
  font-size: 13.5px;
}

.pohi-note{
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: var(--pohi-radius);
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
}
.pohi-note-title{
  font-weight: 800;
  margin-bottom: 6px;
}
.pohi-note-text{
  color: rgba(255,255,255,0.68);
  line-height: 1.55;
  font-size: 13.5px;
}

.pohi-tag-row{
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.pohi-tag{
  font-size: 12px;
  padding: 6px 9px;
  border-radius: 999px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.72);
}

.pohi-surface{
  margin-top: 12px;
  padding: 16px;
  border-radius: var(--pohi-radius);
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
}
.pohi-surface-title{
  font-weight: 800;
  margin-bottom: 10px;
}
.pohi-surface-grid{
  display: grid;
  gap: 10px;
}
.pohi-surface-item{
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
}
.pohi-surface-k{
  font-size: 12px;
  color: rgba(255,255,255,0.54);
  font-weight: 700;
}
.pohi-surface-v{
  font-size: 13px;
  color: rgba(255,255,255,0.74);
  line-height: 1.5;
}

.pohi-badges{
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 10px;
}
.pohi-badge{
  font-size: 12px;
  padding: 6px 9px;
  border-radius: 999px;
  border: 1px solid rgba(139,92,246,0.22);
  background: rgba(139,92,246,0.10);
  color: rgba(255,255,255,0.78);
}

.pohi-contact{
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-items: start;
}
.pohi-contact-actions{
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pohi-footer{
  margin-top: 18px;
  padding: 16px 0 10px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.pohi-footer-inner{
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  color: rgba(255,255,255,0.62);
  font-size: 12.5px;
}
.pohi-footer-left{
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.pohi-footer-dot{
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--pohi-accent), var(--pohi-accent2));
}
.pohi-footer-right{
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.pohi-footer-link{
  color: rgba(255,255,255,0.72);
  text-decoration: none;
}
.pohi-footer-link:hover{
  text-decoration: underline;
}
.pohi-footer-sep{
  width: 1px;
  height: 12px;
  background: rgba(255,255,255,0.16);
}

@media (min-width: 900px){
  .pohi-nav{ display: inline-flex; }
  .pohi-hero-grid{
    grid-template-columns: 1.12fr 0.88fr;
    gap: 16px;
    align-items: start;
  }
  .pohi-grid-3{
    grid-template-columns: repeat(3, 1fr);
  }
  .pohi-split{
    grid-template-columns: 1fr 1fr;
  }
  .pohi-surface-grid{
    grid-template-columns: 1fr 1fr;
  }
  .pohi-contact{
    grid-template-columns: 1.05fr 0.95fr;
  }
}

@media (max-width: 560px){
  .pohi-header-inner{
    grid-template-columns: 1fr 1fr;
  }
  .pohi-nav{ display: none; }
  .pohi-header-cta{
    justify-content: flex-end;
  }
  .pohi-btn{
    height: 36px;
    padding: 0 12px;
    font-size: 12.5px;
  }
  .pohi-h1{ font-size: 34px; }
}
`;