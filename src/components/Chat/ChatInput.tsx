"use client";

import { useRef, useEffect, KeyboardEvent } from "react";

const mono = "var(--font-mono)";
const ui   = "var(--font-ui)";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  }

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
      {/* Text area */}
      <div style={{ flex: 1, position: "relative" }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask CYPHER about Valorant esports..."
          rows={1}
          style={{
            width: "100%",
            resize: "none",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderTop: "2px solid rgba(255,255,255,0.18)",
            color: "#e8e8e8",
            fontFamily: ui,
            fontSize: 15,
            padding: "13px 16px",
            outline: "none",
            lineHeight: 1.6,
            transition: "border-color 0.15s",
            clipPath: "polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,70,85,0.7)"; e.currentTarget.style.borderTopColor = "#ff4655"; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderTopColor = "rgba(255,255,255,0.18)"; }}
        />
        {/* Shift+Enter hint */}
        <span style={{
          position: "absolute", bottom: 8, right: 12,
          fontFamily: mono, fontSize: 9, color: "#2a2a2a", letterSpacing: "0.1em",
          pointerEvents: "none",
        }}>
          SHIFT+↵ newline
        </span>
      </div>

      {/* Send button */}
      <button
        onClick={onSend}
        disabled={!canSend}
        style={{
          flexShrink: 0,
          padding: "13px 22px",
          background: canSend ? "#ff4655" : "rgba(255,255,255,0.04)",
          border: canSend ? "none" : "1px solid rgba(255,255,255,0.08)",
          color: canSend ? "#fff" : "#333",
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: "0.2em",
          cursor: canSend ? "pointer" : "not-allowed",
          transition: "all 0.15s",
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
          textShadow: canSend ? "0 0 12px rgba(255,255,255,0.3)" : "none",
          whiteSpace: "nowrap",
        }}
        aria-label="Send"
      >
        SEND ◈
      </button>
    </div>
  );
}
