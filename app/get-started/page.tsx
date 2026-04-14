import Link from "next/link"
import LeadForm from "../components/LeadForm"

export const metadata = {
  title: "Join Mi-Leads - Pilot Program",
  description: "Join the Mi-Leads pilot program request form for dealership sales reps in Middle Tennessee.",
}

export default function GetStarted() {
  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(30,10,60,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(168,85,247,0.15)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px", height: 64,
          display: "flex", alignItems: "center",
        }}>
          <Link href="/" style={{
            fontSize: 22, fontWeight: 800,
            color: "var(--purple-light)",
            letterSpacing: "-0.02em", textDecoration: "none",
          }}>
            Mi-Leads
          </Link>
        </div>
      </nav>

      <main style={{
        maxWidth: 680, margin: "0 auto",
        padding: "64px 24px 100px",
      }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900,
            lineHeight: 1.18, marginBottom: 12, maxWidth: 760, marginInline: "auto",
          }}>
            <span style={{ color: "var(--purple-light)" }}>Lead Network Pilot Program</span>
          </h1>

          <p style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "rgba(168,85,247,0.78)",
            margin: "0 auto 24px",
          }}>
            Middle Tennessee Region
          </p>

          <p style={{
            fontSize: 16, color: "rgba(240,238,255,0.5)",
            lineHeight: 1.75, maxWidth: 560, margin: "0 auto 22px",
          }}>
            Fresh, active, verified leads for sales consultants who want a new way to grow beyond the usual dealership pipeline. Join the free pilot program for early access, rollout updates, and future perks.
          </p>

          <div style={{
            display: "grid",
            gap: 8,
            maxWidth: 520,
            margin: "0 auto",
            textAlign: "center",
            padding: "14px 16px",
            borderRadius: 14,
            border: "1px solid rgba(168,85,247,0.12)",
            background: "rgba(255,255,255,0.02)",
          }}>
            {[
              "Sales consultants only",
              "Must be in Middle Tennessee",
              "Must have valid contact info and a TN sales license, or be getting one soon",
            ].map((line) => (
              <div key={line} style={{ fontSize: 14, color: "rgba(240,238,255,0.68)", lineHeight: 1.55 }}>
                {line}
              </div>
            ))}
          </div>

          <p style={{
            fontSize: 13, color: "rgba(240,238,255,0.3)",
            lineHeight: 1.7, maxWidth: 520, margin: "18px auto 0",
          }}>
            Form completion time: 1-5 minutes.
            <br />
            Take your time and make sure your information is accurate.
          </p>
        </div>

        <LeadForm />
      </main>
    </>
  )
}
