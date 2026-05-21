import PageNav from "@/components/Layout/PageNav";
import Link from "next/link";
import kb from "@/data/valorant-kb.json";

const mono    = "var(--font-mono)";
const display = "var(--font-display)";
const border  = "1px solid rgba(255,255,255,0.07)";
const dimText = "#4a4a4a";

const REGION_COLOR: Record<string, string> = {
  Americas: "#3b82f6",
  EMEA:     "#f97316",
  Pacific:  "#a855f7",
  China:    "#ef4444",
};

export default function TeamsPage() {
  const teams = Object.entries(kb.teams);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#efefef" }}>
      <PageNav />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: 40, borderBottom: border, paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 8 }}>— {teams.length} VCT PARTNER ORGS</p>
          <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(44px, 6.5vw, 88px)", textTransform: "uppercase", lineHeight: 0.95 }}>
            TEAMS
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1 }}>
          {teams.map(([key, team]) => {
            const color = REGION_COLOR[team.region] ?? "#888";
            const chatLink = `/chat?q=Tell me about ${team.full_name}`;
            return (
              <Link key={key} href={chatLink} style={{
                display: "block", padding: "20px",
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.015)",
                textDecoration: "none",
                transition: "background 0.15s",
              }}>
                {/* Region badge + name */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: "0.1em", color: "#e0e0e0" }}>
                    {team.full_name}
                  </span>
                  <span style={{
                    fontFamily: mono, fontSize: 14, letterSpacing: "0.12em",
                    color: color, border: `1px solid ${color}44`,
                    padding: "2px 6px",
                  }}>
                    {team.region.toUpperCase()}
                  </span>
                </div>

                {/* Playstyle */}
                <p style={{ fontFamily: mono, fontSize: 12, color: "#999", letterSpacing: "0.03em", lineHeight: 1.6, marginBottom: 12 }}>
                  {team.playstyle.slice(0, 110)}{team.playstyle.length > 110 ? "..." : ""}
                </p>

                {/* Roster chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {team.roster.slice(0, 5).map((p) => (
                    <span key={p} style={{
                      fontFamily: mono, fontSize: 14, color: "#888",
                      border: "1px solid rgba(255,255,255,0.07)",
                      padding: "2px 7px", letterSpacing: "0.06em",
                    }}>{p}</span>
                  ))}
                </div>

                <p style={{ fontFamily: mono, fontSize: 14, color: "#333", marginTop: 12, letterSpacing: "0.08em" }}>
                  ASK CYPHER →
                </p>
              </Link>
            );
          })}
        </div>

      </main>
    </div>
  );
}
