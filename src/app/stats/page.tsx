import PageNav from "@/components/Layout/PageNav";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface VLRRanking {
  rank: string;
  team: string;
  record?: string;
  earnings?: string;
  last_played?: string;
  last_played_team?: string;
}

async function getRankings(region: string): Promise<VLRRanking[]> {
  try {
    const res = await fetch(`https://vlrggapi.vercel.app/rankings?region=${region}`, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data ?? []) as VLRRanking[];
  } catch {
    return [];
  }
}

const mono    = "var(--font-mono)";
const display = "var(--font-display)";
const border  = "1px solid rgba(255,255,255,0.07)";
const dimText = "#4a4a4a";

export default async function StatsPage() {
  const [na, eu] = await Promise.all([getRankings("na"), getRankings("eu")]);

  const RankTable = ({ title, rows }: { title: string; rows: VLRRanking[] }) => (
    <section>
      <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 16 }}>
        — {title}
      </p>
      {rows.length === 0 ? (
        <p style={{ fontFamily: mono, fontSize: 13, color: "#444" }}>No data available.</p>
      ) : (
        <div style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Header row */}
          <div style={{
            display: "grid", gridTemplateColumns: "40px 1fr 80px 80px",
            padding: "8px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.02)",
          }}>
            {["#", "TEAM", "RECORD", "EARNINGS"].map((h) => (
              <span key={h} style={{ fontFamily: mono, fontSize: 14, letterSpacing: "0.18em", color: dimText }}>{h}</span>
            ))}
          </div>
          {rows.slice(0, 10).map((r, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "40px 1fr 80px 80px",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
            }}>
              <span style={{ fontFamily: display, fontWeight: 700, fontSize: 16, color: i < 3 ? "#e0e0e0" : "#555" }}>
                {r.rank}
              </span>
              <div>
                <p style={{ fontFamily: mono, fontSize: 14, color: "#c0c0c0", letterSpacing: "0.06em", marginBottom: 2 }}>{r.team}</p>
                {r.last_played_team && (
                  <p style={{ fontFamily: mono, fontSize: 14, color: dimText }}>Last: {r.last_played_team}</p>
                )}
              </div>
              <span style={{ fontFamily: mono, fontSize: 13, color: "#999", letterSpacing: "0.06em" }}>{r.record ?? "—"}</span>
              <span style={{ fontFamily: mono, fontSize: 12, color: "#888", letterSpacing: "0.04em" }}>
                {r.earnings ? r.earnings.replace("$", "$​") : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#efefef" }}>
      <PageNav />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: 40, borderBottom: border, paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", color: dimText, marginBottom: 8 }}>— LIVE FROM VLR.GG</p>
          <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(44px, 6.5vw, 88px)", textTransform: "uppercase", lineHeight: 0.95 }}>
            STATS & RANKINGS
          </h1>
        </div>

        <div className="page-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <RankTable title="VCT AMERICAS" rows={na} />
          <RankTable title="VCT EMEA"     rows={eu} />
        </div>

        <div style={{ borderTop: border, marginTop: 40, paddingTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: mono, fontSize: 13, color: "#888", letterSpacing: "0.06em" }}>
            Deep-dive into any team's stats, head-to-heads, and tournament performance.
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
