"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "GAME",      href: "/game"    },
  { label: "MATCHES",   href: "/matches" },
  { label: "TEAMS",     href: "/teams"   },
  { label: "PLAYERS",   href: "/players" },
  { label: "STATS",     href: "/stats"   },
  { label: "ANALYTICS", href: "/chat"    },
  { label: "DLC",       href: "/dlc"     },
];

const mono    = "var(--font-mono)";
const display = "var(--font-display)";
const dim     = "#4a4a4a";
const border  = "1px solid rgba(255,255,255,0.07)";

export default function PageNav() {
  const pathname = usePathname();

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,8,0.96)", backdropFilter: "blur(8px)" }}>

      {/* ── Top bar ─────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 0 16px", height: 52, borderBottom: border }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image src="/images/valo-logo.png" alt="V" width={18} height={18} style={{ opacity: 0.88 }} />
          <span style={{
            fontFamily: display, fontWeight: 700, fontSize: 13, letterSpacing: "0.22em",
            background: "linear-gradient(135deg, #a855f7 0%, #ec4899 45%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            VALO.BOT
          </span>
        </Link>

        <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.22em", color: dim }}>
          valorant esports intelligence
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.18em", color: dim }}>SYSTEM STATUS</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.8), 0 0 12px rgba(74,222,128,0.35)" }} />
          <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.18em", color: "#4ade80", textShadow: "0 0 8px rgba(74,222,128,0.5)" }}>ONLINE</span>
        </div>
      </div>

      {/* ── Nav bar ─────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 0 16px", height: 44, borderBottom: border }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["◈", "◉", "◫"].map((sym, i) => (
            <div key={i} style={{ width: 22, height: 22, border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.015)" }}>
              <span style={{ fontSize: 7, color: dim }}>{sym}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 22 }}>
          {NAV_ITEMS.map(({ label, href }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href) && href !== "/chat");
            return (
              <Link key={label} href={href} style={{
                fontFamily: mono, fontSize: 9, letterSpacing: "0.2em",
                textDecoration: "none",
                transition: "color 0.15s, text-shadow 0.15s",
                ...(active
                  ? {
                      color: "#f0f0f0",
                      textShadow: "0 0 12px rgba(255,255,255,0.35)",
                      borderBottom: "1px solid rgba(255,255,255,0.4)",
                      paddingBottom: 2,
                    }
                  : {
                      color: "#c0c0c0",
                      textShadow: "0 0 10px rgba(255,255,255,0.15)",
                    }),
              }}>
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
