"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble, { Message } from "./MessageBubble";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import TypingIndicator from "@/components/ui/TypingIndicator";

const mono    = "var(--font-mono)";
const display = "var(--font-display)";
const headline = "var(--font-headline)";

export default function ChatInterface() {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    let responseStatus = 0;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          userMessage: trimmed,
        }),
      });

      responseStatus = res.status;
      if (!res.ok || !res.body) throw new Error(`${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: accumulated };
          return next;
        });
      }
    } catch {
      const errMsg = responseStatus === 429
        ? "AI provider quota exceeded. Try again in a moment."
        : "I could not complete the live intel request. Check the server logs, network, or API keys.";
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: errMsg };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* ── Messages area ─────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 8px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>

          {/* Empty / welcome state */}
          {isEmpty && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", minHeight: "60vh", gap: 32, paddingTop: 40,
            }}>
              {/* CYPHER identity */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.28em", color: "#3a3a3a", marginBottom: 12 }}>
                  ◈ AGENT ONLINE ◈
                </p>
                <h2 style={{
                  fontFamily: headline,
                  fontSize: "clamp(52px, 8vw, 100px)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  background: "linear-gradient(135deg, #a855f7 0%, #ec4899 45%, #f59e0b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 10,
                }}>
                  CYPHER
                </h2>
                <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.22em", color: "#555", marginBottom: 6 }}>
                  VALORANT ESPORTS INTELLIGENCE AGENT
                </p>

                {/* Status indicators */}
                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
                  {[
                    { dot: "#4ade80", label: "VLR.GG LIVE" },
                    { dot: "#3b82f6", label: "LIQUIPEDIA"  },
                    { dot: "#a855f7", label: "GROQ LLM"    },
                  ].map(({ dot, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot, boxShadow: `0 0 6px ${dot}` }} />
                      <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.14em", color: "#444" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested questions */}
              <SuggestedQuestions onSelect={(q) => send(q)} />
            </div>
          )}

          {/* Messages */}
          <div style={{ paddingTop: isEmpty ? 0 : 24 }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}

            {/* Typing indicator when the response starts streaming */}
            {isStreaming && messages[messages.length - 1]?.content === "" && (
              <TypingIndicator />
            )}

            <div ref={bottomRef} style={{ height: 8 }} />
          </div>
        </div>
      </div>

      {/* ── Input area ─────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(8,8,8,0.96)",
        padding: "16px 20px 12px",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => send(input)}
            disabled={isStreaming}
          />

          {/* Status footer */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 10, flexWrap: "wrap", gap: 8,
          }}>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { dot: "#4ade80", label: "LIVE DATA" },
                { dot: "#3b82f6", label: "VCT INTEL"  },
              ].map(({ dot, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: dot, boxShadow: `0 0 5px ${dot}` }} />
                  <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.12em", color: "#333" }}>{label}</span>
                </div>
              ))}
            </div>
            <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", color: "#2a2a2a" }}>
              ENTER to send · SHIFT+ENTER for newline
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
