import PageNav from "@/components/Layout/PageNav";
import Link from "next/link";

const REGIONS = [
  {
    code: "NA",
    name: "VCT AMERICAS",
    teams: 10,
    desc: "North America, Brazil & LATAM. Home of Sentinels, LOUD, NRG, 100 Thieves, Cloud9 and more. The most individually gifted region.",
    color: "#3b82f6",
  },
  {
    code: "EU",
    name: "VCT EMEA",
    teams: 10,
    desc: "Europe, Turkey & Middle East. Tactical depth, IGL masterclasses, and the Fnatic dynasty. The most structurally sound region.",
    color: "#f97316",
  },
  {
    code: "PAC",
    name: "VCT PACIFIC",
    teams: 10,
    desc: "Korea, Japan, SEA & South Asia. Paper Rex's chaos, DRX's discipline, T1's veteran presence. Wildly entertaining.",
    color: "#a855f7",
  },
  {
    code: "CN",
    name: "VCT CHINA",
    teams: 10,
    desc: "EDG, FPX, Bilibili Gaming and more. The newest international circuit, growing rapidly. A sleeping giant.",
    color: "#ef4444",
  },
];

const EVENTS = [
  { name: "MASTERS BANGKOK",  desc: "Early-season international LAN. Top teams from all 4 regions compete.",   timing: "Feb – Mar" },
  { name: "MASTERS TORONTO",  desc: "Mid-season international LAN. The halfway checkpoint before Champions.",   timing: "Jun – Jul" },
  { name: "CHAMPIONS",        desc: "The world championship. End-of-year showdown. The biggest Valorant event.", timing: "Aug – Sep" },
];

const mono    = "var(--font-mono)";
const display = "var(--font-display)";
const border  = "1px solid rgba(255,255,255,0.07)";
const dimText = "#4a4a4a";

export default function GamePage() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#efefef" }}>
      <PageNav />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 48, borderBottom: border, paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 8 }}>
            — THE STRUCTURE
          </p>
          <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(44px, 6.5vw, 88px)", textTransform: "uppercase", lineHeight: 0.95, letterSpacing: "0.02em" }}>
            VCT FORMAT
          </h1>
          <p style={{ fontFamily: mono, fontSize: 14, color: "#999", marginTop: 12, maxWidth: 520, lineHeight: 1.8, letterSpacing: "0.04em" }}>
            The Valorant Champions Tour is Riot Games' official global esports league. Four regional circuits, one world champion.
          </p>
        </div>

        {/* Regions */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 20 }}>
            — REGIONAL LEAGUES
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 1, border: "1px solid rgba(255,255,255,0.07)" }}>
            {REGIONS.map((r) => (
              <div key={r.code} style={{
                padding: "24px 20px",
                background: "rgba(255,255,255,0.02)",
                borderRight: border,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 32, height: 32,
                    border: `1px solid ${r.color}44`,
                    background: `${r.color}0d`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: mono, fontSize: 12, color: r.color, letterSpacing: "0.06em" }}>{r.code}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: display, fontWeight: 700, fontSize: 14, letterSpacing: "0.12em", color: "#e0e0e0" }}>{r.name}</p>
                    <p style={{ fontFamily: mono, fontSize: 14, color: dimText, letterSpacing: "0.1em" }}>{r.teams} PARTNER TEAMS</p>
                  </div>
                </div>
                <p style={{ fontFamily: mono, fontSize: 13, color: "#999", lineHeight: 1.7, letterSpacing: "0.03em" }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* International events */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 20 }}>
            — INTERNATIONAL EVENTS
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {EVENTS.map((ev) => (
              <div key={ev.name} style={{
                display: "flex", alignItems: "center", gap: 24,
                padding: "18px 20px",
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.015)",
              }}>
                <span style={{ fontFamily: mono, fontSize: 12, color: dimText, letterSpacing: "0.1em", minWidth: 60 }}>{ev.timing}</span>
                <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.07)" }} />
                <div>
                  <p style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: "0.1em", color: "#e0e0e0", marginBottom: 3 }}>{ev.name}</p>
                  <p style={{ fontFamily: mono, fontSize: 13, color: "#999", letterSpacing: "0.03em" }}>{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ borderTop: border, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: mono, fontSize: 13, color: "#888", letterSpacing: "0.06em" }}>
            Want deeper intel? Ask CYPHER anything about VCT format, teams, or history.
          </p>
          <Link href="/chat" style={{
            fontFamily: display, fontWeight: 700, fontSize: 13, letterSpacing: "0.18em",
            color: "#f0f0f0", textShadow: "0 0 12px rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.2)",
            padding: "10px 24px", textDecoration: "none", background: "rgba(255,255,255,0.04)",
          }}>
            ASK CYPHER →
          </Link>
        </div>

      </main>
    </div>
  );
}
