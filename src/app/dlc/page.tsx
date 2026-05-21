import PageNav from "@/components/Layout/PageNav";

const mono    = "var(--font-mono)";
const display = "var(--font-display)";
const border  = "1px solid rgba(255,255,255,0.07)";
const dimText = "#4a4a4a";

const GAMES = [
  {
    code: "01",
    name: "AGENT DROP",
    desc: "Guess the Valorant player from clues — region, role, signature agents, team history. New drop every 24 hours.",
    tag: "DAILY GUESS",
  },
  {
    code: "02",
    name: "ROSTER RECALL",
    desc: "We show you a VCT team's current roster — one player at a time. How fast can you name them all?",
    tag: "TEAM QUIZ",
  },
  {
    code: "03",
    name: "MAP INTEL",
    desc: "Screenshot from a VCT broadcast. Guess the map, the round, and the team playing. One chance per day.",
    tag: "CLIP QUIZ",
  },
];

export default function DLCPage() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#efefef" }}>
      <PageNav />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: 48, borderBottom: border, paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 8 }}>
            — DAILY LOCK-IN GAMES
          </p>
          <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(44px, 6.5vw, 88px)", textTransform: "uppercase", lineHeight: 0.95, letterSpacing: "0.01em" }}>
            DLE GAMES
          </h1>
          <p style={{ fontFamily: mono, fontSize: 14, color: "#999", marginTop: 12, lineHeight: 1.8, letterSpacing: "0.04em" }}>
            Daily Valorant esports puzzles. Wordle-style guessing games built on real VCT data.
          </p>
        </div>

        {/* Under construction notice */}
        <div style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          padding: "20px 24px",
          marginBottom: 40,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 6px rgba(245,158,11,0.5)", flexShrink: 0 }} />
          <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.12em", color: "#888" }}>
            GAMES ARE IN DEVELOPMENT — LAUNCHING SOON. INTEL BELOW.
          </p>
        </div>

        {/* Game cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {GAMES.map((g) => (
            <div key={g.code} style={{
              display: "grid", gridTemplateColumns: "56px 1fr 100px",
              alignItems: "center", gap: 20,
              padding: "22px 20px",
              border: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.015)",
            }}>
              <span style={{ fontFamily: display, fontWeight: 900, fontSize: 28, color: "#222", letterSpacing: "0.05em" }}>
                {g.code}
              </span>
              <div>
                <p style={{ fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: "0.1em", color: "#e0e0e0", marginBottom: 6 }}>
                  {g.name}
                </p>
                <p style={{ fontFamily: mono, fontSize: 13, color: "#999", letterSpacing: "0.04em", lineHeight: 1.6 }}>
                  {g.desc}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  fontFamily: mono, fontSize: 14, letterSpacing: "0.14em",
                  color: dimText, border: "1px solid rgba(255,255,255,0.07)",
                  padding: "3px 8px",
                }}>
                  {g.tag}
                </span>
                <p style={{ fontFamily: mono, fontSize: 14, color: "#2a2a2a", letterSpacing: "0.1em", marginTop: 8 }}>
                  COMING SOON
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: border, marginTop: 48, paddingTop: 28 }}>
          <p style={{ fontFamily: mono, fontSize: 13, color: "#444", letterSpacing: "0.06em", lineHeight: 1.8 }}>
            Can&apos;t wait? While the games load, sharpen your knowledge by chatting with CYPHER.
            <br />Every question you ask makes you harder to beat.
          </p>
        </div>

      </main>
    </div>
  );
}
