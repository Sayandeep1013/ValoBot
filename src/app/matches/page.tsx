import PageNav from "@/components/Layout/PageNav";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface VLRMatch {
  team1: string;
  team2: string;
  score1?: string;
  score2?: string;
  time_completed?: string;
  time_until_match?: string;
  round_info?: string;
  tournament_name?: string;
  match_series?: string;
  match_event?: string;
}

async function getMatches() {
  try {
    const [r, u] = await Promise.all([
      fetch("https://vlrggapi.vercel.app/match?q=results",  { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) }),
      fetch("https://vlrggapi.vercel.app/match?q=upcoming", { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) }),
    ]);
    const results  = r.ok  ? (await r.json())?.data?.segments  as VLRMatch[] ?? [] : [];
    const upcoming = u.ok  ? (await u.json())?.data?.segments  as VLRMatch[] ?? [] : [];
    return { results: results.slice(0, 20), upcoming: upcoming.slice(0, 15) };
  } catch {
    return { results: [], upcoming: [] };
  }
}

const mono    = "var(--font-mono)";
const display = "var(--font-display)";
const border  = "1px solid rgba(255,255,255,0.07)";
const dimText = "#4a4a4a";

export default async function MatchesPage() {
  const { results, upcoming } = await getMatches();

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#efefef" }}>
      <PageNav />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: 40, borderBottom: border, paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 8 }}>— LIVE FROM VLR.GG</p>
          <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(44px, 6.5vw, 88px)", textTransform: "uppercase", lineHeight: 0.95 }}>
            MATCHES
          </h1>
        </div>

        <div className="page-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

          {/* Recent Results */}
          <section>
            <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 16 }}>— RECENT RESULTS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {results.length === 0 && (
                <p style={{ fontFamily: mono, fontSize: 13, color: "#444", padding: "16px 0" }}>No data available.</p>
              )}
              {results.map((m, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.015)",
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: mono, fontSize: 14, color: "#e0e0e0", letterSpacing: "0.06em", textShadow: "0 0 8px rgba(255,255,255,0.15)", marginBottom: 3 }}>
                      {m.team1}
                      <span style={{ color: "#444", margin: "0 8px" }}>vs</span>
                      {m.team2}
                    </p>
                    <p style={{ fontFamily: mono, fontSize: 14, color: dimText, letterSpacing: "0.06em" }}>
                      {m.tournament_name ?? m.round_info ?? ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {m.score1 !== undefined && (
                      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 16, color: "#e0e0e0", letterSpacing: "0.1em" }}>
                        {m.score1} – {m.score2}
                      </span>
                    )}
                    <span style={{ fontFamily: mono, fontSize: 14, color: "#333", letterSpacing: "0.06em" }}>
                      {m.time_completed}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming */}
          <section>
            <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 16 }}>— UPCOMING MATCHES</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {upcoming.length === 0 && (
                <p style={{ fontFamily: mono, fontSize: 13, color: "#444", padding: "16px 0" }}>No upcoming matches scheduled.</p>
              )}
              {upcoming.map((m, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.01)",
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: mono, fontSize: 14, color: "#e0e0e0", letterSpacing: "0.06em", textShadow: "0 0 8px rgba(255,255,255,0.15)", marginBottom: 3 }}>
                      {m.team1}
                      <span style={{ color: "#444", margin: "0 8px" }}>vs</span>
                      {m.team2}
                    </p>
                    <p style={{ fontFamily: mono, fontSize: 14, color: dimText, letterSpacing: "0.06em" }}>
                      {m.match_event ?? m.match_series ?? ""}
                    </p>
                  </div>
                  <span style={{ fontFamily: mono, fontSize: 14, color: "#888", letterSpacing: "0.06em" }}>
                    {m.time_until_match}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div style={{ borderTop: border, marginTop: 40, paddingTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: mono, fontSize: 13, color: "#888", letterSpacing: "0.06em" }}>
            Want a breakdown of any match? Ask CYPHER for full analysis.
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
