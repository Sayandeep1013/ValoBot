"use client";

const mono = "var(--font-mono)";
const ui   = "var(--font-ui)";

const SUGGESTIONS = [
  { label: "Who are the best teams in VCT right now?",          tag: "RANKINGS"  },
  { label: "Break down LOUD's playstyle — what makes Aspas special?", tag: "ANALYSIS" },
  { label: "What's the current Valorant agent meta?",           tag: "META"      },
  { label: "How does Fnatic approach their map picks?",         tag: "STRATEGY"  },
  { label: "Compare TenZ vs Aspas — who's better?",            tag: "COMPARE"   },
  { label: "Explain Paper Rex's chaos style and why it works",  tag: "DEEP DIVE" },
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <p style={{
        fontFamily: mono, fontSize: 10, letterSpacing: "0.22em",
        color: "#3a3a3a", marginBottom: 14, textAlign: "center",
      }}>
        ─── INTEL REQUESTS ───
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 8,
      }}>
        {SUGGESTIONS.map(({ label, tag }) => (
          <button
            key={label}
            onClick={() => onSelect(label)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: "12px 14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderLeft: "2px solid rgba(255,70,85,0.3)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,70,85,0.06)";
              e.currentTarget.style.borderLeftColor = "#ff4655";
              e.currentTarget.style.borderColor = "rgba(255,70,85,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderLeftColor = "rgba(255,70,85,0.3)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.16em", color: "#ff4655" }}>
              {tag}
            </span>
            <span style={{ fontFamily: ui, fontSize: 13, color: "#b0b0b0", lineHeight: 1.5 }}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
