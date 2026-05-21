"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GeometricBg from "./GeometricBg";

// ── Constants ────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "GAME",      href: "/game"    },
  { label: "MATCHES",   href: "/matches" },
  { label: "TEAMS",     href: "/teams"   },
  { label: "PLAYERS",   href: "/players" },
  { label: "STATS",     href: "/stats"   },
  { label: "ANALYTICS", href: "/chat"    },
  { label: "DLC",       href: "/dlc"     },
];

const S1_FEATURES = [
  "AI-powered esports analytics & real-time insights",
  "Live match data sourced directly from VLR.GG",
  "Deep team strategies & agent composition analysis",
  "Player career stats, form tracking & head-to-heads",
  "Live agent meta, map pool & patch impact breakdowns",
];

const SIDEBAR_MODES = [
  { label: "TODAY'S MATCHES", color: "#ef4444" },
  { label: "TEAM RANKINGS",   color: "#f97316" },
  { label: "PLAYER STATS",    color: "#3b82f6" },
  { label: "EVENT CALENDAR",  color: "#a855f7" },
];

const SIDEBAR_SOURCES = [
  { code: "VCT", name: "VCT.GG",     sub: "Official", color: "#4ade80", href: "https://www.vlr.gg"                  },
  { code: "LP",  name: "LIQUIPEDIA", sub: "Database", color: "#06b6d4", href: "https://liquipedia.net/valorant"     },
];

const S2_STATS  = [
  { val: "12+",  lbl: "TEAMS TRACKED",    col: "#efefef" },
  { val: "14+",  lbl: "PLAYERS PROFILED", col: "#efefef" },
  { val: "LIVE", lbl: "MATCH DATA",       col: "#4ade80" },
  { val: "24/7", lbl: "INTELLIGENCE",     col: "#3b82f6" },
];

const S2_NEON = [
  { color: "#4ade80", label: "LIVE VLR.GG DATA"    },
  { color: "#3b82f6", label: "TEAM STRATEGIES"      },
  { color: "#a855f7", label: "AGENT META"            },
  { color: "#f97316", label: "MAP POOL ANALYSIS"    },
  { color: "#ef4444", label: "TOURNAMENT INTEL"     },
  { color: "#06b6d4", label: "PLAYER PROFILES"      },
];

const S2_SOURCES = [
  { dot: "#4ade80", name: "VLR.GG",    sub: "Live match data"     },
  { dot: "#3b82f6", name: "LIQUIPEDIA",sub: "Tournament history"  },
  { dot: "#a855f7", name: "GROQ / LLM",sub: "AI analysis engine"  },
];

const BAR_H   = [55, 100, 38, 78, 44, 90, 60];
const BAR_H2  = [40, 70, 55, 90, 45, 80, 35, 95, 60, 75];

const headline = "var(--font-headline)";  // Bebas Neue — Valorant-style display font
const mono    = "var(--font-mono)";
const display = "var(--font-display)";
const ui      = "var(--font-ui)";
const bdr     = "1px solid rgba(255,255,255,0.07)";
const dim     = "#4a4a4a";  // metadata, coordinates — always stays dim
const mid     = "#777";

// Glow style helpers — apply to readable / interactive text
// Gradient brand style — matches the Valorant purple→pink→gold logo treatment
const gradientBrand: React.CSSProperties = {
  background: "linear-gradient(135deg, #a855f7 0%, #ec4899 45%, #f59e0b 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};
const glowNav   = { color: "#c0c0c0", textShadow: "0 0 10px rgba(255,255,255,0.18)"  } as const;
const glowItem  = { color: "#c8c8c8", textShadow: "0 0 8px rgba(255,255,255,0.15)"   } as const;
const glowHead  = "0 0 40px rgba(255,255,255,0.14), 0 0 80px rgba(255,255,255,0.05)";
const glowNum   = "0 0 20px rgba(255,255,255,0.28), 0 0 40px rgba(255,255,255,0.1)";

// ── Shared tiny components ────────────────────────────────────────
function NeonTag({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:7, padding:"4px 10px", border:`1px solid ${color}28`, background:`${color}08` }}>
      <span style={{ width:5, height:5, borderRadius:"50%", flexShrink:0, background:color, boxShadow:`0 0 6px ${color}, 0 0 12px ${color}55` }} />
      <span style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.14em", color:"#aaaaaa" }}>{label}</span>
    </div>
  );
}

