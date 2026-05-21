import PageNav from "@/components/Layout/PageNav";
import Link from "next/link";
import kb from "@/data/valorant-kb.json";

const mono    = "var(--font-mono)";
const display = "var(--font-display)";
const border  = "1px solid rgba(255,255,255,0.07)";
const dimText = "#4a4a4a";

const ROLE_COLOR: Record<string, string> = {
  Duelist:   "#ef4444",
  Initiator: "#3b82f6",
  Controller:"#a855f7",
  Sentinel:  "#10b981",
  "IGL / Controller": "#a855f7",
  "Duelist / Flex":   "#ef4444",
  "Flex":             "#f59e0b",
  "IGL / Flex":       "#a855f7",
};

export default function PlayersPage() {
  const players = Object.entries(kb.players);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#efefef" }}>
      <PageNav />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: 40, borderBottom: border, paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 8 }}>— {players.length} TRACKED PROS</p>
          <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(44px, 6.5vw, 88px)", textTransform: "uppercase", lineHeight: 0.95 }}>
            PLAYERS
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1 }}>
          {players.map(([name, player]) => {
            const color = ROLE_COLOR[player.role] ?? "#888";
            return (
              <Link key={name} href={`/chat?q=Tell me about ${name}`} style={{
                display: "block", padding: "18px 20px",
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.015)",
                textDecoration: "none",
              }}>
                {/* Name + team */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <p style={{ fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: "0.08em", color: "#f0f0f0", textShadow: "0 0 10px rgba(255,255,255,0.18)", lineHeight: 1 }}>{name}</p>
                    <p style={{ fontFamily: mono, fontSize: 12, color: dimText, letterSpacing: "0.1em", marginTop: 3 }}>{player.team}</p>
                  </div>
                  <span style={{
                    fontFamily: mono, fontSize: 14, letterSpacing: "0.1em",
                    color: color, border: `1px solid ${color}44`,
                    padding: "2px 6px", whiteSpace: "nowrap",
                  }}>{player.role}</span>
                </div>

                {/* Agents */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                  {player.signature_agents.map((a) => (
                    <span key={a} style={{
                      fontFamily: mono, fontSize: 14, color: "#888",
                      border: "1px solid rgba(255,255,255,0.07)",
                      padding: "2px 6px", letterSpacing: "0.06em",
                    }}>{a}</span>
                  ))}
                </div>

                {/* Playstyle snippet */}
                <p style={{ fontFamily: mono, fontSize: 12, color: "#888", lineHeight: 1.6, letterSpacing: "0.03em" }}>
                  {player.playstyle.slice(0, 100)}{player.playstyle.length > 100 ? "..." : ""}
                </p>

                <p style={{ fontFamily: mono, fontSize: 14, color: "#333", marginTop: 10, letterSpacing: "0.08em" }}>
                  FULL PROFILE →
                </p>
              </Link>
            );
          })}
        </div>

      </main>
    </div>
  );
}
