"use client";

const mono = "var(--font-mono)";

export default function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", width: "100%", marginBottom: 16 }}>
      {/* Avatar */}
      <div style={{
        flexShrink: 0, width: 36, height: 36, marginRight: 12,
        background: "rgba(255,70,85,0.12)",
        border: "1px solid rgba(255,70,85,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 13, color: "#ff4655" }}>C</span>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", color: "#ff4655" }}>CYPHER ◈</span>
          <div style={{ flex: 1, width: 60, height: 1, background: "rgba(255,70,85,0.2)" }} />
        </div>
        <div style={{
          padding: "14px 20px",
          background: "rgba(255,70,85,0.04)",
          borderLeft: "2px solid rgba(255,70,85,0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", color: "#555" }}>
            ANALYZING INTEL
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: 5, height: 5,
                  background: "#ff4655",
                  boxShadow: "0 0 6px #ff4655",
                  animation: `geo-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