function NavBar() {
  return (
    <div style={{ gridColumn:"1 / -1", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px 0 16px", height:44, borderBottom:bdr }}>
      <div style={{ display:"flex", gap:4 }}>
        {["◈","◉","◫"].map((s,i)=>(
          <div key={i} style={{ width:22, height:22, border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.015)" }}>
            <span style={{ fontSize:7, color:dim }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:22 }}>
        {NAV_LINKS.map(({label,href})=>(
          <Link key={label} href={href} style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.2em", textDecoration:"none", ...glowNav }}>{label}</Link>
        ))}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef   = useRef<HTMLDivElement>(null);
  const omenRef = useRef<HTMLDivElement>(null);

  // Screen 1 refs
  const s1TopRef  = useRef<HTMLElement>(null);
  const s1NavRef  = useRef<HTMLElement>(null);
  const s1WelRef  = useRef<HTMLParagraphElement>(null);
  const s1HedRef  = useRef<HTMLHeadingElement>(null);
  const s1FeatRef = useRef<HTMLUListElement>(null);
  const s1NeonRef = useRef<HTMLDivElement>(null);
  const s1CtaRef  = useRef<HTMLDivElement>(null);
  const s1SideRef = useRef<HTMLElement>(null);
  const s1FootRef = useRef<HTMLElement>(null);

  // Screen 2 — animated as a single unit
  const s2Ref = useRef<HTMLDivElement>(null);

  // Glitch effect state
  const [isGlitching, setIsGlitching] = useState(false);
  type GlitchBar = { top: string; left: string; width: string; height: string; color: string; opacity: number; delay: number; repeat: number; };
  const glitchBarsRef = useRef<GlitchBar[]>([]);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=260%",
          scrub: 1.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      // ── Background dives in throughout ──
      tl.to(bgRef.current, { scale: 1.65, ease: "none", duration: 1 }, 0);

      // ── Omen sweeps to complete left throughout ──
      tl.to(omenRef.current, { x: "-53vw", scale: 0.86, ease: "none", duration: 1 }, 0);

      // ── Screen 1 exits (0 → 0.55s) ──
      tl.to([s1TopRef.current, s1NavRef.current], { yPercent: -130, opacity: 0, ease: "power1.in", duration: 0.45 }, 0);
      tl.to(s1WelRef.current,  { yPercent: -50, opacity: 0, ease: "none", duration: 0.42 }, 0);
      tl.to(s1HedRef.current,  { yPercent: -48, scale: 1.12, opacity: 0, ease: "none", duration: 0.50 }, 0);
      tl.to(s1FeatRef.current, { yPercent: -32, opacity: 0, ease: "none", duration: 0.45 }, 0);
      tl.to(s1NeonRef.current, { yPercent: -20, opacity: 0, ease: "none", duration: 0.40 }, 0.05);
      tl.to(s1CtaRef.current,  { opacity: 0, scale: 0.94, ease: "power1.in", duration: 0.38 }, 0.16);
      tl.to(s1SideRef.current, { xPercent: 120, opacity: 0, ease: "none", duration: 0.45 }, 0);
      tl.to(s1FootRef.current, { yPercent: 120, opacity: 0, ease: "none", duration: 0.45 }, 0);

      // ── Screen 2 fades in simultaneously (0.42s → 0.90s) ──
      // autoAlpha = opacity + visibility together — visibility:hidden blocks pointer events
      // when opacity is 0, so Screen 1 links are never intercepted by the invisible overlay
      tl.fromTo(s2Ref.current,
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, ease: "none", duration: 0.48 },
        0.42,
      );
    }, heroRef);

    // ── Text glitch scheduler ──────────────────────────────────────
    // Fires every 5-13s. Adds .glitch-active to headline spans via React
    // state — CSS ::before / ::after handle the red/cyan channel split.
    // Small red pixel particles appear as additional glitch artifacts.
    const scheduleGlitch = () => {
      const delay = 5000 + Math.random() * 8000;
      glitchTimerRef.current = setTimeout(() => {
        // Generate small pixel particle squares (mostly red, like the reference)
        glitchBarsRef.current = Array.from({ length: 24 }, () => ({
          top:    `${Math.random() * 92}%`,
          left:   `${Math.random() * 88}%`,
          width:  `${4 + Math.random() * 16}px`,
          height: Math.random() > 0.55
            ? `${4 + Math.random() * 16}px`   // square
            : `${2 + Math.random() * 4}px`,   // thin bar
          color:  Math.random() > 0.18 ? "#ff1744" : "#ffffff",
          opacity: 0.5 + Math.random() * 0.5,
          delay:  Math.random() * 0.2,
          repeat: Math.floor(3 + Math.random() * 5),
        }));

        setIsGlitching(true);
        // CSS animation duration is 0.55s → deactivate slightly after
        setTimeout(() => setIsGlitching(false), 650);

        scheduleGlitch();
      }, delay);
    };
    scheduleGlitch();

    return () => {
      ctx.revert();
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, []);

  // ── shared corner brackets ──────────────────────────────────────
  const corners = (
    <>
      {([{ top:0,left:0 },{ top:0,right:0 },{ bottom:0,left:0 },{ bottom:0,right:0 }] as React.CSSProperties[]).map((pos,i)=>(
        <div key={i} style={{ position:"absolute", ...pos, width:40, height:40, zIndex:50, pointerEvents:"none" }}>
          <div style={{ position:"absolute", ...("top"in pos?{top:0}:{bottom:0}), left:0, right:0, height:1, background:"rgba(255,255,255,0.22)" }} />
          <div style={{ position:"absolute", ...("left"in pos?{left:0}:{right:0}), top:0, bottom:0, width:1, background:"rgba(255,255,255,0.22)" }} />
        </div>
      ))}
    </>
  );

  return (
    <div ref={heroRef} style={{ position:"relative", width:"100vw", height:"100vh", overflow:"hidden", background:"#080808", outline:"1px solid rgba(255,255,255,0.06)", outlineOffset:"-1px" }}>

      {/* ── Background — pure black + scanlines only (texture removed so geometry is visible) */}
      <div ref={bgRef} style={{ position:"absolute", inset:0, zIndex:0, transformOrigin:"center center", willChange:"transform", background:"#080808" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)" }} />
      </div>

      {corners}

      {/* ── Geometric background decoration ─────────────── */}
      <GeometricBg />

      {/* ── Omen ─────────────────────────────────────────── */}
      <div ref={omenRef} className="hero-omen" style={{ position:"absolute", right:196, bottom:86, top:96, width:"clamp(290px,37vw,530px)", zIndex:15, pointerEvents:"none", transformOrigin:"bottom center", willChange:"transform" }}>
        <Image src="/images/omen.png" alt="Omen" fill priority
          style={{ objectFit:"contain", objectPosition:"bottom center",
            filter:"grayscale(1) brightness(0.78) drop-shadow(0 0 28px rgba(255,255,255,0.06))" }} />
      </div>

      {/* ══════════════════════════════════════════════════
          SCREEN 1
      ══════════════════════════════════════════════════ */}
      <div className="hero-grid-layout" style={{ position:"absolute", inset:0 }}>

        {/* TOP BAR */}
        <header ref={s1TopRef} style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px 0 16px", borderBottom:bdr, willChange:"transform, opacity" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Image src="/images/valo-logo.png" alt="V" width={18} height={18} style={{ opacity:0.85 }} />
            <span style={{ fontFamily:display, fontWeight:700, fontSize:13, letterSpacing:"0.22em", ...gradientBrand }}>VALO.BOT</span>
            <span style={{ fontFamily:mono, fontSize:12, color:dim, marginLeft:10, letterSpacing:"0.1em" }}>A2 / 6.6.8</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ position:"relative", width:14, height:14 }}>
              <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"rgba(255,255,255,0.18)", transform:"translateY(-50%)" }} />
              <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:1, background:"rgba(255,255,255,0.18)", transform:"translateX(-50%)" }} />
            </div>
            <span style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.22em", color:dim }}>valorant esports intelligence</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.18em", color:dim }}>SYSTEM STATUS</span>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 5px rgba(74,222,128,0.7)" }} />
            <span style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.18em", color:"#4ade80" }}>ONLINE</span>
          </div>
        </header>

        {/* NAV */}
        <nav ref={s1NavRef} style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px 0 16px", borderBottom:bdr, willChange:"transform, opacity" }}>
          <div style={{ display:"flex", gap:4 }}>
            {["◈","◉","◫"].map((s,i)=>(
              <div key={i} style={{ width:22, height:22, border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.015)" }}>
                <span style={{ fontSize:7, color:dim }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:22 }}>
            {NAV_LINKS.map(({label,href})=>(
              <Link key={label} href={href} style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.2em", textDecoration:"none", ...glowNav }}>{label}</Link>
            ))}
          </div>
        </nav>

        {/* MAIN LEFT */}
        <main style={{ gridColumn:"1", gridRow:"3", position:"relative", display:"flex", flexDirection:"column", padding:"26px 0 20px 20px", overflow:"hidden", zIndex:12 }}>
          <p ref={s1WelRef} style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.18em", color:dim, marginBottom:10, willChange:"transform, opacity" }}>
            WELCOME TO VALO.BOT &nbsp;/&nbsp; IS AGENT AI · V1.T.1
          </p>
          <h1 ref={s1HedRef} style={{ fontFamily:headline, textTransform:"uppercase", lineHeight:0.9, letterSpacing:"0.04em", fontSize:"clamp(64px,9vw,130px)", marginBottom:22, willChange:"transform, opacity" }}>
            <span
              className={isGlitching ? "glitch-line glitch-active" : "glitch-line"}
              data-text="VALORANT"
              style={{ ...gradientBrand }}
            >VALORANT</span>
            <span style={{ display:"block", color:"#0a0a0a", WebkitTextStroke:"1.5px rgba(255,255,255,0.45)" }}>
              ESPORTS
            </span>
            <span
              className={isGlitching ? "glitch-line glitch-active" : "glitch-line"}
              data-text="INTELLIGENCE"
              style={{ color:"#f0f0f0", textShadow:glowHead }}
            >INTELLIGENCE</span>
          </h1>
          <ul ref={s1FeatRef} style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:5, willChange:"transform, opacity" }}>
            {S1_FEATURES.map(f=>(
              <li key={f} style={{ display:"flex", alignItems:"flex-start", gap:8, fontFamily:mono, fontSize:13, color:"#8a8a8a", letterSpacing:"0.04em", lineHeight:1.5 }}>
                <span style={{ color:"#555", marginTop:1, fontSize:8 }}>▸</span>{f}
              </li>
            ))}
          </ul>
          <div ref={s1NeonRef} style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:18, willChange:"transform, opacity" }}>
            <NeonTag color="#4ade80" label="LIVE MATCH DATA"   />
            <NeonTag color="#3b82f6" label="TEAM INTEL"        />
            <NeonTag color="#a855f7" label="META ANALYSIS"     />
            <NeonTag color="#f97316" label="PLAYER PROFILES"   />
            <NeonTag color="#ef4444" label="VCT RANKINGS"      />
          </div>
          <div style={{ flex:1 }} />
          <div ref={s1CtaRef} style={{ willChange:"transform, opacity" }}>
            <Link href="/chat" style={{ display:"flex", alignItems:"center", border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.02)", padding:"10px 12px", maxWidth:440, gap:10, textDecoration:"none" }}>
              <span style={{ fontFamily:ui, fontSize:12, color:"#3a3a3a", flex:1, letterSpacing:"0.03em" }}>Ask anything about Valorant esports...</span>
              <div style={{ width:26, height:26, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:mono, fontSize:12, color:"#666" }}>→</span>
              </div>
            </Link>
          </div>
        </main>

        {/* SIDEBAR — neon items */}
        <aside ref={s1SideRef} className="hero-sidebar" style={{ gridColumn:"2", gridRow:"3", borderLeft:bdr, display:"flex", flexDirection:"column", padding:"16px 12px 14px", overflow:"hidden", willChange:"transform, opacity", zIndex:20 }}>
          <p style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.22em", color:dim, marginBottom:10, borderBottom:"1px solid rgba(255,255,255,0.04)", paddingBottom:7 }}>
            SHOW MODES
          </p>
          {SIDEBAR_MODES.map(({label,color})=>(
            <Link key={label} href="/chat" style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", border:`1px solid ${color}18`, background:`${color}06`, marginBottom:4, textDecoration:"none" }}>
              {/* Neon icon box */}
              <div style={{ width:18, height:18, flexShrink:0, border:`1px solid ${color}40`, background:`${color}12`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:color, boxShadow:`0 0 5px ${color}` }} />
              </div>
              <span style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.1em", ...glowItem }}>{label}</span>
            </Link>
          ))}

          <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", margin:"10px 0" }} />

          <p style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.22em", color:dim, marginBottom:8 }}>LIVE NUMBERS</p>
          {SIDEBAR_SOURCES.map(({code,name,sub,color,href})=>(
            <a key={name} href={href} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 8px", marginBottom:4, border:`1px solid ${color}28`, background:`${color}08`, textDecoration:"none", cursor:"pointer" }}>
              <div style={{ width:20, height:20, flexShrink:0, border:`1px solid ${color}50`, background:`${color}14`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:mono, fontSize:12, color, letterSpacing:"0.04em" }}>{code}</span>
              </div>
              <div>
                <p style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.1em" }}>
                  <span style={{ color, textShadow:`0 0 8px ${color}88` }}>{name}</span>
                </p>
                <p style={{ fontFamily:mono, fontSize:13, color:"#666", letterSpacing:"0.06em" }}>{sub}</p>
              </div>
            </a>
          ))}

          <div style={{ flex:1 }} />
          <p style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.1em", color:"#222", lineHeight:1.7 }}>
            INTELLIGENCE IS THE<br />ULTIMATE WEAPON.
          </p>
        </aside>

        {/* FOOTER */}
        <footer ref={s1FootRef} className="hero-footer-full" style={{ gridColumn:"1/-1", gridRow:"4", borderTop:bdr, display:"flex", alignItems:"center", padding:"0 20px", gap:20, willChange:"transform, opacity" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:2, minWidth:48 }}>
            <span style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.22em", color:dim }}>LIVE MATCHES</span>
            <span style={{ fontFamily:display, fontWeight:900, fontSize:38, color:"#f5f5f5", lineHeight:1, textShadow:glowNum }}>24</span>
            <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:14, marginTop:3 }}>
              {BAR_H.map((h,i)=>(<div key={i} style={{ width:4, height:`${h*0.14}px`, background:`rgba(255,255,255,${0.08+h*0.002})` }} />))}
            </div>
          </div>
          <div style={{ width:1, height:54, background:"rgba(255,255,255,0.07)", flexShrink:0 }} />
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            <span style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.22em", color:dim }}>NEXT MAJOR</span>
            <span style={{ fontFamily:mono, fontSize:13, letterSpacing:"0.14em", color:"#b0b0b0" }}>ACT: MASTERS TORONTO</span>
            <div style={{ display:"flex", gap:18, marginTop:2 }}>
              {[["05","DAYS"],["14","HRS"],["32","MINS"],["34","SECS"]].map(([n,l])=>(
                <div key={l} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
                  <span style={{ fontFamily:display, fontWeight:700, fontSize:22, color:"#e8e8e8", lineHeight:1, textShadow:"0 0 12px rgba(255,255,255,0.2)" }}>{n}</span>
                  <span style={{ fontFamily:mono, fontSize:13, letterSpacing:"0.14em", color:"#444" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex:1 }} />
          <p style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.1em", color:"#1e1e1e", lineHeight:1.7, textAlign:"right" }}>
            INTELLIGENCE IS THE ULTIMATE WEAPON.<br />CYPHER SEES ALL.
          </p>
        </footer>
      </div>

      {/* ══════════════════════════════════════════════════
          SCREEN 2  (fades in over Screen 1 as Omen arrives left)
      ══════════════════════════════════════════════════ */}
      <div ref={s2Ref} className="hero-grid-layout" style={{ position:"absolute", inset:0, zIndex:10, visibility:"hidden", willChange:"transform, opacity" }}>

        {/* TOP BAR */}
        <header style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px 0 16px", borderBottom:bdr, background:"rgba(8,8,8,0.5)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Image src="/images/valo-logo.png" alt="V" width={18} height={18} style={{ opacity:0.85 }} />
            <span style={{ fontFamily:display, fontWeight:700, fontSize:13, letterSpacing:"0.22em", ...gradientBrand }}>VALO.BOT</span>
            <span style={{ fontFamily:mono, fontSize:12, color:dim, marginLeft:10, letterSpacing:"0.1em" }}>SCREEN 02 / DEPLOY</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ position:"relative", width:14, height:14 }}>
              <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"rgba(255,255,255,0.18)", transform:"translateY(-50%)" }} />
              <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:1, background:"rgba(255,255,255,0.18)", transform:"translateX(-50%)" }} />
            </div>
            <span style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.22em", color:dim }}>— BRIEFING COMPLETE —</span>
          </div>
          <NeonTag color="#4ade80" label="CYPHER ACTIVE" />
        </header>

        {/* NAV */}
        <nav style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px 0 16px", borderBottom:bdr, background:"rgba(8,8,8,0.5)" }}>
          <div style={{ display:"flex", gap:4 }}>
            {["◈","◉","◫"].map((s,i)=>(
              <div key={i} style={{ width:22, height:22, border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.015)" }}>
                <span style={{ fontSize:7, color:dim }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:22 }}>
            {NAV_LINKS.map(({label,href})=>(
              <Link key={label} href={href} style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.2em", textDecoration:"none", ...glowNav }}>{label}</Link>
            ))}
          </div>
        </nav>

        {/* MAIN — content starts right of where Omen rests */}
        <main style={{ gridColumn:"1", gridRow:"3", display:"flex", flexDirection:"column", padding:"30px 32px 24px", paddingLeft:"clamp(260px,34vw,480px)", overflow:"hidden" }}>
          <p style={{ fontFamily:mono, fontSize:12, letterSpacing:"0.22em", color:dim, marginBottom:14 }}>— DEPLOY CYPHER / AGENT READY</p>

          {/* Big headline: solid / outline / solid */}
          <h2 style={{ fontFamily:headline, textTransform:"uppercase", lineHeight:0.9, letterSpacing:"0.04em", fontSize:"clamp(54px,7.8vw,112px)", marginBottom:24 }}>
            <span
              className={isGlitching ? "glitch-line glitch-active" : "glitch-line"}
              data-text="READY"
              style={{ color:"#f0f0f0", textShadow:glowHead }}
            >READY</span>
            <span style={{ display:"block", color:"#0a0a0a", WebkitTextStroke:"1.5px rgba(255,255,255,0.4)" }}>TO</span>
            <span
              className={isGlitching ? "glitch-line glitch-active" : "glitch-line"}
              data-text="DOMINATE"
              style={{ color:"#f0f0f0", textShadow:glowHead }}
            >DOMINATE</span>
          </h2>

          {/* Stat blocks */}
          <div style={{ display:"flex", gap:1, marginBottom:20 }}>
            {S2_STATS.map(({val,lbl,col})=>(
              <div key={lbl} style={{ padding:"12px 16px", border:bdr, background:"rgba(255,255,255,0.02)", minWidth:82 }}>
                <p style={{ fontFamily:display, fontWeight:900, fontSize:26, color:col, lineHeight:1, letterSpacing:"0.04em", textShadow:`0 0 16px ${col}55` }}>{val}</p>
                <p style={{ fontFamily:mono, fontSize:14, color:"#666", letterSpacing:"0.14em", marginTop:4 }}>{lbl}</p>
              </div>
            ))}
          </div>

          {/* Neon capability tags */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:22 }}>
            {S2_NEON.map(({color,label})=>(
              <NeonTag key={label} color={color} label={label} />
            ))}
          </div>

          <p style={{ fontFamily:mono, fontSize:13, color:"#999", letterSpacing:"0.05em", lineHeight:1.85, maxWidth:480, marginBottom:28 }}>
            CYPHER has eyes on every team in every region. Ask about playstyle, strategy, roster changes, match results, agent meta — anything. Real intel, no filler.
          </p>

          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <Link href="/chat" style={{ fontFamily:display, fontWeight:700, fontSize:15, letterSpacing:"0.2em", textDecoration:"none", color:"#080808", background:"#efefef", padding:"13px 32px", clipPath:"polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))", display:"inline-block" }}>
              ENTER CYPHER
            </Link>
            <Link href="/matches" style={{ fontFamily:display, fontWeight:700, fontSize:13, letterSpacing:"0.18em", textDecoration:"none", color:"#0a0a0a", WebkitTextStroke:"1px rgba(255,255,255,0.45)", border:"1px solid rgba(255,255,255,0.15)", padding:"12px 24px", display:"inline-block" }}>
              VIEW MATCHES
            </Link>
          </div>
        </main>

        {/* SIDEBAR — mission brief */}
        <aside style={{ gridColumn:"2", gridRow:"3", borderLeft:bdr, display:"flex", flexDirection:"column", padding:"18px 14px 16px", overflow:"hidden", zIndex:20 }}>
          <p style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.22em", color:dim, marginBottom:12, borderBottom:"1px solid rgba(255,255,255,0.04)", paddingBottom:8 }}>MISSION BRIEF</p>
          {[
            { label:"MISSION TYPE", value:"INTEL GATHER", color:undefined },
            { label:"TARGET",       value:"VCT ESPORTS",  color:undefined },
            { label:"CLEARANCE",    value:"AGENT LVL",    color:undefined },
            { label:"STATUS",       value:"READY",        color:"#4ade80" },
          ].map(({label,value,color})=>(
            <div key={label} style={{ marginBottom:10 }}>
              <p style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.18em", color:dim, marginBottom:2 }}>{label}</p>
              <p style={{ fontFamily:mono, fontSize:13, letterSpacing:"0.1em", color:color ?? "#aaaaaa", textShadow: color ? `0 0 8px ${color}88` : "0 0 8px rgba(255,255,255,0.1)" }}>{value}</p>
            </div>
          ))}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", margin:"10px 0" }} />
          <p style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.22em", color:dim, marginBottom:10 }}>INTEL SOURCES</p>
          {S2_SOURCES.map(({dot,name,sub})=>(
            <div key={name} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:dot, boxShadow:`0 0 5px ${dot}`, flexShrink:0 }} />
              <div>
                <p style={{ fontFamily:mono, fontSize:12, color:"#aaa", letterSpacing:"0.1em" }}>{name}</p>
                <p style={{ fontFamily:mono, fontSize:14, color:"#555", letterSpacing:"0.06em" }}>{sub}</p>
              </div>
            </div>
          ))}
          <div style={{ flex:1 }} />
          <p style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.1em", color:"#1e1e1e", lineHeight:1.7 }}>CYPHER SEES ALL.<br />NOTHING ESCAPES.</p>
        </aside>

        {/* FOOTER */}
        <footer style={{ gridColumn:"1/-1", gridRow:"4", borderTop:bdr, display:"flex", alignItems:"center", padding:"0 20px", gap:20, background:"rgba(8,8,8,0.5)" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            <span style={{ fontFamily:mono, fontSize:14, letterSpacing:"0.22em", color:dim }}>ACTIVITY</span>
            <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:24, marginTop:2 }}>
              {BAR_H2.map((h,i)=>(<div key={i} style={{ width:5, height:`${h*0.24}px`, background:`rgba(255,255,255,${0.06+h*0.003})` }} />))}
            </div>
          </div>
          <div style={{ width:1, height:40, background:"rgba(255,255,255,0.07)", flexShrink:0 }} />
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <NeonTag color="#4ade80" label="VCT AMERICAS LIVE" />
            <NeonTag color="#3b82f6" label="EMEA PLAYOFFS"     />
            <NeonTag color="#a855f7" label="PACIFIC GF TODAY"  />
          </div>
          <div style={{ flex:1 }} />
          <p style={{ fontFamily:display, fontWeight:900, fontSize:"clamp(16px,2vw,26px)", textTransform:"uppercase", letterSpacing:"0.06em", lineHeight:1, color:"#0a0a0a", WebkitTextStroke:"1px rgba(255,255,255,0.18)" }}>
            ASK. ANALYSE. DOMINATE.
          </p>
        </footer>
      </div>

      {/* ── Glitch particles — small red/white pixel squares ──────── */}
      {isGlitching && (
        <div style={{ position:"absolute", inset:0, zIndex:200, pointerEvents:"none", overflow:"hidden" }}>
          {glitchBarsRef.current.map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: p.top,
                left: p.left,
                width: p.width,
                height: p.height,
                background: p.color,
                opacity: p.opacity,
                animation: `glitch-particle 0.12s steps(2, end) ${p.delay}s ${p.repeat} alternate`,
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
}
