"use client";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const mono    = "var(--font-mono)";
const ui      = "var(--font-ui)";
const display = "var(--font-display)";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginBottom: 16 }}>
        <div style={{ maxWidth: "72%", minWidth: 120 }}>
          {/* Label */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", color: "#555" }}>
              AGENT ◂
            </span>
          </div>
          {/* Bubble */}
          <div style={{
            padding: "14px 18px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderTop: "2px solid rgba(255,255,255,0.22)",
            color: "#e8e8e8",
            fontFamily: ui,
            fontSize: 15,
            lineHeight: 1.75,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
          }}>
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  // CYPHER message
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", width: "100%", marginBottom: 20 }}>
      {/* Left avatar */}
      <div style={{
        flexShrink: 0,
        width: 36,
        height: 36,
        marginRight: 12,
        marginTop: 2,
        background: "rgba(255,70,85,0.12)",
        border: "1px solid rgba(255,70,85,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
        flexDirection: "column",
        gap: 1,
      }}>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 13, color: "#ff4655", lineHeight: 1 }}>C</span>
      </div>

      <div style={{ flex: 1, minWidth: 0, maxWidth: "80%" }}>
        {/* Label row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", color: "#ff4655", textShadow: "0 0 8px rgba(255,70,85,0.5)" }}>
            CYPHER ◈
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,70,85,0.2)" }} />
          <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", color: "#333" }}>
            INTEL REPORT
          </span>
        </div>

        {/* Bubble */}
        <div style={{
          padding: "16px 20px",
          background: "rgba(255,70,85,0.04)",
          borderLeft: "2px solid rgba(255,70,85,0.5)",
          borderBottom: "1px solid rgba(255,70,85,0.12)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "#dcdcdc",
          fontFamily: ui,
          fontSize: 15,
          lineHeight: 1.85,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          textShadow: "0 0 12px rgba(255,255,255,0.07)",
        }}>
          {message.content || (
            // streaming placeholder — empty assistant bubble shows dots
            <span style={{ color: "#333" }}>···</span>
          )}
        </div>
      </div>
    </div>
  );
}
