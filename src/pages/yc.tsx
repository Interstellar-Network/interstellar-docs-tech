import React from "react";
import Layout from "@theme/Layout";

export default function YCPage() {
  return (
    <Layout
      title="YC – Interstellar PoHI"
      description="Interstellar – Proof of Human Intent SDK and decentralized signing network"
    >
      <main className="yc-page">
        <div className="yc-container">
          <style>{`
            :root {
              --yc-bg: #050712;
              --yc-bg-alt: #0b0f1f;
              --yc-accent: #8b5cf6;
              --yc-accent-soft: rgba(139, 92, 246, 0.18);
              --yc-text: #f9fafb;
              --yc-text-soft: #9ca3af;
              --yc-border: #1f2937;
              --yc-chip-bg: #111827;
            }

            .yc-page {
              background: radial-gradient(circle at top, #111827 0, #020617 60%);
              min-height: 100vh;
              color: var(--yc-text);
              display: flex;
              justify-content: center;
            }

            .yc-container {
              width: 100%;
              max-width: 960px;
              padding: 3.5rem 1.5rem 4.5rem;
              box-sizing: border-box;
            }

            @media (min-width: 768px) {
              .yc-container {
                padding: 4.5rem 0 5.5rem;
              }
            }

            .yc-pill {
              display: inline-flex;
              align-items: center;
              gap: 0.4rem;
              padding: 0.25rem 0.7rem;
              border-radius: 999px;
              font-size: 0.72rem;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              background: rgba(15, 23, 42, 0.9);
              border: 1px solid rgba(148, 163, 184, 0.3);
              color: var(--yc-text-soft);
              margin-bottom: 1rem;
            }

            .yc-pill-dot {
              width: 0.42rem;
              height: 0.42rem;
              border-radius: 999px;
              background: radial-gradient(circle, #a855f7, #4c1d95);
            }

            .yc-hero {
              margin-bottom: 2.75rem;
            }

            .yc-hero-title {
              font-size: clamp(2.4rem, 4vw, 3rem);
              font-weight: 650;
              letter-spacing: -0.03em;
              margin-bottom: 0.75rem;
            }

            .yc-hero-highlight {
              background: linear-gradient(120deg, #a855f7, #f97316);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }

            .yc-hero-subtitle {
              font-size: 1.02rem;
              color: var(--yc-text-soft);
              max-width: 640px;
            }

            .yc-grid {
              display: grid;
              grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
              gap: 1.75rem;
              margin-bottom: 2.5rem;
            }

            @media (max-width: 900px) {
              .yc-grid {
                grid-template-columns: minmax(0, 1fr);
              }
            }

            .yc-card {
              border-radius: 1.25rem;
              border: 1px solid var(--yc-border);
              background:
                radial-gradient(circle at top left, rgba(148, 163, 184, 0.12), transparent 55%),
                radial-gradient(circle at bottom, rgba(15, 23, 42, 0.95), #020617 65%);
              padding: 1.25rem 1.35rem;
              box-shadow: 0 20px 60px rgba(15, 23, 42, 0.9);
            }

            .yc-card-header {
              font-size: 0.86rem;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              color: var(--yc-text-soft);
              margin-bottom: 0.6rem;
            }

            .yc-card-title {
              font-size: 1.02rem;
              font-weight: 560;
              margin-bottom: 0.4rem;
            }

            .yc-card-text {
              font-size: 0.92rem;
              color: var(--yc-text-soft);
              line-height: 1.5;
              margin-bottom: 0.6rem;
            }

            .yc-list {
              list-style: none;
              padding: 0;
              margin: 0.3rem 0 0.2rem;
            }

            .yc-list li {
              display: flex;
              align-items: flex-start;
              gap: 0.45rem;
              font-size: 0.9rem;
              color: var(--yc-text-soft);
              margin-bottom: 0.25rem;
            }

            .yc-list-bullet {
              width: 0.3rem;
              height: 0.3rem;
              border-radius: 999px;
              margin-top: 0.4rem;
              background: linear-gradient(135deg, #a855f7, #f97316);
            }

            .yc-chip-row {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin-top: 0.7rem;
            }

            .yc-chip {
              padding: 0.25rem 0.6rem;
              border-radius: 999px;
              font-size: 0.78rem;
              background: var(--yc-chip-bg);
              border: 1px solid rgba(55, 65, 81, 0.9);
              color: var(--yc-text-soft);
            }

            .yc-section {
              margin-top: 2rem;
              margin-bottom: 1.2rem;
            }

            .yc-section-title {
              font-size: 0.9rem;
              text-transform: uppercase;
              letter-spacing: 0.16em;
              color: var(--yc-text-soft);
              margin-bottom: 0.4rem;
            }

            .yc-section-heading {
              font-size: 1.05rem;
              font-weight: 560;
              margin-bottom: 0.25rem;
            }

            .yc-section-text {
              font-size: 0.9rem;
              color: var(--yc-text-soft);
              max-width: 720px;
            }

            .yc-compare {
              width: 100%;
              border-radius: 1rem;
              border: 1px solid var(--yc-border);
              background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 60%);
              padding: 1rem 1.1rem;
              margin-top: 1rem;
            }

            .yc-compare-grid {
              display: grid;
              grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
              gap: 0.6rem;
            }

            @media (max-width: 768px) {
              .yc-compare-grid {
                grid-template-columns: minmax(0, 1fr);
              }
            }

            .yc-compare-col-header {
              font-size: 0.82rem;
              font-weight: 550;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              color: var(--yc-text-soft);
              margin-bottom: 0.45rem;
            }

            .yc-compare-row {
              font-size: 0.86rem;
              margin-bottom: 0.35rem;
              color: var(--yc-text-soft);
            }

            .yc-tag {
              display: inline-flex;
              align-items: center;
              gap: 0.3rem;
              padding: 0.15rem 0.5rem;
              border-radius: 999px;
              font-size: 0.78rem;
              border: 1px solid rgba(55, 65, 81, 0.9);
              background: rgba(15, 23, 42, 0.9);
              color: var(--yc-text-soft);
            }

            .yc-tag-dot {
              width: 0.32rem;
              height: 0.32rem;
              border-radius: 999px;
              background: linear-gradient(135deg, #22c55e, #a3e635);
            }

            .yc-demo {
              margin-top: 2.2rem;
              display: grid;
              grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
              gap: 1.75rem;
              align-items: center;
            }

            @media (max-width: 900px) {
              .yc-demo {
                grid-template-columns: minmax(0, 1fr);
              }
            }

            .yc-demo-card {
              border-radius: 1.35rem;
              border: 1px solid var(--yc-border);


              background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 60%);
              {background: radial-gradient(circle at top left, rgba(139, 92, 246, 0.18), rgba(15, 23, 42, 0.98));}
              padding: 1.1rem 1.25rem 1.25rem;
              box-shadow: 0 20px 60px rgba(15, 23, 42, 0.9);
            }

            .yc-demo-title {
              font-size: 0.95rem;
              font-weight: 550;
              margin-bottom: 0.3rem;
            }

            .yc-demo-text {
              font-size: 0.88rem;
              color: var(--yc-text-soft);
              margin-bottom: 0.6rem;
            }

            .yc-demo-meta {
              font-size: 0.78rem;
              color: var(--yc-text-soft);
              opacity: 0.9;
            }

            .yc-demo-visual {
              border-radius: 1.35rem;
              border: 1px solid rgba(55, 65, 81, 0.9);
              background: radial-gradient(circle at top, #111827, #020617 60%);
              padding: 0.9rem;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .yc-demo-img {
              display: block;
              border-radius: 1.1rem;
              border: 1px solid rgba(30, 64, 175, 0.4);
              box-shadow: 0 18px 45px rgba(15, 23, 42, 0.95);
              max-width: 280px; /* adjust 280→320 if you want it larger */
              width: 77%;
              height: auto;
            }

           

            .yc-footer {
              margin-top: 2.5rem;
              padding-top: 1.3rem;
              border-top: 1px solid rgba(31, 41, 55, 0.9);
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              gap: 0.8rem;
              font-size: 0.8rem;
              color: var(--yc-text-soft);
            }

            .yc-footer-links {
              display: flex;
              flex-wrap: wrap;
              gap: 0.85rem;
            }

            .yc-link {
              text-decoration: none;
              color: var(--yc-text-soft);
              border-bottom: 1px dashed rgba(148, 163, 184, 0.5);
            }

            .yc-link:hover {
              color: var(--yc-text);
              border-bottom-style: solid;
            }

            .yc-demo-steps {
                margin: 0.4rem 0 0.8rem;
                padding-left: 1rem;
                font-size: 0.88rem;
                color: var(--yc-text-soft);
                line-height: 1.45;
            }

            .yc-demo-steps li {
                margin-bottom: 0.25rem;
            }

            .yc-demo-cta {
            display: inline-block;
            margin: 0.9rem 0 0.8rem;
            padding: 0.52rem 1.1rem;
            font-size: 0.88rem;
            font-weight: 550;
            color: #fff;
            background: linear-gradient(120deg, #a855f7, #6366f1);
            border-radius: 0.7rem;
            text-decoration: none;
            border: 1px solid rgba(148, 163, 184, 0.3);
            transition: opacity 0.15s ease, transform 0.15s ease;
            }

            .yc-demo-cta:hover {
            opacity: 0.92;
            transform: translateY(-1px);
            }

            .yc-demo-bullets {
            margin-top: 0.6rem;
            padding-left: 1rem;
            font-size: 0.78rem;
            color: var(--yc-text-soft);
            line-height: 1.35;
            }

            .yc-demo-bullets li {
            margin-bottom: 0.15rem;
            }


          `}</style>

          {/* HERO */}
          <section className="yc-hero">
            <div className="yc-pill">
              <span className="yc-pill-dot" />
              Proof of Human Intent • Product Overview
            </div>
            <h1 className="yc-hero-title">
              The <span className="yc-hero-highlight">intent layer</span> for wallets, payments &amp; agents.
            </h1>
            <p className="yc-hero-subtitle">
              Interstellar ensures that no transaction, smart-contract call, or agent action is executed
              unless a real human has cryptographically approved that exact action — even on a compromised device.
            </p>
          </section>

          {/* PROBLEM / SOLUTION */}
          <section className="yc-grid">
            <div className="yc-card">
              <div className="yc-card-header">1 · The New Gap</div>
              <div className="yc-card-title">Authentication ≠ Intent</div>
              <p className="yc-card-text">
                Malware and AI agents now act <strong>after login</strong> — draining wallets and triggering
                irreversible payments while security still trusts the authenticated session.
              </p>
              <ul className="yc-list">
                <li>
                  <span className="yc-list-bullet" />
                  <span>Wallet drain attacks: user “confirms” one thing, the system executes another.</span>
                </li>
                <li>
                  <span className="yc-list-bullet" />
                  <span>Instant settlement (Web3, real-time payments) means there is <strong>no rollback window</strong>.</span>
                </li>
                <li>
                  <span className="yc-list-bullet" />
                  <span>Existing MFA, biometrics, passkeys all assume: “if the device is authenticated, the action is legitimate”.</span>
                </li>
              </ul>
              <div className="yc-chip-row">
                <span className="yc-chip">Identity proven</span>
                <span className="yc-chip">Intent hijacked</span>
              </div>
            </div>

            <div className="yc-card">
              <div className="yc-card-header">2 · Our Answer</div>
              <div className="yc-card-title">Proof of Human Intent (PoHI)</div>
              <p className="yc-card-text">
                A new trust layer that binds a <strong>human-only interaction</strong> to a
                <strong> specific action</strong> — transaction, trade, or contract call — and produces a
                cryptographic proof that malware and AI cannot fake.
              </p>
              <ul className="yc-list">
                <li>
                  <span className="yc-list-bullet" />
                  <span>Secure display of the intended action that overlays cannot silently alter.</span>
                </li>
                <li>
                  <span className="yc-list-bullet" />
                  <span>Short cognitive interaction that only the <strong>right human</strong> can perform reliably at speed.</span>
                </li>
                <li>
                  <span className="yc-list-bullet" />
                  <span>Proof is bound to <strong>that exact action</strong> at the <strong>right time</strong> and verified by a decentralized signer network.</span>
                </li>
              </ul>
              <div className="yc-chip-row">
                <span className="yc-chip">If the <strong> right human</strong> didn’t approve it, it doesn’t happen.</span>
              </div>
            </div>
          </section>

          {/* PRODUCT */}
          <section className="yc-section">
            <div className="yc-section-title">3 · Product</div>
            <h2 className="yc-section-heading">Interstellar SDK + Decentralized Signing</h2>
            <p className="yc-section-text">
              Interstellar plugs into wallets and payment apps as a mobile SDK and routes final execution
              through a decentralized signing infrastructure — a trust-minimized alternative to single-device keys.
            </p>

            <div className="yc-grid" style={{ marginTop: "1.2rem" }}>
              <div className="yc-card">
                <div className="yc-card-header">SDK – On-Device</div>
                <div className="yc-card-title">Human intent in a few lines of code</div>
                <p className="yc-card-text">
                  The SDK embeds a short PoHI challenge into the approval flow (100–150ms).
                  It renders a secure transaction summary and collects a human-only response.
                </p>
                <ul className="yc-list">
                  <li>
                    <span className="yc-list-bullet" />
                    <span>Rust core + Kotlin/Swift bindings for iOS &amp; Android.</span>
                  </li>
                  <li>
                    <span className="yc-list-bullet" />
                    <span>Cryptographically bound to the device’s secure element entropy.</span>
                  </li>
                  <li>
                    <span className="yc-list-bullet" />
                    <span>Produces a compact proof object attached to the transaction request.</span>
                  </li>
                </ul>
                <div className="yc-chip-row">
                  <span className="yc-chip">Wallet integration</span>
                  <span className="yc-chip">Payment apps</span>
                  <span className="yc-chip">Smart-contract calls</span>
                </div>
              </div>

              <div className="yc-card">
                <div className="yc-card-header">Decentralized Signing</div>
                <div className="yc-card-title">“Decentralized Fireblocks” for consumers</div>
                <p className="yc-card-text">
                  Instead of signing with a single local key, execution is delegated to a
                  <strong> TEE-secured MPC signer network</strong> that only releases signatures
                  when the PoHI proof and the action match.
                </p>
                <ul className="yc-list">
                  <li>
                    <span className="yc-list-bullet" />
                    <span>Heterogeneous TEEs and independent consensus ledgers for robustness.</span>
                  </li>
                  <li>
                    <span className="yc-list-bullet" />
                    <span>Eliminates single-device key theft and invisible drain transactions.</span>
                  </li>
                  <li>
                    <span className="yc-list-bullet" />
                    <span>Designed to extend from wallets to payment institutions and agents.</span>
                  </li>
                </ul>
                <div className="yc-chip-row">
                  <span className="yc-chip">TEE-enforced MPC</span>
                  <span className="yc-chip">Multi-ledger resilience</span>
                </div>
              </div>
            </div>
          </section>

          {/* WHY WE WIN */}
          <section className="yc-section">
            <div className="yc-section-title">4 · Why This Wins</div>
            <h2 className="yc-section-heading">We secure the moment of execution</h2>
            <p className="yc-section-text">
              Existing tools secure identity and sessions. Interstellar secures the <strong>decision point</strong> —
              the exact instant where money moves, contracts execute, and agents act.
            </p>

            <div className="yc-compare">
              <div className="yc-compare-grid">
                <div>
                  <div className="yc-compare-col-header">Legacy stack</div>
                  <div className="yc-compare-row">
                    • Biometrics / MFA / Passkeys prove <strong>who</strong> is at the device —
                    but not <strong>what</strong> is being approved.
                  </div>
                  <div className="yc-compare-row">
                    • Hardware wallets still fail if the user is misled or the UI is manipulated.
                  </div>
                  <div className="yc-compare-row">
                    • MTD / EDR tools try to classify threats but cannot make action-level guarantees.
                  </div>
                </div>
                <div>
                  <div className="yc-compare-col-header">Interstellar PoHI</div>
                  <div className="yc-compare-row">
                    <span className="yc-tag">
                      <span className="yc-tag-dot" />
                      Intent-bound execution
                    </span>
                  </div>
                  <div className="yc-compare-row">
                    • Action executes only if a <strong>human PoHI challenge</strong> has been passed for that specific intent.
                  </div>
                  <div className="yc-compare-row">
                    • Decentralized signer network refuses signatures when PoHI and action mismatch.
                  </div>
                  <div className="yc-compare-row">
                    • Works even on compromised devices — malware cannot manufacture valid human intent.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DEMO */}  
          
          <section className="yc-demo">
            <div className="yc-demo-card">
              <div className="yc-demo-title">See the PoHI flow in action</div>

              <p className="yc-demo-text">
                This simulation shows how Interstellar verifies a real human before signing a transaction.
                The UI displays the exact action being confirmed and requires a human-only response — even if
                the device were compromised.
              </p>

              <a
                href="https://simu.interstellar.gg/3F60.html"
                target="_blank"
                rel="noreferrer"
                className="yc-demo-cta"
              >
                Try the Confirmation Simulator →
              </a>





              <ul className="yc-demo-steps">
                <li>Tap <strong>OK</strong> (you can leave the “participant” field empty)</li>
                <li>Take a screenshot</li>
                <li>Compare what your eyes saw vs. what the screenshot captured</li>
              </ul>

              <p className="yc-demo-meta">
                Thanks to <strong>persistence of vision</strong> (≈1/30s), your brain perceives secure details
                that never exist in a single captured frame. Malware and overlays cannot steal or alter what the
                human actually approves. This blocks advanced attacks like wallet drain, UI redressing, clipper
                malware, and transaction spoofing.
              </p>

             

              <ul className="yc-demo-bullets">
                <li>100–150ms added latency</li>
                <li>No UX redesign — SDK-level integration</li>
                <li>Extensible to trading agents &amp; other sensitive actions</li>
              </ul>
            </div>

            <div className="yc-demo-visual">
              <a
                href="https://simu.interstellar.gg/3F60.html"
                target="_blank"
                rel="noreferrer"
                className="yc-demo-link"
              >
                <img
                  className="yc-demo-img"
                  src="/img/Confirmation_PoHI.png"
                  alt="Interstellar PoHI confirmation screen"
                />
              </a>
            </div>
          </section>



        
          {/* VISION + FOOTER */}
          <section className="yc-section">
            <div className="yc-section-title">5 · Vision</div>
            <h2 className="yc-section-heading">Human authority over autonomous finance</h2>
            <p className="yc-section-text">

              As trading and payment agents, smart contracts, and AI systems gain autonomy, 
              Interstellar becomes the <strong> human-intent control plane </strong> that keeps them aligned 
              with people: no system can execute an irreversible action unless the right human, 
              cryptographically and behaviorally verified in that moment, has explicitly approved it.
            </p>
          </section>

          <footer className="yc-footer">
            <div>
              Interstellar · Proof of Human Intent SDK &amp; decentralized signing network
            </div>
            <div className="yc-footer-links">
              <a
                className="yc-link"
                href="https://interstellar.network"
                target="_blank"
                rel="noreferrer"
              >
                interstellar.network
              </a>
              <a className="yc-link" href="mailto:team@interstellar.network">
                team@interstellar.network
              </a>
              <a className="yc-link" href="/docs/intro">
                Docs
              </a>
            </div>
          </footer>
        </div>
      </main>
    </Layout>
  );
}
